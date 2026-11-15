#!/usr/bin/env node
// Live smoke test against the REAL Anthropic API.
//
//   ANTHROPIC_API_KEY=sk-ant-... npm run smoke:live          (≈ $0.05–0.20)
//   ANTHROPIC_API_KEY=sk-ant-... npm run smoke:live -- --scout   (also runs Scout, ≈ +$0.30)
//
// Boots the app in-process on a random port and exercises every endpoint
// the UI uses, on every enabled model. Unit tests use a mock API; this is the
// check that the real API accepts our requests (effort, caching, fallbacks,
// structured outputs, adaptive thinking). Exits non-zero on any failure.
'use strict';
const http = require('http');

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY is not set. This test calls the real API; set a key to run it.');
  process.exit(2);
}
process.env.DAILY_BUDGET_USD = process.env.DAILY_BUDGET_USD || '2';
process.env.SPEND_STATE_PATH = process.env.SPEND_STATE_PATH || require('path').join(require('os').tmpdir(), `pf-smoke-spend-${process.pid}.json`);
delete process.env.ACCESS_PASSWORD;

const { createApp } = require('../src/app');
const withScout = process.argv.includes('--scout');
const results = [];

function sseEvents(text) {
  return text.split('\n\n').filter(Boolean).map(b => ({ event: /event: (.*)/.exec(b)?.[1], data: JSON.parse(/data: (.*)/.exec(b)?.[1] || 'null') }));
}

async function check(name, fn) {
  const t0 = Date.now();
  try {
    const note = await fn();
    results.push({ name, ok: true, ms: Date.now() - t0, note: note || '' });
  } catch (e) {
    results.push({ name, ok: false, ms: Date.now() - t0, note: e.message.slice(0, 160) });
  }
  const r = results.at(-1);
  console.log(`${r.ok ? '✓' : '✗'} ${name.padEnd(42)} ${String(r.ms).padStart(6)} ms  ${r.note}`);
}

(async () => {
  const server = http.createServer(createApp());
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (p, body) => fetch(base + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const json = async (p, body) => { const r = await post(p, body); const v = await r.json(); if (!r.ok) throw new Error(`${r.status}: ${v.error}`); return v; };

  const cfg = await (await fetch(`${base}/api/config`)).json();
  console.log(`Models: ${cfg.models.map(m => m.id).join(', ')} · budget $${cfg.budget.daily}\n`);

  for (const m of cfg.models) {
    await check(`chat stream · ${m.id}`, async () => {
      const r = await post('/api/chat', { model: m.id, effort: 'low', maxTokens: 400, system: 'Answer in one short sentence.', messages: [{ role: 'user', content: 'What is the capital of France?' }] });
      if (!r.ok) throw new Error(`${r.status}: ${(await r.json()).error}`);
      const evs = sseEvents(await r.text());
      const err = evs.find(e => e.event === 'error');
      if (err) throw new Error(err.data.message);
      const done = evs.find(e => e.event === 'done');
      const text = evs.filter(e => e.event === 'delta').map(e => e.data.text).join('');
      if (!done || !/paris/i.test(text)) throw new Error(`unexpected answer: ${text.slice(0, 80)}`);
      return `${done.data.model} · ${done.data.usage.output_tokens} out`;
    });
  }

  await check('chat · reasoning summary + system cache', async () => {
    const system = `You are a careful math tutor.\n${'Show the key step, then the answer. '.repeat(120)}`;
    const ask = () => post('/api/chat', { model: cfg.defaultModel, effort: 'medium', maxTokens: 2000, showThinking: true, system, messages: [{ role: 'user', content: 'A bat and a ball cost $1.10. The bat costs $1.00 more than the ball. How much is the ball?' }] }).then(r => r.text()).then(sseEvents);
    const first = await ask();
    const second = await ask();
    const done = second.find(e => e.event === 'done');
    if (!done) throw new Error((second.find(e => e.event === 'error') || {}).data?.message || 'no done event');
    const text = second.filter(e => e.event === 'delta').map(e => e.data.text).join('');
    if (!/0?\.05|5 cents|five cents/i.test(text)) throw new Error(`wrong answer: ${text.slice(0, 80)}`);
    const thinking = first.concat(second).some(e => e.event === 'thinking');
    return `thinking summary: ${thinking ? 'yes' : 'none returned'} · cache read ${done.data.usage.cache_read_input_tokens} tokens`;
  });

  await check('grade · structured verdict', async () => {
    const v = await json('/api/grade', { output: 'Paris is the capital of France.', rubric: 'Correctly names the capital of France.', model: cfg.defaultModel });
    if (typeof v.pass !== 'boolean' || !v.pass) throw new Error(JSON.stringify(v).slice(0, 120));
    return `${v.model} · score ${v.score}`;
  });

  await check('review · deep', async () => {
    const v = await json('/api/review', { mode: 'deep', user: 'write some stuff about marketing', model: cfg.defaultModel });
    if (!Array.isArray(v.issues) || typeof v.score !== 'number') throw new Error('bad shape');
    return `score ${v.score} · ${v.issues.length} issues`;
  });

  await check('review · lesson grading', async () => {
    const v = await json('/api/review', { mode: 'lesson', user: 'Write a 120-word changelog note for our Saved Searches feature for existing customers. Plain, friendly tone.', model: cfg.defaultModel, lesson: { title: 'Be clear and direct', task: 'Sharpen a vague request', checklist: ['The task is an explicit instruction', 'Vague words are replaced by specifics'] } });
    if (!Array.isArray(v.items) || v.items.length !== 2) throw new Error('bad shape');
    return `${v.items.filter(i => i.pass).length}/2 pass`;
  });

  await check('cases · generation', async () => {
    const v = await json('/api/cases', { user: 'Summarize this support ticket in one sentence: <ticket>{{ticket}}</ticket>', vars: ['ticket'], count: 3, model: cfg.defaultModel });
    if (v.cases.length !== 3 || !v.cases.every(c => c.values.some(x => x.name === 'ticket'))) throw new Error('bad cases');
    return v.cases.map(c => c.kind).join(', ');
  });

  if (withScout) {
    await check('scout · governed generation', async () => {
      const v = await json('/api/scout', { topic: 'prompt evaluation', type: 'skills', count: 1, model: cfg.defaultModel });
      return `${v.skills.length} skill(s), ${v.meta.rejected.length} rejected, audit #${v.meta.audit_seq}`;
    });
  }

  const after = await (await fetch(`${base}/api/config`)).json();
  server.close();
  const failed = results.filter(r => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed · estimated spend $${after.budget.spent.toFixed(4)}`);
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
