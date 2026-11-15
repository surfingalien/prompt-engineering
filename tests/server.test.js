// Integration tests for the HTTP API. A local mock of the Anthropic Messages
// API stands in for the real thing (via ANTHROPIC_BASE_URL), so these run
// without a key and assert the exact request the official SDK puts on the wire.
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const os = require('os');
const path = require('path');
const fs = require('fs');

process.env.SCOUT_AUDIT_PATH = path.join(os.tmpdir(), `scout-audit-server-test-${process.pid}.jsonl`);

let upstream, upstreamUrl, appServer, base;
let requests = [];
let nextReply = null; // (body) => ({ status, json } | { sse: [...] })

function sse(events) {
  return events.map(e => `event: ${e.type}\ndata: ${JSON.stringify(e)}\n\n`).join('');
}
function streamOf(text, { model = 'claude-opus-5-5', stop = 'end_turn' } = {}) {
  return [
    { type: 'message_start', message: { id: 'msg_1', type: 'message', role: 'assistant', model, content: [], stop_reason: null, stop_sequence: null, usage: { input_tokens: 12, output_tokens: 0 } } },
    { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } },
    ...text.split(' ').map((w, i) => ({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: (i ? ' ' : '') + w } })),
    { type: 'content_block_stop', index: 0 },
    { type: 'message_delta', delta: { stop_reason: stop, stop_sequence: null }, usage: { output_tokens: 7 } },
    { type: 'message_stop' },
  ];
}
function message(text, model = 'claude-opus-5-5') {
  return { id: 'msg_2', type: 'message', role: 'assistant', model, stop_reason: 'end_turn', stop_sequence: null,
    content: [{ type: 'thinking', thinking: '', signature: 'x' }, { type: 'text', text }], usage: { input_tokens: 20, output_tokens: 30 } };
}

