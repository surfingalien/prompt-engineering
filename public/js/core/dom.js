// Tiny, safe templating. `html` escapes every interpolation unless it is
// itself an `html` result or wrapped with `raw()`. No inline event handlers
// anywhere: behaviour is attached with delegated listeners via `on()`.

import { escapeHtml } from '../lib/escape.js';

class Safe { constructor(s) { this.s = s; } toString() { return this.s; } }
export const raw = s => new Safe(String(s ?? ''));

function fmt(v) {
  if (v === null || v === undefined || v === false) return '';
  if (v instanceof Safe) return v.s;
  if (Array.isArray(v)) return v.map(fmt).join('');
  return escapeHtml(v);
}

export function html(strings, ...vals) {
  let out = '';
  strings.forEach((s, i) => { out += s + (i < vals.length ? fmt(vals[i]) : ''); });
  return new Safe(out);
}

export function render(el, tpl) { el.innerHTML = String(tpl); return el; }
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Delegated listener. Returns an unsubscribe function. */
export function on(root, type, selector, handler, opts) {
  const fn = e => {
    const target = e.target.closest(selector);
    if (target && root.contains(target)) handler(e, target);
  };
  root.addEventListener(type, fn, opts);
  return () => root.removeEventListener(type, fn, opts);
}

export function debounce(fn, ms = 200) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

export const uid = (p = 'id') => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export function timeAgo(ts) {
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 45) return 'just now';
  const m = Math.round(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60); if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24); if (d < 30) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}

/** Highlight {{vars}} and <tags> inside already-escaped prompt text. */
export function highlightPrompt(text) {
  return raw(escapeHtml(text)
    .replace(/\{\{\s*([\w\- ]+?)\s*\}\}/g, '<span class="v">{{$1}}</span>')
    .replace(/&lt;(\/?)([a-zA-Z][\w-]{0,40})&gt;/g, '<span class="t">&lt;$1$2&gt;</span>'));
}

export function autosize(ta, min = 0) {
  ta.style.height = 'auto';
  ta.style.height = `${Math.max(min, ta.scrollHeight + 2)}px`;
}
