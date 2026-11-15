// Integration tests for the free-model gateway (OmniRoute / FreeLLMAPI or any
// OpenAI-compatible server). A local mock of /v1/models and
// /v1/chat/completions stands in for the gateway, and the server runs with NO
// Anthropic key, the configuration this feature exists for.
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const os = require('os');
const path = require('path');
const fs = require('fs');

process.env.SCOUT_AUDIT_PATH = path.join(os.tmpdir(), `scout-audit-gw-test-${process.pid}.jsonl`);
process.env.SPEND_STATE_PATH = path.join(os.tmpdir(), `spend-state-gw-test-${process.pid}.json`);
delete process.env.ANTHROPIC_API_KEY;
delete process.env.ANTHROPIC_BASE_URL;

let upstream, appServer, base;
let requests = [];
let nextReply = null; // (body, n) => { status, json } | { chunks: [...] }
let models = ['auto', 'groq/llama-3.3-70b-versatile', 'gemini/gemini-2.5-flash'];

const chunk = (delta, extra = {}) => `data: ${JSON.stringify({ id: 'c1', object: 'chat.completion.chunk', model: 'groq/llama-3.3-70b-versatile', choices: [{ index: 0, delta, finish_reason: null }], ...extra })}\n\n`;
const completion = (content, model = 'groq/llama-3.3-70b-versatile') => ({ id: 'c2', object: 'chat.completion', model, choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason: 'stop' }], usage: { prompt_tokens: 40, completion_tokens: 25 } });

