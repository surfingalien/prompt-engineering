'use strict';
// ─── OpenAI-compatible gateway provider ──────────────────────────────────────
// Lets PromptForge run without a Claude API key by talking to a self-hosted
// LLM gateway that routes to providers' free tiers, for example:
//
//   OmniRoute   http://localhost:20128/v1   (github.com/diegosouzapw/OmniRoute)
//   FreeLLMAPI  http://localhost:3001/v1    (github.com/tashfeenahmed/freellmapi)
//
// or any other server speaking the OpenAI Chat Completions API.
//
//   LLM_GATEWAY_URL            base URL including /v1                       (required)
//   LLM_GATEWAY_KEY            bearer key issued by the gateway             (optional)
//   LLM_GATEWAY_NAME           label shown in the UI (default "Free gateway")
//   LLM_GATEWAY_MODELS         comma-separated allowlist; otherwise discovered from /models
//   LLM_GATEWAY_DEFAULT_MODEL  default model id (default "auto" when offered)
//   LLM_GATEWAY_JUDGE_MODEL    a different model for grading/verification (recommended)
//
// Gateway model ids are namespaced "gw:<upstream id>" inside PromptForge so
// they can never collide with Claude model ids.

const { check, extractJson } = require('../schema');

const PREFIX = 'gw:';
const MAX_MODELS = 60;
const CACHE_MS = 5 * 60 * 1000;
const ID_RE = /^[\w.:\/@+-]{1,160}$/;

const conf = () => ({
  url: (process.env.LLM_GATEWAY_URL || '').replace(/\/+$/, ''),
  key: process.env.LLM_GATEWAY_KEY || '',
  name: process.env.LLM_GATEWAY_NAME || 'Free gateway',
});
const configured = () => Boolean(conf().url);

class GatewayError extends Error {
  constructor(message, status = 502) { super(message); this.status = status; this.gateway = true; }
}

function headers() {
  const h = { 'Content-Type': 'application/json', Accept: 'application/json' };
  if (conf().key) h.Authorization = `Bearer ${conf().key}`;
  return h;
}

function entry(upstream) {
  return {
    id: PREFIX + upstream, upstream, provider: 'gateway',
    label: upstream, short: upstream.length > 28 ? `${upstream.slice(0, 26)}…` : upstream,
    blurb: `Routed by ${conf().name}${/^auto/.test(upstream) ? ': picks an available free model' : ''}`,
    price: { input: 0, output: 0 }, free: true,
  };
}

// ── Model discovery ─────────────────────────────────────────────────────────
let cache = { key: '', at: 0, ids: [], error: null };

function allowlist() {
  return (process.env.LLM_GATEWAY_MODELS || '').split(',').map(s => s.trim()).filter(s => ID_RE.test(s));
}

function preferred(ids) {
  const want = process.env.LLM_GATEWAY_DEFAULT_MODEL;
  const first = (want && ids.includes(want)) ? want : ids.find(i => i === 'auto') || ids.find(i => /^auto/.test(i)) || ids[0];
  return first ? [first, ...ids.filter(i => i !== first)] : ids;
}

