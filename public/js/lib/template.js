// {{variable}} templating — extraction, filling, and safe highlighting.

const VAR_RE = /\{\{\s*([a-zA-Z0-9_][a-zA-Z0-9_\- ]*?)\s*\}\}/g;

/** Unique variable names in order of first appearance. */
export function extractVars(...texts) {
  const seen = new Set();
  for (const t of texts) for (const m of String(t || '').matchAll(VAR_RE)) seen.add(m[1]);
  return [...seen];
}

/** Replace {{name}} with values[name]; unknown/empty variables are left intact. */
export function fillVars(text, values = {}) {
  return String(text || '').replace(VAR_RE, (whole, name) => {
    const v = values[name];
    return v === undefined || v === null || v === '' ? whole : String(v);
  });
}

export function unfilledVars(text, values = {}) {
  return extractVars(text).filter(n => values[n] === undefined || values[n] === '');
}

/** Humanize a variable name for labels: "target_audience" → "Target audience". */
export function labelFor(name) {
  const s = String(name).replace(/[_-]+/g, ' ').trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}