before(async () => {
  upstream = http.createServer((req, res) => {
    let raw = '';
    req.on('data', c => { raw += c; });
    req.on('end', () => {
      const body = raw ? JSON.parse(raw) : {};
      requests.push({ url: req.url, method: req.method, headers: req.headers, body });
      if (req.method === 'GET' && req.url === '/v1/models') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ object: 'list', data: models.map(id => ({ id, object: 'model' })) }));
      }
      const n = requests.filter(r => r.url === '/v1/chat/completions').length;
      const reply = nextReply ? nextReply(body, n) : body.stream
        ? { chunks: [chunk({ role: 'assistant' }), chunk({ reasoning_content: 'Thinking it over.' }), chunk({ content: 'Hello' }), chunk({ content: ' from a free model' }), `data: ${JSON.stringify({ choices: [{ index: 0, delta: {}, finish_reason: 'stop' }] })}\n\n`, `data: ${JSON.stringify({ choices: [], usage: { prompt_tokens: 11, completion_tokens: 5 } })}\n\n`, 'data: [DONE]\n\n'] }
        : { json: completion('{}') };
      if (reply.chunks) {
        res.writeHead(200, { 'Content-Type': 'text/event-stream', 'X-Routed-Via': 'groq/llama-3.3-70b-versatile' });
        return res.end(reply.chunks.join(''));
      }
      res.writeHead(reply.status || 200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(reply.json));
    });
  });
  await new Promise(r => upstream.listen(0, '127.0.0.1', r));
  process.env.LLM_GATEWAY_URL = `http://127.0.0.1:${upstream.address().port}/v1`;
  process.env.LLM_GATEWAY_KEY = 'gw-test-key';
  process.env.LLM_GATEWAY_NAME = 'OmniRoute';
  process.env.SCOUT_VERIFY = '0';
  const { createApp } = require('../src/app');
  appServer = http.createServer(createApp());
  await new Promise(r => appServer.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${appServer.address().port}`;
});

after(() => {
  appServer.close(); upstream.close();
  for (const k of ['LLM_GATEWAY_URL', 'LLM_GATEWAY_KEY', 'LLM_GATEWAY_NAME']) delete process.env[k];
  try { fs.unlinkSync(process.env.SCOUT_AUDIT_PATH); } catch {}
  try { fs.unlinkSync(process.env.SPEND_STATE_PATH); } catch {}
});

beforeEach(() => {
  requests = []; nextReply = null;
  models = ['auto', 'groq/llama-3.3-70b-versatile', 'gemini/gemini-2.5-flash'];
  for (const k of ['ACCESS_PASSWORD', 'GATEWAY_DAILY_REQUEST_LIMIT', 'LLM_GATEWAY_MODELS', 'LLM_GATEWAY_DEFAULT_MODEL', 'LLM_GATEWAY_JUDGE_MODEL', 'ANTHROPIC_API_KEY']) delete process.env[k];
  require('../src/providers/gateway').resetCacheForTests();
  require('../src/guard').resetSpendForTests();
});

const post = (p, body, headers = {}) => fetch(base + p, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
const chatCalls = () => requests.filter(r => r.url === '/v1/chat/completions');
function parseSse(text) {
  return text.split('\n\n').filter(Boolean).map(block => ({ event: /event: (.*)/.exec(block)[1], data: JSON.parse(/data: (.*)/.exec(block)[1]) }));
}

test('config: ready with no Anthropic key, gateway models discovered and free, Claude needs a user key', async () => {
  const cfg = await (await fetch(`${base}/api/config`)).json();
  assert.equal(cfg.ready, true);
  assert.equal(cfg.defaultModel, 'gw:auto');
  assert.equal(cfg.providers.anthropic.serverKey, false);
  assert.equal(cfg.providers.gateway.name, 'OmniRoute');
  const gw = cfg.models.filter(m => m.provider === 'gateway');
  assert.deepEqual(gw.map(m => m.id), ['gw:auto', 'gw:groq/llama-3.3-70b-versatile', 'gw:gemini/gemini-2.5-flash']);
  assert.ok(gw.every(m => m.free && m.price.input === 0 && m.price.output === 0));
  const claude = cfg.models.filter(m => m.provider === 'anthropic');
  assert.ok(claude.length >= 1 && claude.every(m => m.requiresUserKey));
  assert.equal(requests[0].headers.authorization, 'Bearer gw-test-key');
});

test('config: LLM_GATEWAY_MODELS pins the list without calling /models; DEFAULT picks the default', async () => {
  process.env.LLM_GATEWAY_MODELS = 'cerebras/llama-3.3-70b, groq/llama-3.1-8b-instant';
  process.env.LLM_GATEWAY_DEFAULT_MODEL = 'groq/llama-3.1-8b-instant';
  const cfg = await (await fetch(`${base}/api/config`)).json();
  assert.equal(cfg.defaultModel, 'gw:groq/llama-3.1-8b-instant');
  assert.deepEqual(cfg.models.filter(m => m.provider === 'gateway').map(m => m.id), ['gw:groq/llama-3.1-8b-instant', 'gw:cerebras/llama-3.3-70b']);
  assert.equal(requests.filter(r => r.url === '/v1/models').length, 0);
});

test('config: falls back to "auto" when the gateway is down', async () => {
  const saved = process.env.LLM_GATEWAY_URL;
  process.env.LLM_GATEWAY_URL = 'http://127.0.0.1:9/v1';
  try {
    const cfg = await (await fetch(`${base}/api/config`)).json();
    assert.equal(cfg.ready, true);
    assert.equal(cfg.defaultModel, 'gw:auto');
    assert.ok(cfg.providers.gateway.error);
  } finally { process.env.LLM_GATEWAY_URL = saved; }
});

test('chat: streams deltas and reasoning from the gateway in PromptForge SSE shape', async () => {
  const res = await post('/api/chat', { model: 'gw:groq/llama-3.3-70b-versatile', effort: 'high', showThinking: true, maxTokens: 500, system: 'Be brief.', messages: [{ role: 'user', content: 'Hi' }] });
  const events = parseSse(await res.text());
  const sent = chatCalls()[0].body;
  assert.equal(sent.model, 'groq/llama-3.3-70b-versatile');
  assert.equal(sent.stream, true);
  assert.deepEqual(sent.stream_options, { include_usage: true });
  assert.equal(sent.max_tokens, 500);
  assert.deepEqual(sent.messages, [{ role: 'system', content: 'Be brief.' }, { role: 'user', content: 'Hi' }]);
  assert.equal(sent.output_config, undefined, 'no Anthropic-only params leak to the gateway');
  assert.equal(events.filter(e => e.event === 'delta').map(e => e.data.text).join(''), 'Hello from a free model');
  assert.equal(events.find(e => e.event === 'thinking').data.text, 'Thinking it over.');
  assert.match(events.find(e => e.event === 'notice').data.message, /Routed via groq/);
  const done = events.find(e => e.event === 'done').data;
  assert.equal(done.stop_reason, 'end_turn');
  assert.equal(done.usage.input_tokens, 11);
  assert.equal(done.usage.output_tokens, 5);
});

test('chat: reasoning is hidden unless showThinking is on', async () => {
  const events = parseSse(await (await post('/api/chat', { model: 'gw:auto', messages: [{ role: 'user', content: 'Hi' }] })).text());
  assert.equal(events.filter(e => e.event === 'thinking').length, 0);
});

test('chat: retries without stream_options when the upstream rejects it', async () => {
  nextReply = (body, n) => (n === 1 ? { status: 400, json: { error: { message: 'Unrecognized request argument: stream_options' } } } : { chunks: [chunk({ content: 'ok' }), 'data: [DONE]\n\n'] });
  const events = parseSse(await (await post('/api/chat', { model: 'gw:auto', messages: [{ role: 'user', content: 'Hi' }] })).text());
  assert.equal(chatCalls().length, 2);
  assert.equal(chatCalls()[1].body.stream_options, undefined);
  assert.equal(events.find(e => e.event === 'delta').data.text, 'ok');
});

test('chat: gateway errors become clear SSE errors (429 quota)', async () => {
  nextReply = () => ({ status: 429, json: { error: { message: 'All free providers are rate limited' } } });
  const events = parseSse(await (await post('/api/chat', { model: 'gw:auto', messages: [{ role: 'user', content: 'Hi' }] })).text());
  const err = events.find(e => e.event === 'error').data;
  assert.equal(err.status, 429);
  assert.match(err.message, /free quota/);
});

test('chat: unknown gateway model ids fall back to the default instead of being forwarded', async () => {
  await fetch(`${base}/api/config`);
  await (await post('/api/chat', { model: 'gw:evil/../../model', messages: [{ role: 'user', content: 'Hi' }] })).text();
  assert.equal(chatCalls()[0].body.model, 'auto');
});

test('chat: a Claude model without any Anthropic key is refused with a hint', async () => {
  const res = await post('/api/chat', { model: 'claude-opus-5-5', messages: [{ role: 'user', content: 'Hi' }] });
  assert.equal(res.status, 503);
  const body = await res.json();
  assert.equal(body.code, 'no_api_key');
  assert.match(body.error, /free gateway model/);
  assert.equal(chatCalls().length, 0);
});

test('guard: the access password still protects gateway models', async () => {
  process.env.ACCESS_PASSWORD = 'hunter2';
  const res = await post('/api/chat', { model: 'gw:auto', messages: [{ role: 'user', content: 'Hi' }] });
  assert.equal(res.status, 401);
  const ok = await post('/api/chat', { model: 'gw:auto', messages: [{ role: 'user', content: 'Hi' }] }, { 'x-access-password': 'hunter2' });
  assert.equal(ok.status, 200);
  await ok.text();
});

test('guard: GATEWAY_DAILY_REQUEST_LIMIT caps free-model requests', async () => {
  process.env.GATEWAY_DAILY_REQUEST_LIMIT = '1';
  await (await post('/api/chat', { model: 'gw:auto', messages: [{ role: 'user', content: 'Hi' }] })).text();
  const res = await post('/api/chat', { model: 'gw:auto', messages: [{ role: 'user', content: 'Hi' }] });
  assert.equal(res.status, 429);
  assert.equal((await res.json()).code, 'quota_exhausted');
  const cfg = await (await fetch(`${base}/api/config`)).json();
  assert.deepEqual(cfg.budget.gateway, { limit: 1, used: 1, remaining: 0 });
});

test('grade: uses json_schema response_format and the judge model', async () => {
  process.env.LLM_GATEWAY_JUDGE_MODEL = 'gemini/gemini-2.5-flash';
  nextReply = () => ({ json: completion('{"pass": true, "score": 9, "reason": "Names Paris."}', 'gemini/gemini-2.5-flash') });
  const res = await post('/api/grade', { output: 'Paris.', rubric: 'Names the capital of France.', model: 'gw:groq/llama-3.3-70b-versatile' });
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.deepEqual({ pass: body.pass, score: body.score, reason: body.reason }, { pass: true, score: 9, reason: 'Names Paris.' });
  const sent = chatCalls()[0].body;
  assert.equal(sent.model, 'gemini/gemini-2.5-flash');
  assert.equal(sent.response_format.type, 'json_schema');
  assert.deepEqual(sent.response_format.json_schema.schema.required, ['pass', 'score', 'reason']);
  assert.match(sent.messages[0].content, /JSON Schema/);
});

test('grade: downgrades response_format when unsupported, and coerces near-miss JSON', async () => {
  nextReply = (body, n) => (n === 1
    ? { status: 400, json: { error: { message: 'response_format json_schema is not supported' } } }
    : { json: completion('Sure! ```json\n{"pass": "true", "score": "8", "reason": "Good", "extra": 1}\n```') });
  const body = await (await post('/api/grade', { output: 'x', rubric: 'y', model: 'gw:auto' })).json();
  assert.deepEqual({ pass: body.pass, score: body.score, reason: body.reason }, { pass: true, score: 8, reason: 'Good' });
  assert.equal(body.extra, undefined);
  assert.equal(chatCalls()[1].body.response_format.type, 'json_object');
});

test('review: repairs once when the model returns the wrong shape', async () => {
  nextReply = (body, n) => (n === 1
    ? { json: completion('{"score": 70, "summary": "ok"}') }
    : { json: completion(JSON.stringify({ score: 72, summary: 'Clear but vague.', strengths: ['Short'], issues: [{ severity: 'high', title: 'No format', detail: 'd', fix: 'f' }] })) });
  const res = await post('/api/review', { mode: 'deep', user: 'write some stuff', model: 'gw:auto' });
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.score, 72);
  assert.equal(chatCalls().length, 2);
  const repair = chatCalls()[1].body.messages.at(-1).content;
  assert.match(repair, /strengths is required/);
});

test('review: gives up with a clear 502 when the model never matches', async () => {
  nextReply = () => ({ json: completion('I cannot produce JSON, sorry.') });
  const res = await post('/api/review', { mode: 'deep', user: 'write some stuff', model: 'gw:auto' });
  assert.equal(res.status, 502);
  assert.match((await res.json()).error, /did not match the expected format/);
});

test('scout: runs end to end on a gateway model', async () => {
  const item = { skills: [{ id: 'eval-rubric', name: 'Eval rubric writer', cat: 'testing', origin: 'Scout', desc: 'Writes rubrics', prompt: 'Write a grading rubric for {{task}} with pass criteria and examples of failing outputs.' }], agents: [] };
  nextReply = () => ({ json: completion(JSON.stringify(item)) });
  const res = await post('/api/scout', { topic: 'evals', type: 'skills', count: 1, model: 'gw:auto' });
  const body = await res.json();
  assert.equal(res.status, 200, JSON.stringify(body));
  assert.equal(body.skills[0].id, 'scout-eval-rubric');
  assert.equal(chatCalls()[0].body.response_format.type, 'json_schema');
});

test('server key present: Claude stays the default and gateway models are listed after it', async () => {
  process.env.ANTHROPIC_API_KEY = 'test-key';
  const cfg = await (await fetch(`${base}/api/config`)).json();
  assert.equal(cfg.defaultModel, 'claude-opus-5-5');
  assert.equal(cfg.models[0].provider, 'anthropic');
  assert.ok(cfg.models.some(m => m.id === 'gw:auto'));
  assert.ok(cfg.models.filter(m => m.provider === 'anthropic').every(m => !m.requiresUserKey));
});
