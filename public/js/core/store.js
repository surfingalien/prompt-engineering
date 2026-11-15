// ─── Local-first store ───────────────────────────────────────────────────────
// Everything a user creates lives in localStorage under versioned keys. Each
// slice persists independently so one corrupt value can't take down the rest.

import { uid } from './dom.js';

const NS = 'pf5.';
const listeners = new Set();

function read(key, fallback) {
  try { const v = localStorage.getItem(NS + key); return v === null ? fallback : JSON.parse(v); }
  catch { return fallback; }
}
function write(key, value) {
  try { localStorage.setItem(NS + key, JSON.stringify(value)); return true; }
  catch (e) { console.warn('Storage write failed', key, e); return false; }
}

const DEFAULTS = {
  settings: { theme: 'system', model: null, effort: 'medium', showThinking: false, budgetUsd: 10, level: 'beginner' },
  prompts: [],
  suites: [],
  harnesses: [],
  favorites: [],
  progress: {},
  usage: { input: 0, output: 0, cost: 0, runs: 0, since: Date.now() },
  builder: null,
};

export const state = {};
for (const [k, v] of Object.entries(DEFAULTS)) state[k] = read(k, structuredClone(v));
state.settings = { ...DEFAULTS.settings, ...state.settings };

/** Mutate a slice, persist it, notify subscribers. */
export function update(slice, mutate) {
  const next = mutate(state[slice]);
  if (next !== undefined) state[slice] = next;
  write(slice, state[slice]);
  for (const fn of listeners) fn(slice);
}
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

// ── Prompts (workspace) ────────────────────────────────────────────────────
export function createPrompt(init = {}) {
  const p = {
    id: uid('p'), title: init.title || 'Untitled prompt', system: init.system || '', user: init.user || '',
    vars: init.vars || {}, source: init.source || null, versions: [], createdAt: Date.now(), updatedAt: Date.now(),
  };
  update('prompts', list => [p, ...list]);
  return p;
}
export const getPrompt = id => state.prompts.find(p => p.id === id);
export function savePrompt(id, patch) {
  update('prompts', list => list.map(p => (p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p)));
}
export function deletePrompt(id) { update('prompts', list => list.filter(p => p.id !== id)); }
export function snapshot(id, note = '') {
  const p = getPrompt(id); if (!p) return null;
  const v = { id: uid('v'), at: Date.now(), note, system: p.system, user: p.user };
  savePrompt(id, { versions: [v, ...(p.versions || [])].slice(0, 50) });
  return v;
}

// ── Usage meter ────────────────────────────────────────────────────────────
export function recordUsage(usage, price) {
  if (!usage) return;
  const input = (usage.input_tokens || 0) + (usage.cache_creation_input_tokens || 0) + (usage.cache_read_input_tokens || 0);
  const cost = price ? ((usage.input_tokens || 0) * price.input + (usage.cache_creation_input_tokens || 0) * price.input * 1.25
    + (usage.cache_read_input_tokens || 0) * price.input * 0.1 + (usage.output_tokens || 0) * price.output) / 1e6 : 0;
  update('usage', u => ({ ...u, input: u.input + input, output: u.output + (usage.output_tokens || 0), cost: u.cost + cost, runs: u.runs + 1 }));
}

// ── Favorites & progress ───────────────────────────────────────────────────
export const isFavorite = id => state.favorites.includes(id);
export function toggleFavorite(id) {
  update('favorites', f => (f.includes(id) ? f.filter(x => x !== id) : [id, ...f]));
  return isFavorite(id);
}
export function setLessonDone(id, done = true) { update('progress', p => ({ ...p, [id]: done ? Date.now() : undefined })); }

// ── Import / export ────────────────────────────────────────────────────────
export function exportWorkspace() {
  const data = Object.fromEntries(Object.keys(DEFAULTS).map(k => [k, state[k]]));
  // Never put credentials in an export file.
  const { userApiKey, accessPassword, ...settings } = data.settings;
  return { app: 'PromptForge', version: 5, exportedAt: new Date().toISOString(), ...data, settings };
}
export function importWorkspace(data) {
  if (!data || data.app !== 'PromptForge') throw new Error('Not a PromptForge export file.');
  for (const k of ['prompts', 'suites', 'harnesses']) {
    if (Array.isArray(data[k])) {
      const have = new Set(state[k].map(x => x.id));
      update(k, list => [...data[k].filter(x => x && x.id && !have.has(x.id)), ...list]);
    }
  }
  if (Array.isArray(data.favorites)) update('favorites', f => [...new Set([...f, ...data.favorites])]);
  if (data.progress && typeof data.progress === 'object') update('progress', p => ({ ...data.progress, ...p }));
}
export function resetWorkspace() {
  for (const k of Object.keys(DEFAULTS)) localStorage.removeItem(NS + k);
}

// ── One-time migration from PromptForge v4 (pf2_history) ───────────────────
(function migrateLegacy() {
  if (read('migrated', false)) return;
  try {
    const old = JSON.parse(localStorage.getItem('pf2_history') || '[]');
    if (Array.isArray(old) && old.length && !state.prompts.length) {
      const migrated = old.filter(h => h && h.prompt).slice(0, 50).map(h => ({
        id: uid('p'), title: h.title || 'Imported prompt', system: '', user: h.prompt, vars: {}, source: 'v4 history',
        versions: [], createdAt: h.id || Date.now(), updatedAt: h.id || Date.now(),
      }));
      state.prompts = migrated;
      write('prompts', migrated);
    }
  } catch { /* ignore malformed legacy data */ }
  write('migrated', true);
})();

// Scout library keeps its v4 key so saved discoveries carry over untouched.
export const SCOUT_KEY = 'pf-scout-library';
export function scoutLibrary() {
  try { const s = JSON.parse(localStorage.getItem(SCOUT_KEY) || '{}'); return { skills: s.skills || [], agents: s.agents || [] }; }
  catch { return { skills: [], agents: [] }; }
}
export function saveScoutLibrary(lib) {
  localStorage.setItem(SCOUT_KEY, JSON.stringify(lib));
  for (const fn of listeners) fn('scout');
}
