'use strict';
// ─── Anthropic client + request builders ─────────────────────────────────────
// All upstream calls go through the official SDK. Helicone (optional) is wired
// in by swapping the base URL and adding its auth header — nothing else changes.

const Anthropic = require('@anthropic-ai/sdk').default;
const { resolveModel, EFFORTS } = require('./models');

const FALLBACK_BETA = 'server-side-fallback-2026-07-01';

let cached = null;
function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  const helicone = process.env.HELICONE_API_KEY;
  const key = `${apiKey}|${helicone || ''}|${process.env.ANTHROPIC_BASE_URL || ''}`;
  if (cached && cached.key === key) return cached.client;
  const opts = { apiKey, maxRetries: 2 };
  if (helicone) {
    opts.baseURL = 'https://anthropic.helicone.ai';
    opts.defaultHeaders = { 'Helicone-Auth': `Bearer ${helicone}` };
  } else if (process.env.ANTHROPIC_BASE_URL) {
    opts.baseURL = process.env.ANTHROPIC_BASE_URL;
  }
  cached = { key, client: new Anthropic(opts) };
  return cached.client;
}

// Build Messages API params from an already-validated request.
//  - Thinking is adaptive on every current model; `showThinking` only asks for
//    a readable summary (display) — it does not change billing.
//  - Depth is controlled with output_config.effort (no temperature: current
//    models reject non-default sampling parameters).
//  - Models that support it get server-side refusal fallbacks ("default"
//    routes by refusal category), so a false-positive decline is retried on
//    another model instead of surfacing as an outage.
function buildParams({ model, system, messages, effort, maxTokens, showThinking, format }) {
  const m = resolveModel(model);
  const params = {
    model: m.id,
    max_tokens: maxTokens,
    messages,
    output_config: { effort: EFFORTS.includes(effort) ? effort : 'medium' },
  };
  if (format) params.output_config.format = format;
  if (system) params.system = [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }];
  if (showThinking) params.thinking = { type: 'adaptive', display: 'summarized' };
  if (m.serverFallback) {
    params.betas = [FALLBACK_BETA];
    params.fallbacks = 'default';
  }
  return { params, model: m, beta: m.serverFallback };
}

function messagesApi(client, beta) {
  return beta ? client.beta.messages : client.messages;
}

// Concatenate text blocks. Responses can start with thinking or fallback
// blocks, so never assume content[0] is the answer.
function textOf(message) {
  return (message?.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
}

// Non-streaming convenience for short structured jobs (Scout, grading).
async function complete(client, req) {
  const { params, beta } = buildParams(req);
  const message = await messagesApi(client, beta).create(params);
  if (message.stop_reason === 'refusal') {
    const err = new Error(`Claude declined this request${message.stop_details?.category ? ` (${message.stop_details.category})` : ''}.`);
    err.status = 422;
    throw err;
  }
  return { message, text: textOf(message) };
}

// Map SDK errors to a safe, user-facing shape. Never echo upstream bodies
// verbatim — they can contain request ids and internal detail.
function describeError(err) {
  if (err instanceof Anthropic.AuthenticationError) return { status: 502, message: 'The server\'s Anthropic API key was rejected.' };
  if (err instanceof Anthropic.RateLimitError) return { status: 429, message: 'Anthropic rate limit reached. Try again shortly.' };
  if (err instanceof Anthropic.BadRequestError) return { status: 400, message: `Request rejected by the API: ${err.error?.error?.message || err.message}` };
  if (err instanceof Anthropic.APIConnectionError) return { status: 502, message: 'Could not reach the Anthropic API.' };
  if (err instanceof Anthropic.APIError) return { status: err.status && err.status >= 400 ? err.status : 502, message: `Anthropic API error${err.status ? ` (${err.status})` : ''}.` };
  return { status: err.status || 500, message: err.message || 'Unexpected server error.' };
}

module.exports = { getClient, buildParams, messagesApi, textOf, complete, describeError, FALLBACK_BETA };
