// ─── API client ──────────────────────────────────────────────────────────────
import { state, recordUsage } from './store.js';

// Credentials the visitor may supply (Settings). The user key is sent only to
// this app's own server, used for that request, and never stored server-side.
export function authHeaders() {
  const h = {};
  if (state.settings.userApiKey) h['x-user-api-key'] = state.settings.userApiKey;
  if (state.settings.accessPassword) h['x-access-password'] = state.settings.accessPassword;
  return h;
}

let configPromise = null;
export function getConfig(force = false) {
  if (!configPromise || force) {
    configPromise = fetch('/api/config').then(r => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .catch(() => ({ ready: false, offline: true, models: [], efforts: ['low', 'medium', 'high', 'xhigh', 'max'], defaultModel: 'claude-opus-5-5', maxOutputTokens: 16000 }))
      .then(c => {
        const hasUserKey = Boolean(state.settings.userApiKey);
        const unlocked = !c.access?.passwordRequired || Boolean(state.settings.accessPassword);
        const serverKey = Boolean(c.providers?.anthropic?.serverKey ?? c.ready);
        const gateway = c.providers?.gateway || null;
        const claudeLeft = !c.budget?.daily || c.budget.remaining > 0;
        const gatewayLeft = !c.budget?.gateway?.limit || c.budget.gateway.remaining > 0;
        const budgetLeft = (serverKey && claudeLeft) || (Boolean(gateway) && gatewayLeft);
        const allModels = c.models || [];
        // Hide Claude models nobody here can run (no server key, no user key)
        // when free gateway models are available instead.
        const runnable = allModels.filter(m => !m.requiresUserKey || hasUserKey);
        const models = runnable.length ? runnable : allModels;
        return {
          ...c,
          allModels,
          models,
          defaultModel: models.some(m => m.id === c.defaultModel) ? c.defaultModel : models[0]?.id || c.defaultModel,
          gateway,
          serverReady: Boolean(c.ready),
          // "ready" = this visitor can run prompts right now.
          ready: hasUserKey || (Boolean(c.ready) && unlocked && budgetLeft),
          via: hasUserKey ? 'user-key' : serverKey ? 'server' : gateway ? 'gateway' : 'none',
          lockedReason: hasUserKey ? null : !c.ready ? 'no_key' : !unlocked ? 'password' : !budgetLeft ? (serverKey ? 'budget' : 'quota') : null,
        };
      });
  }
  return configPromise;
}

export async function currentModel() {
  const cfg = await getConfig();
  const wanted = state.settings.model;
  return cfg.models.find(m => m.id === wanted) || cfg.models.find(m => m.id === cfg.defaultModel) || cfg.models[0] || { id: cfg.defaultModel, label: cfg.defaultModel };
}

export class ApiError extends Error {
  constructor(message, status, code) { super(message); this.status = status; this.code = code; }
}

async function errorFrom(res) {
  let body = {};
  try { body = await res.json(); } catch {}
  if (body.code === 'no_api_key') return new ApiError(body.error || 'Live runs are off: the server has no API key. Add your own key in Settings, or keep working offline.', res.status, 'no_api_key');
  if (body.code === 'auth_required') return new ApiError(state.settings.accessPassword ? 'The access password was rejected. Check it in Settings.' : 'This server needs an access password, or your own API key. Add one in Settings.', res.status, 'auth_required');
  if (body.code === 'budget_exhausted' || body.code === 'quota_exhausted') getConfig(true);
  return new ApiError(body.error || `Request failed (${res.status})`, res.status, body.code);
}

/**
 * Stream a chat completion over SSE.
 * @returns {Promise<{text:string, thinking:string, usage:object, model:string, stopReason:string}>}
 */
export async function streamChat({ model, system, messages, effort, maxTokens, showThinking, signal, onDelta, onThinking, onNotice }) {
  const res = await fetch('/api/chat', {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, signal,
    body: JSON.stringify({ model, system, messages, effort, maxTokens, showThinking }),
  });
  if (!res.ok) throw await errorFrom(res);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '', text = '', thinking = '', done = null;
  for (;;) {
    const { value, done: end } = await reader.read();
    if (end) break;
    buf += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buf.indexOf('\n\n')) >= 0) {
      const chunk = buf.slice(0, idx); buf = buf.slice(idx + 2);
      const ev = /^event: (.*)$/m.exec(chunk)?.[1];
      const dataLine = /^data: (.*)$/m.exec(chunk)?.[1];
      if (!ev || !dataLine) continue;
      const data = JSON.parse(dataLine);
      if (ev === 'delta') { text += data.text; onDelta?.(data.text, text); }
      else if (ev === 'thinking') { thinking += data.text; onThinking?.(data.text, thinking); }
      else if (ev === 'notice') onNotice?.(data.message);
      else if (ev === 'error') throw new ApiError(data.message, data.status);
      else if (ev === 'done') done = data;
    }
  }
  if (!done) throw new ApiError('The response ended unexpectedly.', 502);
  const cfg = await getConfig();
  recordUsage(done.usage, cfg.models.find(m => m.id === model)?.price || cfg.models.find(m => done.model?.startsWith(m.id))?.price);
  return { text, thinking, usage: done.usage, model: done.model, stopReason: done.stop_reason };
}

async function postJson(path, body, signal) {
  const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(body), signal });
  if (!res.ok) throw await errorFrom(res);
  return res.json();
}

export async function grade({ output, rubric, input, model, signal }) {
  const r = await postJson('/api/grade', { output, rubric, input, model }, signal);
  const cfg = await getConfig();
  recordUsage(r.usage, cfg.models.find(m => r.model?.startsWith(m.id))?.price);
  return r;
}
export async function review(body, signal) {
  const r = await postJson('/api/review', body, signal);
  const cfg = await getConfig();
  recordUsage(r.usage, cfg.models.find(m => r.model?.startsWith(m.id))?.price);
  return r;
}
export async function generateCases(body, signal) {
  const r = await postJson('/api/cases', body, signal);
  const cfg = await getConfig();
  recordUsage(r.usage, cfg.models.find(m => r.model?.startsWith(m.id))?.price);
  return r;
}
export const scout = body => postJson('/api/scout', body);
export const maintainScout = body => postJson('/api/scout/maintain', body);
export const auditLog = () => fetch('/api/scout/audit?limit=30').then(r => r.json());
export const verifyAudit = () => fetch('/api/scout/audit/verify').then(r => r.json());

export function formatCost(usd) {
  if (!usd) return '$0.00';
  return usd < 0.01 ? `<$0.01` : `$${usd.toFixed(usd < 1 ? 3 : 2)}`;
}
