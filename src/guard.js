'use strict';
// ─── Spend protection ────────────────────────────────────────────────────────
// A public deployment shares one ANTHROPIC_API_KEY with every visitor. Three
// layers keep that safe:
//
//   1. DAILY_BUDGET_USD   hard daily cap on server-key spend (default $10; 0 = off).
//                         Spend is computed from each response's usage and the
//                         model price table, and survives restarts (SPEND_STATE_PATH).
//   2. ACCESS_PASSWORD    optional shared password for server-key requests.
//   3. Bring your own key A visitor may send their own key in x-user-api-key.
//                         It is used for that request only: never stored, never
//                         logged, and not counted against the server budget.
//
// Free gateway models (LLM_GATEWAY_URL) cost nothing per token but spend the
// operator's free-tier quota, so they keep the password gate and get their own
// cap: GATEWAY_DAILY_REQUEST_LIMIT (default 1000/day; 0 = off).
//
// Rate limiting (per IP) stays in app.js as a fourth, coarser layer.

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk').default;
const { getClient } = require('./anthropic');
const { MODELS } = require('./models');

const STATE_PATH = process.env.SPEND_STATE_PATH || path.join(__dirname, '..', 'spend-state.json');

function dailyBudget() {
  const raw = process.env.DAILY_BUDGET_USD;
  if (raw === undefined || raw === '') return 10;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 10;
}

const today = () => new Date().toISOString().slice(0, 10);
let spend = null;
function loadSpend() {
  if (spend && spend.date === today()) return spend;
  try {
    const s = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
    spend = s && s.date === today() ? { date: s.date, usd: Number(s.usd) || 0, requests: Number(s.requests) || 0, gatewayRequests: Number(s.gatewayRequests) || 0 } : null;
  } catch { spend = null; }
  if (!spend) spend = { date: today(), usd: 0, requests: 0, gatewayRequests: 0 };
  return spend;
}
function saveSpend() {
  try { fs.writeFileSync(STATE_PATH, JSON.stringify(spend)); } catch { /* read-only FS: keep in memory */ }
}

/** USD cost of one response, from its usage block and the model price table. */
function costOf(modelId, usage = {}) {
  const m = MODELS.find(x => modelId && modelId.startsWith(x.id));
  if (!m) return 0;
  const p = m.price;
  return ((usage.input_tokens || 0) * p.input
    + (usage.cache_creation_input_tokens || 0) * p.input * 1.25
    + (usage.cache_read_input_tokens || 0) * p.input * 0.1
    + (usage.output_tokens || 0) * p.output) / 1e6;
}

function gatewayLimit() {
  const raw = process.env.GATEWAY_DAILY_REQUEST_LIMIT;
  if (raw === undefined || raw === '') return 1000;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : 1000;
}

function budgetStatus() {
  const s = loadSpend();
  const daily = dailyBudget();
  const limit = gatewayLimit();
  return {
    daily, spent: Math.round(s.usd * 10000) / 10000, remaining: daily ? Math.max(0, Math.round((daily - s.usd) * 10000) / 10000) : null, requests: s.requests, date: s.date,
    gateway: { limit, used: s.gatewayRequests, remaining: limit ? Math.max(0, limit - s.gatewayRequests) : null },
  };
}

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function passwordRefusal(req, extra) {
  const password = process.env.ACCESS_PASSWORD;
  if (password && !safeEqual(req.get('x-access-password') || '', password)) {
    return { status: 401, body: { error: `This server requires an access password (Settings)${extra}.`, code: 'auth_required' } };
  }
  return null;
}

/**
 * Decide which credential a request may use for `model` (an entry from
 * models.resolveModel; Claude when omitted).
 * @returns {{provider:'anthropic', client, byo:boolean} | {provider:'gateway', byo:false} | {status:number, body:object}}
 */
function authorize(req, model) {
  if (model && model.provider === 'gateway') {
    const refused = passwordRefusal(req, '');
    if (refused) return refused;
    const limit = gatewayLimit();
    if (limit && loadSpend().gatewayRequests >= limit) {
      return { status: 429, body: { error: `Today's free-model quota on this server (${limit} requests) is used up. Try again tomorrow (UTC), or add your own Anthropic API key in Settings and pick a Claude model.`, code: 'quota_exhausted' } };
    }
    return { provider: 'gateway', byo: false };
  }
  const userKey = req.get('x-user-api-key');
  if (userKey) {
    if (!/^sk-ant-[\w-]{20,}$/.test(userKey)) return { status: 400, body: { error: 'That does not look like an Anthropic API key (sk-ant-…).', code: 'bad_user_key' } };
    const opts = { apiKey: userKey, maxRetries: 2 };
    if (process.env.ANTHROPIC_BASE_URL) opts.baseURL = process.env.ANTHROPIC_BASE_URL;
    return { provider: 'anthropic', client: new Anthropic(opts), byo: true };
  }
  const client = getClient();
  if (!client) {
    const free = process.env.LLM_GATEWAY_URL ? ' or pick a free gateway model' : '';
    return { status: 503, body: { error: `This server has no ANTHROPIC_API_KEY. Add your own key in Settings${free} to run prompts.`, code: 'no_api_key' } };
  }
  const refused = passwordRefusal(req, ', or your own API key');
  if (refused) return refused;
  const daily = dailyBudget();
  if (daily && loadSpend().usd >= daily) {
    return { status: 429, body: { error: `Today's shared budget ($${daily}) is used up. Add your own API key in Settings, or try again tomorrow (UTC).`, code: 'budget_exhausted' } };
  }
  return { provider: 'anthropic', client, byo: false };
}

/** Record spend for a server-key request. BYO-key requests are not counted. */
function recordSpend(auth, modelId, usage) {
  if (!auth || auth.byo) return;
  const s = loadSpend();
  if (auth.provider === 'gateway') s.gatewayRequests += 1;
  else if (usage) { s.usd += costOf(modelId, usage); s.requests += 1; } else return;
  saveSpend();
}

function resetSpendForTests() { spend = { date: today(), usd: 0, requests: 0, gatewayRequests: 0 }; saveSpend(); }

module.exports = { authorize, recordSpend, budgetStatus, costOf, dailyBudget, gatewayLimit, resetSpendForTests, STATE_PATH };
