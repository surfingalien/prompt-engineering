const express = require('express');
const path = require('path');
const fs = require('fs');
const { rateLimit } = require('express-rate-limit');
const governance = require('./governance');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Anthropic call helper ─────────────────────────────────────────────────
// Centralizes the upstream request so caching, Helicone routing, and headers
// stay consistent across /api/chat, /api/scout, and the Scout verifier pass.
// Set HELICONE_API_KEY to route calls through Helicone for per-request cost,
// latency, and prompt-version observability — no code changes needed beyond
// the env var. Unset, this talks to the Anthropic API directly.
function anthropicRequest(apiKey, body) {
  const heliconeKey = process.env.HELICONE_API_KEY;
  const url = heliconeKey ? 'https://anthropic.helicone.ai/v1/messages' : 'https://api.anthropic.com/v1/messages';
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
  };
  if (heliconeKey) headers['Helicone-Auth'] = `Bearer ${heliconeKey}`;
  return fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
}

// ── Rate limiting ──────────────────────────────────────────────────────────
// ANTHROPIC_API_KEY lives server-side, so these routes are the only thing
// standing between a public deployment and an open-ended API bill.
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many requests. Please try again in a few minutes.' },
});
const scoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many Scout requests. Please try again in a few minutes.' },
});

// Proxy endpoint — keeps ANTHROPIC_API_KEY server-side only
app.post('/api/chat', chatLimiter, async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured on server.' });
  }
  try {
    const upstream = await anthropicRequest(apiKey, req.body);
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Upstream API request failed.', detail: err.message });
  }
});

