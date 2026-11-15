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

const EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max'];

// ALLOWED_MODELS (comma-separated ids) lets an operator restrict a public
// deployment — e.g. leave Fable off to cap spend. Unknown ids are ignored.
function enabledModels() {
  const raw = (process.env.ALLOWED_MODELS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!raw.length) return MODELS;
  const allowed = MODELS.filter(m => raw.includes(m.id));
  return allowed.length ? allowed : MODELS;
}

function defaultModel() {
  const enabled = enabledModels();
  const wanted = process.env.DEFAULT_MODEL;
  return (enabled.find(m => m.id === wanted) || enabled.find(m => m.id === 'claude-opus-5-5') || enabled[0]).id;
}

function resolveModel(id) {
  const enabled = enabledModels();
  return enabled.find(m => m.id === id) || enabled.find(m => m.id === defaultModel());
}

// Cheaper model for grading / verification work. A judge should be a
// different model from the one that produced the output when possible.
function judgeModel(producerId) {
  const enabled = enabledModels().map(m => m.id);
  const pick = producerId === 'claude-haiku-5-5' ? 'claude-sonnet-5-5' : 'claude-haiku-5-5';
  return enabled.includes(pick) ? pick : defaultModel();
}

module.exports = { MODELS, EFFORTS, enabledModels, defaultModel, resolveModel, judgeModel };
