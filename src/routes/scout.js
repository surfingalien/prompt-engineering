'use strict';
// ─── AI Intelligence Scout ───────────────────────────────────────────────────
// Original feature by @surfingalien (attribution required — see README).
// Generates new skills/agents, gates them through policy + cross-model
// verification + trust scoring, and records every run in a hash-chained log.

const express = require('express');
const fs = require('fs');
const path = require('path');
const governance = require('../governance');
const { getClient, complete, describeError } = require('../anthropic');
const { resolveModel } = require('../models');

const PROMPT_PATH = path.join(__dirname, '..', '..', 'prompts', 'scout-system.txt');
const SKILL_CATS = ['research', 'code', 'agent', 'ml', 'writing', 'devops', 'security', 'testing', 'frontend', 'backend', 'product', 'design'];
const AGENT_CATS = ['research', 'core-development', 'data-ai', 'infrastructure', 'specialized-domains', 'orchestration', 'quality-assurance'];

// Structured outputs guarantee the response parses against this schema —
// no more regex-scraping JSON out of free text.
const SCOUT_FORMAT = {
  type: 'json_schema',
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['skills', 'agents'],
    properties: {
      skills: {
        type: 'array',
        items: {
          type: 'object', additionalProperties: false,
          required: ['id', 'name', 'cat', 'origin', 'desc', 'prompt'],
          properties: {
            id: { type: 'string' }, name: { type: 'string' }, cat: { type: 'string', enum: SKILL_CATS },
            origin: { type: 'string' }, desc: { type: 'string' }, prompt: { type: 'string' },
          },
        },
      },
      agents: {
        type: 'array',
        items: {
          type: 'object', additionalProperties: false,
          required: ['name', 'source', 'cat', 'tags', 'text'],
          properties: {
            name: { type: 'string' }, source: { type: 'string' }, cat: { type: 'string', enum: AGENT_CATS },
            tags: { type: 'array', items: { type: 'string' } }, text: { type: 'string' },
          },
        },
      },
    },
  },
};

function parseJsonLoose(text, opener) {
  try { return JSON.parse(text); } catch {}
  const re = opener === '[' ? /\[[\s\S]*\]/ : /\{[\s\S]*\}/;
  const m = text.match(re);
  return m ? JSON.parse(m[0]) : null;
}

// One cross-model pass (assess-only, fail-open).
async function verify(client, scoutModel, skills, agents) {
  const verdicts = new Map();
  let usage = { input: 0, output: 0 };
  if (process.env.SCOUT_VERIFY === '0' || !(skills.length || agents.length)) return { verdicts, usage, enabled: false };
  try {
    const { text, message } = await complete(client, {
      model: governance.verifierModel(scoutModel),
      maxTokens: 160 * (skills.length + agents.length) + 400,
      effort: 'low',
      messages: [{ role: 'user', content: governance.verifierPrompt(skills, agents) }],
    });
    usage = { input: message.usage?.input_tokens || 0, output: message.usage?.output_tokens || 0 };
    for (const v of parseJsonLoose(text, '[') || []) {
      if (v && v.key && (v.verdict === 'pass' || v.verdict === 'fail')) verdicts.set(`${v.kind}:${v.key}`, { verdict: v.verdict, reason: v.reason || '' });
    }
  } catch (err) {
    console.warn('Scout verifier pass failed (continuing unverified):', err.message);
  }
  return { verdicts, usage, enabled: true };
}