async function refreshModels(force = false) {
  const c = conf();
  if (!c.url) return [];
  const cacheKey = `${c.url}|${process.env.LLM_GATEWAY_MODELS || ''}|${process.env.LLM_GATEWAY_DEFAULT_MODEL || ''}`;
  if (!force && cache.key === cacheKey && Date.now() - cache.at < CACHE_MS && cache.ids.length) return cache.ids.map(entry);
  const pinned = allowlist();
  let ids = pinned;
  if (!pinned.length) {
    try {
      const res = await fetch(`${c.url}/models`, { headers: headers(), signal: AbortSignal.timeout(6000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      const list = Array.isArray(body) ? body : body.data || body.models || [];
      ids = [...new Set(list.map(m => (typeof m === 'string' ? m : m && m.id)).filter(id => typeof id === 'string' && ID_RE.test(id)))];
      cache.error = null;
    } catch (err) {
      cache.error = err.message;
      ids = cache.ids.length ? cache.ids : [process.env.LLM_GATEWAY_DEFAULT_MODEL || 'auto'];
    }
  }
  ids = preferred(ids).slice(0, MAX_MODELS);
  cache = { ...cache, key: cacheKey, at: Date.now(), ids };
  return ids.map(entry);
}

/** Synchronous view of the last discovered list (refreshModels populates it). */
function cachedModels() { return configured() ? cache.ids.map(entry) : []; }

/** Resolve a "gw:…" id. Only listed models are allowed once discovery has run. */
function resolve(id) {
  if (!configured() || typeof id !== 'string' || !id.startsWith(PREFIX)) return null;
  const upstream = id.slice(PREFIX.length);
  if (!ID_RE.test(upstream)) return null;
  // The operator's own judge/default choices are always allowed.
  const pinned = [process.env.LLM_GATEWAY_JUDGE_MODEL, process.env.LLM_GATEWAY_DEFAULT_MODEL].filter(Boolean);
  if (!pinned.includes(upstream)) {
    if (allowlist().length && !allowlist().includes(upstream)) return null;
    if (cache.ids.length && !cache.ids.includes(upstream)) return null;
  }
  return entry(upstream);
}

function defaultId() {
  const ids = cache.ids.length ? cache.ids : [process.env.LLM_GATEWAY_DEFAULT_MODEL || 'auto'];
  return PREFIX + preferred(ids)[0];
}

function judgeId(producerId) {
  const j = process.env.LLM_GATEWAY_JUDGE_MODEL;
  if (j && ID_RE.test(j)) return PREFIX + j;
  return producerId && producerId.startsWith(PREFIX) ? producerId : defaultId();
}

// ── Requests ────────────────────────────────────────────────────────────────
function toMessages(system, messages) {
  return [...(system ? [{ role: 'system', content: system }] : []), ...messages.map(m => ({ role: m.role, content: m.content }))];
}

async function errorFrom(res) {
  let msg = `HTTP ${res.status}`;
  try {
    const body = await res.json();
    msg = body?.error?.message || body?.message || (typeof body?.error === 'string' ? body.error : msg);
  } catch { /* non-JSON error body */ }
  const status = res.status === 401 || res.status === 403 ? 502 : res.status === 429 ? 429 : res.status >= 500 ? 502 : res.status;
  const prefix = res.status === 401 || res.status === 403 ? 'The gateway rejected PromptForge’s key (check LLM_GATEWAY_KEY)' : res.status === 429 ? 'The gateway’s free quota is exhausted for now' : 'The gateway returned an error';
  return new GatewayError(`${prefix}: ${String(msg).slice(0, 300)}`, status);
}

async function post(path, body, signal) {
  let res;
  try {
    res = await fetch(`${conf().url}${path}`, { method: 'POST', headers: headers(), body: JSON.stringify(body), signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new GatewayError(`Could not reach the gateway at ${conf().url} (${err.cause?.code || err.message}). Is it running?`, 502);
  }
  return res;
}

const STOP = { stop: 'end_turn', length: 'max_tokens', content_filter: 'refusal', tool_calls: 'tool_use' };
const usageOf = u => ({ input_tokens: u?.prompt_tokens || 0, output_tokens: u?.completion_tokens || 0, cache_read_input_tokens: u?.prompt_tokens_details?.cached_tokens || 0, cache_creation_input_tokens: 0 });

/**
 * Stream a chat completion. Calls onDelta(text) / onThinking(text) as chunks
 * arrive. Resolves to { model, stop_reason, usage } in PromptForge's shape.
 */
async function stream({ upstream, system, messages, maxTokens, signal, onDelta, onThinking, onNotice }) {
  const base = { model: upstream, messages: toMessages(system, messages), max_tokens: maxTokens, stream: true };
  let res = await post('/chat/completions', { ...base, stream_options: { include_usage: true } }, signal);
  if (res.status === 400) res = await post('/chat/completions', base, signal); // some upstreams reject stream_options
  if (!res.ok) throw await errorFrom(res);

  const routed = res.headers.get('x-routed-via') || res.headers.get('x-omniroute-model');
  if (routed && onNotice) onNotice(`Routed via ${routed.slice(0, 120)}`);

  let model = upstream, finish = null, usage = null, buf = '';
  const decoder = new TextDecoder();
  const handle = line => {
    if (!line.startsWith('data:')) return;
    const data = line.slice(5).trim();
    if (!data || data === '[DONE]') return;
    let chunk;
    try { chunk = JSON.parse(data); } catch { return; }
    if (chunk.error) throw new GatewayError(`The gateway reported an error mid-stream: ${chunk.error.message || chunk.error}`, 502);
    if (chunk.model) model = chunk.model;
    if (chunk.usage) usage = chunk.usage;
    const choice = chunk.choices?.[0];
    if (!choice) return;
    const d = choice.delta || {};
    const thinking = d.reasoning_content || d.reasoning;
    if (thinking && onThinking) onThinking(thinking);
    if (d.content) onDelta(d.content);
    if (choice.finish_reason) finish = choice.finish_reason;
  };
  for await (const part of res.body) {
    buf += decoder.decode(part, { stream: true });
    let i;
    while ((i = buf.indexOf('\n')) >= 0) { handle(buf.slice(0, i).trim()); buf = buf.slice(i + 1); }
  }
  if (buf.trim()) handle(buf.trim());
  return { model, stop_reason: STOP[finish] || (finish ? finish : 'end_turn'), usage: usageOf(usage) };
}

/**
 * Non-streaming completion. With `format` (a json_schema spec), tries the
 * strongest response_format the upstream accepts, validates the shape, and
 * repairs once on failure. Returns { text, message: { model, usage } }.
 */
async function complete({ upstream, system, messages, maxTokens, format, signal }) {
  if (!format) {
    const res = await post('/chat/completions', { model: upstream, messages: toMessages(system, messages), max_tokens: maxTokens }, signal);
    if (!res.ok) throw await errorFrom(res);
    const body = await res.json();
    return { text: body.choices?.[0]?.message?.content || '', message: { model: body.model || upstream, usage: usageOf(body.usage), stop_reason: STOP[body.choices?.[0]?.finish_reason] || 'end_turn' } };
  }

  const schema = format.schema;
  const contract = `Respond with only a JSON object (no prose, no code fences) that matches this JSON Schema:\n${JSON.stringify(schema)}`;
  const sys = [system, contract].filter(Boolean).join('\n\n');
  const attempts = [
    { type: 'json_schema', json_schema: { name: 'result', strict: true, schema } },
    { type: 'json_object' },
    null,
  ];
  let convo = toMessages(sys, messages);
  let lastErr = null, totalUsage = { input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 };
  let repaired = false;
  for (let a = 0; a < attempts.length; a++) {
    const rf = attempts[a];
    const res = await post('/chat/completions', { model: upstream, messages: convo, max_tokens: maxTokens, ...(rf ? { response_format: rf } : {}) }, signal);
    if (!res.ok) {
      lastErr = await errorFrom(res);
      if (res.status === 400 || res.status === 422) continue; // response_format not supported: downgrade
      throw lastErr;
    }
    const body = await res.json();
    const u = usageOf(body.usage);
    totalUsage = { ...totalUsage, input_tokens: totalUsage.input_tokens + u.input_tokens, output_tokens: totalUsage.output_tokens + u.output_tokens };
    const raw = body.choices?.[0]?.message?.content || '';
    const parsed = extractJson(raw);
    const verdict = parsed === undefined ? { ok: false, errors: ['no JSON found'] } : check(schema, parsed);
    if (verdict.ok) return { text: JSON.stringify(verdict.value), message: { model: body.model || upstream, usage: totalUsage, stop_reason: 'end_turn' } };
    if (!repaired) {
      // One repair turn: show the model exactly what was wrong.
      repaired = true;
      convo = [...convo, { role: 'assistant', content: raw.slice(0, 20000) }, { role: 'user', content: `That response did not match the schema: ${verdict.errors.join('; ')}. Reply again with only the corrected JSON object.` }];
      a -= 1; // retry with the same response_format
      continue;
    }
    lastErr = new GatewayError(`The model’s answer did not match the expected format (${verdict.errors.slice(0, 3).join('; ')}). Try a stronger model.`, 502);
    break;
  }
  throw lastErr || new GatewayError('The gateway did not return a usable response.', 502);
}

function resetCacheForTests() { cache = { key: '', at: 0, ids: [], error: null }; }
const lastError = () => cache.error;

module.exports = { PREFIX, configured, conf, refreshModels, cachedModels, resolve, defaultId, judgeId, stream, complete, GatewayError, resetCacheForTests, lastError };
