'use strict';
// ─── Model registry ──────────────────────────────────────────────────────────
// Single source of truth for which Claude models the app may call, how they
// are labelled in the UI, and what they cost. The browser never sends a raw
// model string upstream: every request is checked against this list.
//
// Prices are USD per million tokens (Claude API first-party rates) and are only
// used for the client-side usage meter — they are estimates, not billing.

const MODELS = [
  {
    id: 'claude-opus-5-5', label: 'Claude Opus 5.5', short: 'Opus 5.5',
    blurb: 'Most capable everyday model. Best default for hard prompts and agents.',
    price: { input: 4, output: 20 }, serverFallback: true,
  },
  {
    id: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5', short: 'Sonnet 5.5',
    blurb: 'Fast and capable. Great for iteration loops and coding work.',
    price: { input: 2, output: 10 }, serverFallback: true,
  },
  {
    id: 'claude-haiku-5-5', label: 'Claude Haiku 5.5', short: 'Haiku 5.5',
    blurb: 'Fastest and lowest cost. Ideal for evals, grading and bulk runs.',
    price: { input: 0.1, output: 0.5 }, serverFallback: false,
  },
  {
    id: 'claude-fable-5-2', label: 'Claude Fable 5.2', short: 'Fable 5.2',
    blurb: 'Frontier reasoning for the most demanding, long-horizon work.',
    price: { input: 8, output: 40 }, serverFallback: true,
  },
];

MODELS.forEach(m => { m.provider = 'anthropic'; });

const EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max'];

// Lazy require: providers/gateway has no dependency on this module, but keep
// the registry loadable on its own.
const gw = () => require('./providers/gateway');
const hasServerKey = () => Boolean(process.env.ANTHROPIC_API_KEY);

// ALLOWED_MODELS (comma-separated ids) lets an operator restrict a public
// deployment — e.g. leave Fable off to cap spend. Unknown ids are ignored.
function enabledClaude() {
  const raw = (process.env.ALLOWED_MODELS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!raw.length) return MODELS;
  const allowed = MODELS.filter(m => raw.includes(m.id));
  return allowed.length ? allowed : MODELS;
}

// Every model a request may name: Claude models, then models discovered on the
// OpenAI-compatible gateway (LLM_GATEWAY_URL, see providers/gateway.js).
// Claude models are marked `requiresUserKey` when the server has no
// ANTHROPIC_API_KEY: they still work with a visitor's own key.
function enabledModels() {
  const claude = enabledClaude().map(m => ({ ...m, requiresUserKey: !hasServerKey() }));
  const gateway = gw().cachedModels();
  return hasServerKey() ? [...claude, ...gateway] : [...gateway, ...claude];
}

/** Refresh the gateway's model list (cached for 5 minutes). */
async function refreshModels(force) {
  if (gw().configured()) await gw().refreshModels(force);
  return enabledModels();
}

function claudeDefault() {
  const enabled = enabledClaude();
  const wanted = process.env.DEFAULT_MODEL;
  return (enabled.find(m => m.id === wanted) || enabled.find(m => m.id === 'claude-opus-5-5') || enabled[0]).id;
}

// With a server key, Claude is the default. Without one, a configured gateway
// is (so the app runs with no Anthropic key at all). DEFAULT_MODEL may name
// either kind ("gw:auto" works).
function defaultModel() {
  const wanted = process.env.DEFAULT_MODEL;
  if (wanted && wanted.startsWith(gw().PREFIX) && gw().resolve(wanted)) return wanted;
  if (!hasServerKey() && gw().configured()) return gw().defaultId();
  return claudeDefault();
}

function resolveModel(id) {
  if (typeof id === 'string' && id.startsWith(gw().PREFIX)) {
    const m = gw().resolve(id);
    if (m) return m;
  } else {
    const m = enabledClaude().find(x => x.id === id);
    if (m) return m;
  }
  const def = defaultModel();
  return def.startsWith(gw().PREFIX) ? gw().resolve(def) || gw().resolve(gw().defaultId()) : enabledClaude().find(m => m.id === def);
}

// Model for grading / verification work. A judge should differ from the model
// that produced the output when possible. On the gateway, set
// LLM_GATEWAY_JUDGE_MODEL to get that; otherwise the producer judges itself.
function judgeModel(producerId) {
  if (typeof producerId === 'string' && producerId.startsWith(gw().PREFIX)) return gw().judgeId(producerId);
  if (!producerId && !hasServerKey() && gw().configured()) return gw().judgeId(defaultModel());
  const enabled = enabledClaude().map(m => m.id);
  const pick = producerId === 'claude-haiku-5-5' ? 'claude-sonnet-5-5' : 'claude-haiku-5-5';
  return enabled.includes(pick) ? pick : claudeDefault();
}

const isGateway = id => typeof id === 'string' && id.startsWith(gw().PREFIX);

module.exports = { MODELS, EFFORTS, enabledModels, enabledClaude, refreshModels, defaultModel, resolveModel, judgeModel, isGateway, hasServerKey };
