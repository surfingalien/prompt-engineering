const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Proxy endpoint — keeps ANTHROPIC_API_KEY server-side only
app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured on server.' });
  }
  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Upstream API request failed.', detail: err.message });
  }
});

// Scout endpoint — generates new skills & agents using Claude's knowledge
app.post('/api/scout', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured on server.' });
  }
  const { topic = 'AI agents and prompt engineering', count = 3, type = 'both' } = req.body;

  const systemPrompt = `You are an AI Intelligence Scout — an expert in AI skills, agents, prompts, and frameworks. Your job is to generate NEW, high-quality skill and agent definitions based on the latest developments in the AI ecosystem.

Output ONLY valid JSON. No markdown, no explanation, no preamble. Just the JSON object.

Generate skills and agents in this exact format:
{
  "skills": [
    {
      "id": "scout-[unique-4-char-alphanumeric]",
      "name": "Skill Name",
      "cat": "one of: research|code|agent|ml|writing|devops|security|testing|frontend|backend|product|design",
      "origin": "Scout Discovery",
      "desc": "One sentence description under 120 chars",
      "prompt": "Full detailed prompt text with {{variable}} placeholders where appropriate. At least 300 words. Include clear sections, instructions, and output format."
    }
  ],
  "agents": [
    {
      "name": "Agent Name",
      "source": "Scout",
      "cat": "one of: research|core-development|data-ai|infrastructure|specialized-domains|orchestration|quality-assurance",
      "tags": ["tag1", "tag2", "tag3"],
      "text": "Full system prompt defining the agent's identity, capabilities, approach, and constraints. At least 200 words. Make it production-quality."
    }
  ]
}`;

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
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 8000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMsg }],
      }),
    });
    const data = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status).json({ error: data.error?.message || 'API error' });

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
    const skills = (parsed.skills || []).filter(s => s.id && s.name && s.prompt && s.cat);
    const agents = (parsed.agents || []).filter(a => a.name && a.text && a.source);

    // Ensure all scout skill IDs are prefixed with scout-
    skills.forEach(s => {
      if (!s.id.startsWith('scout-')) s.id = `scout-${s.id}`;
      s.origin = s.origin || 'Scout Discovery';
    });
    agents.forEach(a => { a.source = 'Scout'; });

    res.json({
      skills,
      agents,
      meta: {
        topic,
        generated_at: new Date().toISOString(),
        skills_count: skills.length,
        agents_count: agents.length,
        tokens_used: {
          input: data.usage?.input_tokens || 0,
          output: data.usage?.output_tokens || 0,
        },
      }
    });
  } catch (err) {
    res.status(502).json({ error: 'Scout request failed.', detail: err.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PromptForge running at http://localhost:${PORT}`);
});

module.exports = app;
