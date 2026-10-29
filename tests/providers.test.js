// Provider routing: model-id parsing, Anthropic<->OpenAI translation, and
// callModel dispatch with a fake fetch — no network or API keys needed.
const { test } = require('node:test');
const assert = require('node:assert');
const providers = require('../providers');

const ENV = { OPENROUTER_API_KEY: 'or-key', ANTHROPIC_API_KEY: 'an-key', OLLAMA_BASE_URL: 'http://localhost:11434/v1/' };

test('resolve: claude ids map to anthropic, prefixed ids to their provider', () => {
  assert.deepStrictEqual(providers.resolve('claude-sonnet-4-6'), { provider: 'anthropic', model: 'claude-sonnet-4-6' });
  assert.deepStrictEqual(providers.resolve('openrouter:google/gemini-2.5-pro'), { provider: 'openrouter', model: 'google/gemini-2.5-pro' });
});

test('resolve: rejects unknown providers, bare non-claude ids, and junk', () => {
  for (const bad of ['gpt-4', 'evil:model', 'anthropic:claude-x', 'openai:', '', null, 'openai:a b', 'openai:' + 'x'.repeat(200)]) {
    assert.strictEqual(providers.resolve(bad), null, String(bad));
  }
});

test('isConfigured depends on env; ollama needs only a base URL', () => {
  assert.ok(providers.isConfigured('openrouter', ENV));
  assert.ok(!providers.isConfigured('openai', ENV));
  assert.ok(providers.isConfigured('ollama', ENV));
  assert.ok(!providers.isConfigured('ollama', {}));
});

test('listProviders never leaks keys or URLs', () => {
  const json = JSON.stringify(providers.listProviders(ENV));
  assert.ok(!json.includes('or-key') && !json.includes('an-key') && !json.includes('localhost'));
});

test('toOpenAIBody flattens system blocks, drops cache_control, maps stop', () => {
  const body = providers.toOpenAIBody({
    system: [{ type: 'text', text: 'SYS', cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: [{ type: 'text', text: 'hi' }] }],
    max_tokens: 50, stop_sequences: ['END'],
  }, 'gpt-4.1');
  assert.deepStrictEqual(body, {
    model: 'gpt-4.1', max_tokens: 50, stop: ['END'],
    messages: [{ role: 'system', content: 'SYS' }, { role: 'user', content: 'hi' }],
  });
});

test('fromOpenAIResponse returns Anthropic shape with usage and stop_reason', () => {
  const r = providers.fromOpenAIResponse({
    choices: [{ message: { content: 'yo' }, finish_reason: 'length' }],
    usage: { prompt_tokens: 3, completion_tokens: 4 },
  }, 'm');
  assert.strictEqual(r.content[0].text, 'yo');
  assert.strictEqual(r.stop_reason, 'max_tokens');
  assert.deepStrictEqual(r.usage, { input_tokens: 3, output_tokens: 4 });
});

test('callModel routes OpenRouter through chat/completions with bearer auth', async () => {
  let seen;
  const fetchImpl = async (url, init) => {
    seen = { url, init };
    return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: 'ok' }, finish_reason: 'stop' }] }) };
  };
  const r = await providers.callModel(
    { model: 'openrouter:openai/gpt-4.1', messages: [{ role: 'user', content: 'x' }] },
    { env: ENV, fetchImpl },
  );
  assert.ok(r.ok);
  assert.strictEqual(r.data.content[0].text, 'ok');
  assert.strictEqual(seen.url, 'https://openrouter.ai/api/v1/chat/completions');
  assert.strictEqual(seen.init.headers.Authorization, 'Bearer or-key');
  assert.strictEqual(JSON.parse(seen.init.body).model, 'openai/gpt-4.1');
});

test('callModel trims trailing slash on Ollama base URL and sends no auth', async () => {
  let seen;
  const fetchImpl = async (url, init) => { seen = { url, init }; return { ok: true, status: 200, json: async () => ({ choices: [] }) }; };
  await providers.callModel({ model: 'ollama:llama3.2', messages: [] }, { env: ENV, fetchImpl });
  assert.strictEqual(seen.url, 'http://localhost:11434/v1/chat/completions');
  assert.strictEqual(seen.init.headers.Authorization, undefined);
});

test('callModel delegates claude models to the injected anthropicRequest', async () => {
  let got;
  const anthropicRequest = async (key, body) => { got = { key, body }; return { ok: true, status: 200, json: async () => ({ content: [{ type: 'text', text: 'a' }] }) }; };
  const r = await providers.callModel({ model: 'claude-haiku-4-5-20251001', messages: [] }, { env: ENV, anthropicRequest });
  assert.ok(r.ok);
  assert.strictEqual(got.key, 'an-key');
});

test('callModel reports unconfigured providers and upstream errors without throwing', async () => {
  const miss = await providers.callModel({ model: 'openai:gpt-4.1', messages: [] }, { env: ENV });
  assert.strictEqual(miss.status, 400);
  assert.match(miss.data.error.message, /not configured/);
  const fetchImpl = async () => ({ ok: false, status: 429, json: async () => ({ error: { message: 'slow down' } }) });
  const err = await providers.callModel({ model: 'openrouter:x/y', messages: [] }, { env: ENV, fetchImpl });
  assert.deepStrictEqual([err.ok, err.status, err.data.error.message], [false, 429, 'slow down']);
});

test('pickVerifier honors a usable, different SCOUT_VERIFIER_MODEL only', () => {
  const env = { ...ENV, SCOUT_VERIFIER_MODEL: 'openrouter:google/gemini-2.5-pro' };
  assert.strictEqual(providers.pickVerifier('claude-sonnet-4-6', 'dflt', env), 'openrouter:google/gemini-2.5-pro');
  assert.strictEqual(providers.pickVerifier('openrouter:google/gemini-2.5-pro', 'dflt', env), 'dflt');
  assert.strictEqual(providers.pickVerifier('claude-sonnet-4-6', 'dflt', { SCOUT_VERIFIER_MODEL: 'openai:gpt-4.1' }), 'dflt');
  assert.strictEqual(providers.pickVerifier('claude-sonnet-4-6', 'dflt', ENV), 'dflt');
});
