// Provider detection for model logos, plus the vendored logo files.
const { test, before } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

let P;
before(async () => { P = await import('../public/js/lib/providers.js'); });

const LOGOS = path.join(__dirname, '..', 'public', 'img', 'logos');

test('providerOf: Claude models and gateway route prefixes', () => {
  assert.equal(P.providerOf({ id: 'claude-opus-5-5', provider: 'anthropic' }).id, 'anthropic');
  assert.equal(P.providerOf('gw:groq/llama-3.3-70b-versatile').id, 'groq');
  assert.equal(P.providerOf('gw:gemini/gemini-2.5-flash').id, 'google');
  assert.equal(P.providerOf('gw:openrouter/meta-llama/llama-3.3-70b-instruct:free').id, 'openrouter');
  assert.equal(P.providerOf('gw:cf/@cf/meta/llama-3.1-8b-instruct').id, 'cloudflare');
  assert.equal(P.providerOf('gw:nvidia/nemotron-70b').id, 'nvidia');
  assert.equal(P.providerOf('gw:cerebras/qwen-3-32b').id, 'cerebras');
});

test('providerOf: model families when there is no known prefix', () => {
  assert.equal(P.providerOf('gw:llama-3.3-70b').id, 'meta');
  assert.equal(P.providerOf('gw:mixtral-8x7b').id, 'mistral');
  assert.equal(P.providerOf('gw:deepseek-r1').id, 'deepseek');
  assert.equal(P.providerOf('gw:qwq-32b').id, 'qwen');
  assert.equal(P.providerOf('gw:gemma-3-27b-it').id, 'google');
  assert.equal(P.providerOf('gw:gpt-oss-120b').id, 'openai');
  assert.equal(P.providerOf('gw:acme/something').label, 'acme');
  assert.equal(P.providerOf('gw:something').id, 'other');
});

test('providerOf: "auto" routes are the gateway itself', () => {
  for (const id of ['gw:auto', 'gw:auto:fast', 'gw:auto/coding']) {
    const p = P.providerOf(id, 'OmniRoute');
    assert.equal(p.router, true);
    assert.equal(p.label, 'OmniRoute');
  }
});

test('every referenced logo exists, light variants included, and none can run script', () => {
  for (const [id, p] of Object.entries(P.PROVIDERS)) {
    if (!p.logo) continue;
    const paths = P.logoPaths(p.logo, p.light);
    for (const rel of [paths.light, paths.dark]) {
      const file = path.join(__dirname, '..', 'public', rel);
      assert.ok(fs.existsSync(file), `${id}: missing ${rel}`);
    }
  }
  assert.ok(fs.existsSync(path.join(LOGOS, 'LICENSE')), 'Apache-2.0 license kept with the logos');
  assert.ok(fs.existsSync(path.join(LOGOS, 'ATTRIBUTION.md')));
  for (const f of fs.readdirSync(LOGOS).filter(f => f.endsWith('.svg'))) {
    const svg = fs.readFileSync(path.join(LOGOS, f), 'utf8');
    assert.doesNotMatch(svg, /<script|\son[a-z]+=|javascript:|<foreignObject/i, f);
  }
});

test('monogram and groupByProvider', () => {
  assert.equal(P.monogram('OpenRouter'), 'OP');
  assert.equal(P.monogram('Together AI'), 'TA');
  assert.equal(P.monogram(''), '?');
  const groups = P.groupByProvider(['gw:groq/a', 'gw:auto', 'gw:groq/b', 'gw:gemini/c'].map(id => ({ id })), 'OmniRoute');
  assert.deepEqual(groups.map(g => [g.provider.id, g.models.length]), [['router', 1], ['groq', 2], ['google', 1]]);
});