// Scout endpoint — generates new skills & agents using Claude's knowledge
app.post('/api/scout', scoutLimiter, async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured on server.' });
  }
  const { topic = 'AI agents and prompt engineering', count = 3, type = 'both', model = 'claude-sonnet-4-6' } = req.body;
  const ALLOWED_MODELS = ['claude-sonnet-4-6','claude-opus-4-8','claude-haiku-4-5-20251001'];
  const scoutModel = ALLOWED_MODELS.includes(model) ? model : 'claude-sonnet-4-6';

  // Single-sourced from prompts/scout-system.txt so the promptfoo eval suite
  // (promptfooconfig.yaml) tests the exact prompt this endpoint runs.
  const systemPrompt = fs.readFileSync(path.join(__dirname, 'prompts', 'scout-system.txt'), 'utf8');

  const userMsg = `Discover and generate ${count} new ${type === 'skills' ? 'skills only (agents array empty)' : type === 'agents' ? 'agents only (skills array empty)' : 'skills AND agents'} focused on: "${topic}"

Requirements:
- Skills must be practical, production-grade prompt templates
- Agents must have strong identity, clear capabilities, concrete operating procedures
- Content must be genuinely useful for AI practitioners
- Avoid duplicating common patterns already well-covered (basic CoT, simple role prompts)
- Focus on: advanced orchestration, specialized domains, emerging techniques, real workflows
- Each skill prompt should include: context, instructions, output format, at least one {{variable}}
- Each agent text should include: identity statement, core capabilities list, operating procedures, output standards

Today's date: ${new Date().toISOString().split('T')[0]}
Topic focus: ${topic}`;

  try {
    // The system prompt is identical on every call — cache it so repeated
    // Scout runs only pay full price for the first request in the window.
    const upstream = await anthropicRequest(apiKey, {
      model: scoutModel,
      max_tokens: 8000,
      system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: userMsg }],
    });
    const data = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status).json({ error: data.error?.message || JSON.stringify(data.error) || 'API error', detail: JSON.stringify(data).slice(0, 300) });

    const rawText = data.content?.[0]?.text || '';

    // Extract JSON robustly
    let parsed;
    try {
      // Try direct parse first
      parsed = JSON.parse(rawText);
    } catch {
      // Extract JSON block if wrapped in markdown
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        return res.status(500).json({ error: 'Scout returned unparseable response', raw: rawText.slice(0, 500) });
      }
    }

    // Validate and sanitize
    let skills = (parsed.skills || []).filter(s => s.id && s.name && s.prompt && s.cat);
    let agents = (parsed.agents || []).filter(a => a.name && a.text && a.source);

    // Ensure all scout skill IDs are prefixed with scout-
    skills.forEach(s => {
      if (!s.id.startsWith('scout-')) s.id = `scout-${s.id}`;
      s.origin = s.origin || 'Scout Discovery';
    });
    agents.forEach(a => { a.source = 'Scout'; });

    // ── Governance gate: policy rules run before anything reaches the client.
    // Denied items are dropped (and reported in meta.rejected); review items
    // are returned flagged so the UI warns before a library save.
    const rejected = [];
    const gate = (kind, items) => items.filter(item => {
      const policy = governance.evaluateItem(kind, item);
      if (policy.decision === 'deny') {
        rejected.push({ kind, key: kind === 'skill' ? item.id : item.name, stage: 'policy', reasons: policy.reasons });
        return false;
      }
      item.governance = policy;
      return true;
    });
    skills = gate('skill', skills);
    agents = gate('agent', agents);

    // ── Cross-model verification: a DIFFERENT Claude model judges each item
    // (pass/fail only — no rewriting), so the generator never grades its own
    // work. Fail-open: if the verifier call breaks, items proceed unverified
    // and score accordingly. Disable with SCOUT_VERIFY=0.
    let verifyTokens = { input: 0, output: 0 };
    const verdicts = new Map();
    const verifyEnabled = process.env.SCOUT_VERIFY !== '0' && (skills.length || agents.length);
    if (verifyEnabled) {
      try {
        const vres = await anthropicRequest(apiKey, {
          model: governance.verifierModel(scoutModel),
          max_tokens: 120 * (skills.length + agents.length) + 100,
          messages: [{ role: 'user', content: governance.verifierPrompt(skills, agents) }],
        });
        const vdata = await vres.json();
        if (vres.ok) {
          verifyTokens = { input: vdata.usage?.input_tokens || 0, output: vdata.usage?.output_tokens || 0 };
          const vtext = vdata.content?.[0]?.text || '';
          const vmatch = vtext.match(/\[[\s\S]*\]/);
          for (const v of JSON.parse(vmatch ? vmatch[0] : vtext)) {
            if (v && v.key && (v.verdict === 'pass' || v.verdict === 'fail')) {
              verdicts.set(`${v.kind}:${v.key}`, { verdict: v.verdict, reason: v.reason || '' });
            }
          }
        }
      } catch (err) {
        console.warn('Scout verifier pass failed (continuing unverified):', err.message);
      }
    }

    // ── Trust scoring + audit. Verified failures are dropped like policy
    // denials — a second model judged them broken or unsafe.
    const finalize = (kind, items) => items.filter(item => {
      const key = kind === 'skill' ? item.id : item.name;
      const verification = verdicts.get(`${kind}:${key}`) || null;
      if (verification && verification.verdict === 'fail') {
        rejected.push({ kind, key, stage: 'verification', reasons: [verification.reason] });
        return false;
      }
      item.verification = verification || { verdict: 'unverified', reason: verifyEnabled ? 'verifier gave no verdict' : 'verification disabled' };
      item.trust = governance.trustScore(kind, item, { policy: item.governance, verification });
      return true;
    });
    skills = finalize('skill', skills);
    agents = finalize('agent', agents);

    const auditEntry = governance.appendAudit({
      topic,
      scout_model: scoutModel,
      verifier_model: verifyEnabled ? governance.verifierModel(scoutModel) : null,
      accepted: [
        ...skills.map(s => ({ kind: 'skill', key: s.id, digest: governance.itemDigest('skill', s), tier: s.trust.tier, score: s.trust.score })),
        ...agents.map(a => ({ kind: 'agent', key: a.name, digest: governance.itemDigest('agent', a), tier: a.trust.tier, score: a.trust.score })),
      ],
      rejected,
    });

    res.json({
      skills,
      agents,
      meta: {
        topic,
        generated_at: new Date().toISOString(),
        skills_count: skills.length,
        agents_count: agents.length,
        rejected,
        audit_seq: auditEntry.seq,
        audit_hash: auditEntry.hash,
        tokens_used: {
          input: (data.usage?.input_tokens || 0) + verifyTokens.input,
          output: (data.usage?.output_tokens || 0) + verifyTokens.output,
        },
      }
    });
  } catch (err) {
    res.status(502).json({ error: 'Scout request failed.', detail: err.message });
  }
});

// Scout audit chain — every run's accepted/rejected items with hash linkage
app.get('/api/scout/audit', (req, res) => {
  const limit = Math.max(1, Math.min(200, parseInt(req.query.limit) || 50));
  res.json(governance.readAuditLog().slice(-limit).reverse());
});

// Recompute the whole chain; pinpoints the first tampered entry if any
app.get('/api/scout/audit/verify', (req, res) => {
  res.json(governance.verifyAuditChain());
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PromptForge running at http://localhost:${PORT}`);
});

module.exports = app;