module.exports = function scoutRoutes({ scoutLimiter }) {
  const router = express.Router();

  router.post('/scout', scoutLimiter, async (req, res) => {
    const client = getClient();
    if (!client) return res.status(503).json({ error: 'ANTHROPIC_API_KEY is not configured on the server.', code: 'no_api_key' });

    const body = req.body || {};
    const topic = String(body.topic || 'AI agents and prompt engineering').replace(/[\r\n]+/g, ' ').slice(0, 200).trim();
    const count = Math.max(1, Math.min(6, parseInt(body.count, 10) || 3));
    const type = ['skills', 'agents', 'both'].includes(body.type) ? body.type : 'both';
    const scoutModel = resolveModel(body.model).id;
    const systemPrompt = fs.readFileSync(PROMPT_PATH, 'utf8');

    const userMsg = `Discover and generate ${count} new ${type === 'skills' ? 'skills only (agents array empty)' : type === 'agents' ? 'agents only (skills array empty)' : 'skills AND agents'} focused on the topic in <topic>.

<topic>${topic}</topic>

Requirements:
- Skills must be practical, production-grade prompt templates
- Agents must have strong identity, clear capabilities, concrete operating procedures
- Avoid duplicating common patterns already well-covered (basic chain-of-thought, simple role prompts)
- Focus on: advanced orchestration, specialized domains, emerging techniques, real workflows
- Each skill prompt should include: context, instructions, output format, at least one {{variable}}
- Each agent text should include: identity statement, core capabilities, operating procedures, output standards

Today's date: ${new Date().toISOString().split('T')[0]}`;

    try {
      const { text, message } = await complete(client, {
        model: scoutModel, maxTokens: 12000, effort: 'medium', system: systemPrompt,
        messages: [{ role: 'user', content: userMsg }], format: SCOUT_FORMAT,
      });
      const parsed = parseJsonLoose(text, '{');
      if (!parsed) return res.status(502).json({ error: 'Scout returned an unparseable response.' });

      let skills = (parsed.skills || []).filter(s => s && s.id && s.name && s.prompt && s.cat);
      let agents = (parsed.agents || []).filter(a => a && a.name && a.text);
      skills.forEach(s => { if (!s.id.startsWith('scout-')) s.id = `scout-${s.id}`; s.origin = s.origin || 'Scout Discovery'; });
      agents.forEach(a => { a.source = 'Scout'; });

      // Policy gate — denied items never reach the browser.
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

      const { verdicts, usage: vUsage, enabled: verifyEnabled } = await verify(client, scoutModel, skills, agents);

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
        skills, agents,
        meta: {
          topic, generated_at: new Date().toISOString(),
          skills_count: skills.length, agents_count: agents.length, rejected,
          audit_seq: auditEntry.seq, audit_hash: auditEntry.hash,
          tokens_used: {
            input: (message.usage?.input_tokens || 0) + vUsage.input,
            output: (message.usage?.output_tokens || 0) + vUsage.output,
          },
        },
      });
    } catch (err) {
      const e = describeError(err);
      res.status(e.status).json({ error: e.message });
    }
  });

  router.get('/scout/audit', (req, res) => {
    const limit = Math.max(1, Math.min(200, parseInt(req.query.limit, 10) || 50));
    res.json(governance.readAuditLog().slice(-limit).reverse());
  });

  router.get('/scout/audit/verify', (req, res) => res.json(governance.verifyAuditChain()));

  // Skill maintainer — re-validate a saved library; keep / flag / prune.
  router.post('/scout/maintain', scoutLimiter, async (req, res) => {
    const client = getClient();
    if (!client) return res.status(503).json({ error: 'ANTHROPIC_API_KEY is not configured on the server.', code: 'no_api_key' });
    const skills = (Array.isArray(req.body?.skills) ? req.body.skills : []).filter(s => s && s.id && s.prompt).slice(0, 100);
    const agents = (Array.isArray(req.body?.agents) ? req.body.agents : []).filter(a => a && a.name && a.text).slice(0, 100);
    if (!skills.length && !agents.length) {
      return res.json({ skills: [], agents: [], summary: { keep: 0, flag: 0, prune: 0 }, note: 'Library is empty — nothing to maintain.' });
    }
    const scoutModel = resolveModel(req.body?.model).id;
    const { verdicts, usage } = await verify(client, scoutModel, skills, agents);

    const summary = { keep: 0, flag: 0, prune: 0 };
    const review = (kind, items) => items.map(item => {
      const key = kind === 'skill' ? item.id : item.name;
      const policy = governance.evaluateItem(kind, item);
      const verification = verdicts.get(`${kind}:${key}`) || null;
      const trust = governance.trustScore(kind, item, { policy, verification });
      const verdict = governance.classifyMaintenance({ policy, verification, trust });
      summary[verdict.action] += 1;
      return { key, name: item.name, action: verdict.action, reasons: verdict.reasons, trust: verdict.trust, verification };
    });
    const skillResults = review('skill', skills);
    const agentResults = review('agent', agents);

    governance.appendAudit({
      event: 'maintenance', scout_model: scoutModel, reviewed: skills.length + agents.length, summary,
      pruned: [...skillResults, ...agentResults].filter(r => r.action === 'prune').map(r => `${r.name || r.key}`),
    });
    res.json({ skills: skillResults, agents: agentResults, summary, tokens_used: usage });
  });

  return router;
};