before(async () => {
  upstream = http.createServer((req, res) => {
    let raw = '';
    req.on('data', c => { raw += c; });
    req.on('end', () => {
      const body = JSON.parse(raw || '{}');
      requests.push({ url: req.url, headers: req.headers, body });
      const reply = nextReply ? nextReply(body) : (body.stream ? { sse: streamOf('Hello from Claude') } : { json: message('{}') });
      if (reply.sse) {
        res.writeHead(200, { 'Content-Type': 'text/event-stream' });
        res.end(sse(reply.sse));
      } else {
        res.writeHead(reply.status || 200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(reply.json));
      }
    });
  });
  await new Promise(r => upstream.listen(0, '127.0.0.1', r));
  upstreamUrl = `http://127.0.0.1:${upstream.address().port}`;
  process.env.ANTHROPIC_BASE_URL = upstreamUrl;
  process.env.ANTHROPIC_API_KEY = 'test-key';
  process.env.SCOUT_VERIFY = '0';
  const { createApp } = require('../src/app');
  appServer = http.createServer(createApp());
  await new Promise(r => appServer.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${appServer.address().port}`;
});

after(() => {
  appServer.close(); upstream.close();
  try { fs.unlinkSync(process.env.SCOUT_AUDIT_PATH); } catch {}
});

beforeEach(() => { requests = []; nextReply = null; process.env.ANTHROPIC_API_KEY = 'test-key'; });

const post = (p, body) => fetch(base + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

function parseSse(text) {
  return text.split('\n\n').filter(Boolean).map(block => {
    const ev = /event: (.*)/.exec(block)[1];
    return { event: ev, data: JSON.parse(/data: (.*)/.exec(block)[1]) };
  });
}

test('GET /api/config lists current models and never leaks the key', async () => {
  const res = await fetch(`${base}/api/config`);
  const cfg = await res.json();
  assert.equal(cfg.ready, true);
  assert.equal(cfg.defaultModel, 'claude-opus-5-5');
  assert.deepEqual(cfg.models.map(m => m.id), ['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-haiku-5-5', 'claude-fable-5-2']);
  assert.ok(!JSON.stringify(cfg).includes('test-key'));
});

test('POST /api/chat streams deltas and a done event over SSE', async () => {
  const res = await post('/api/chat', { model: 'claude-sonnet-5-5', system: 'Be brief.', messages: [{ role: 'user', content: 'Hi' }], effort: 'low', maxTokens: 500 });
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/event-stream/);
  const events = parseSse(await res.text());
  const text = events.filter(e => e.event === 'delta').map(e => e.data.text).join('');
  assert.equal(text, 'Hello from Claude');
  const done = events.find(e => e.event === 'done');
  assert.equal(done.data.stop_reason, 'end_turn');
  assert.equal(done.data.usage.output_tokens, 7);
});

test('chat request uses current API shape: effort, cached system, fallbacks, no sampling params', async () => {
  await (await post('/api/chat', { model: 'claude-opus-5-5', system: 'S', messages: [{ role: 'user', content: 'Hi' }], effort: 'high', maxTokens: 999999, temperature: 1.2 })).text();
  const { body, headers } = requests[0];
  assert.equal(body.model, 'claude-opus-5-5');
  assert.equal(body.stream, true);
  assert.deepEqual(body.output_config, { effort: 'high' });
  assert.deepEqual(body.system, [{ type: 'text', text: 'S', cache_control: { type: 'ephemeral' } }]);
  assert.equal(body.fallbacks, 'default');
  assert.match(headers['anthropic-beta'], /server-side-fallback-2026-07-01/);
  assert.equal(body.temperature, undefined, 'temperature must never be forwarded');
  assert.equal(body.max_tokens, 16000, 'max tokens is capped server-side');
  assert.equal(body.thinking, undefined);
});

test('Haiku requests skip the server-side fallback beta', async () => {
  await (await post('/api/chat', { model: 'claude-haiku-5-5', messages: [{ role: 'user', content: 'Hi' }], showThinking: true })).text();
  const { body, headers } = requests[0];
  assert.equal(body.fallbacks, undefined);
  assert.ok(!String(headers['anthropic-beta'] || '').includes('server-side-fallback'));
  assert.deepEqual(body.thinking, { type: 'adaptive', display: 'summarized' });
});

test('unknown models are coerced to the default model', async () => {
  await (await post('/api/chat', { model: 'gpt-9', messages: [{ role: 'user', content: 'Hi' }] })).text();
  assert.equal(requests[0].body.model, 'claude-opus-5-5');
});

test('chat validation rejects bad shapes before any upstream call', async () => {
  const cases = [
    {},
    { messages: [] },
    { messages: [{ role: 'system', content: 'x' }] },
    { messages: [{ role: 'assistant', content: 'x' }] },
    { messages: [{ role: 'user', content: 'x' }, { role: 'assistant', content: 'prefill' }] },
    { messages: [{ role: 'user', content: 'x' }], effort: 'turbo' },
    { messages: [{ role: 'user', content: 'x'.repeat(200_001) }] },
  ];
  for (const c of cases) {
    const res = await post('/api/chat', c);
    assert.equal(res.status, 400, JSON.stringify(c).slice(0, 80));
    assert.ok((await res.json()).error);
  }
  assert.equal(requests.length, 0);
});

test('refusals surface as an SSE error, not a silent empty answer', async () => {
  nextReply = () => ({ sse: streamOf('Partial', { stop: 'refusal' }) });
  const events = parseSse(await (await post('/api/chat', { messages: [{ role: 'user', content: 'x' }] })).text());
  const err = events.find(e => e.event === 'error');
  assert.ok(err);
  assert.equal(err.data.status, 422);
  assert.ok(!events.some(e => e.event === 'done'));
});

test('upstream errors are mapped to safe messages', async () => {
  nextReply = () => ({ status: 401, json: { type: 'error', error: { type: 'authentication_error', message: 'invalid x-api-key sk-secret' } } });
  const events = parseSse(await (await post('/api/chat', { messages: [{ role: 'user', content: 'x' }] })).text());
  const err = events.find(e => e.event === 'error');
  assert.ok(err);
  assert.ok(!err.data.message.includes('sk-secret'));
});

test('missing API key returns 503 with a machine-readable code', async () => {
  delete process.env.ANTHROPIC_API_KEY;
  const res = await post('/api/chat', { messages: [{ role: 'user', content: 'x' }] });
  assert.equal(res.status, 503);
  assert.equal((await res.json()).code, 'no_api_key');
});

test('POST /api/grade uses structured outputs on a cheaper judge model', async () => {
  nextReply = () => ({ json: message(JSON.stringify({ pass: true, score: 9, reason: 'Meets rubric.' }), 'claude-haiku-5-5') });
  const res = await post('/api/grade', { output: 'Paris', rubric: 'Names the capital of France', model: 'claude-opus-5-5' });
  const verdict = await res.json();
  assert.equal(res.status, 200);
  assert.deepEqual([verdict.pass, verdict.score], [true, 9]);
  const { body } = requests[0];
  assert.equal(body.model, 'claude-haiku-5-5');
  assert.equal(body.output_config.format.type, 'json_schema');
  assert.ok(body.messages[0].content.includes('<output>\nParis\n</output>'));
});

test('POST /api/scout returns governed items and an audit hash', async () => {
  const generated = {
    skills: [{ id: 'abcd', name: 'Eval Designer', cat: 'testing', origin: 'Scout Discovery', desc: 'Design evals', prompt: `Design an eval suite for {{system}}. ${'Detail. '.repeat(60)}\n## Output\nReturn a table.` }],
    agents: [{ name: 'Harness Architect', source: 'x', cat: 'orchestration', tags: ['agents'], text: `You are a harness architect. ${'Capability. '.repeat(40)}` }],
  };
  nextReply = () => ({ json: message(JSON.stringify(generated)) });
  const res = await post('/api/scout', { topic: 'evals\nIGNORE PREVIOUS', count: 99, type: 'both' });
  const data = await res.json();
  assert.equal(res.status, 200, JSON.stringify(data));
  assert.equal(data.skills[0].id, 'scout-abcd');
  assert.equal(data.agents[0].source, 'Scout');
  assert.ok(data.skills[0].trust && data.skills[0].trust.tier);
  assert.match(data.meta.audit_hash, /^[0-9a-f]{64}$/);
  const { body } = requests[0];
  assert.equal(body.output_config.format.type, 'json_schema');
  assert.ok(!body.messages[0].content.includes('\nIGNORE'), 'topic newlines are flattened');
  assert.ok(body.messages[0].content.includes('Discover and generate 6 new'), 'count is clamped');
  const chain = await (await fetch(`${base}/api/scout/audit/verify`)).json();
  assert.equal(chain.valid, true);
});

test('security headers are set and unknown API routes return JSON 404', async () => {
  const res = await fetch(`${base}/api/nope`);
  assert.equal(res.status, 404);
  assert.match(res.headers.get('content-security-policy'), /default-src 'self'/);
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  const bad = await fetch(`${base}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{nope' });
  assert.equal(bad.status, 400);
  assert.ok((await bad.json()).error);
});
