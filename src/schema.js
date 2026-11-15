'use strict';
// ─── Minimal JSON-schema checker for structured responses ───────────────────
// Claude enforces our schemas server-side (structured outputs). Gateway models
// (OmniRoute, FreeLLMAPI → Groq, Gemini, Cerebras, …) vary: some honor
// json_schema, some only json_object, some neither. So every structured
// response is checked here, with light coercion for near-misses that weaker
// models commonly produce ("72" for 72, "true" for true, extra keys).
//
// Supports the subset our schemas use: object (properties, required,
// additionalProperties:false), array (items), string, integer, number,
// boolean, enum.

function coerce(type, v) {
  if (type === 'integer' && typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v.trim())) return Math.round(Number(v));
  if (type === 'integer' && typeof v === 'number' && Number.isFinite(v)) return Math.round(v);
  if (type === 'number' && typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v);
  if (type === 'boolean' && typeof v === 'string' && /^(true|false)$/i.test(v.trim())) return v.trim().toLowerCase() === 'true';
  if (type === 'string' && (typeof v === 'number' || typeof v === 'boolean')) return String(v);
  return v;
}

/** @returns {{ok:boolean, value:any, errors:string[]}} cleaned value with extra keys dropped */
function check(schema, value, path = '$') {
  const errors = [];
  const walk = (s, v, p) => {
    if (!s || typeof s !== 'object') return v;
    v = coerce(s.type, v);
    if (s.enum && !s.enum.includes(v)) { errors.push(`${p} must be one of ${s.enum.join(', ')}`); return v; }
    switch (s.type) {
      case 'object': {
        if (!v || typeof v !== 'object' || Array.isArray(v)) { errors.push(`${p} must be an object`); return v; }
        const out = {};
        for (const k of s.required || []) if (!(k in v)) errors.push(`${p}.${k} is required`);
        for (const [k, sub] of Object.entries(s.properties || {})) if (k in v) out[k] = walk(sub, v[k], `${p}.${k}`);
        if (s.additionalProperties !== false) for (const k of Object.keys(v)) if (!(k in out)) out[k] = v[k];
        return out;
      }
      case 'array':
        if (!Array.isArray(v)) { errors.push(`${p} must be an array`); return v; }
        return v.map((x, i) => walk(s.items, x, `${p}[${i}]`));
      case 'string': if (typeof v !== 'string') errors.push(`${p} must be a string`); return v;
      case 'integer': if (!Number.isInteger(v)) errors.push(`${p} must be an integer`); return v;
      case 'number': if (typeof v !== 'number' || !Number.isFinite(v)) errors.push(`${p} must be a number`); return v;
      case 'boolean': if (typeof v !== 'boolean') errors.push(`${p} must be true or false`); return v;
      default: return v;
    }
  };
  const cleaned = walk(schema, value, path);
  return { ok: errors.length === 0, value: cleaned, errors: errors.slice(0, 12) };
}

/**
 * Pull the first JSON object or array out of model text: tolerates ```json
 * fences, leading prose and trailing commentary. Returns undefined if none.
 */
function extractJson(text) {
  const t = String(text || '').trim();
  try { return JSON.parse(t); } catch { /* fall through */ }
  const fenced = /```(?:json)?\s*([\s\S]*?)```/i.exec(t);
  if (fenced) { try { return JSON.parse(fenced[1]); } catch { /* fall through */ } }
  // Balanced scan from the first { or [ (string-aware).
  for (let start = 0; start < t.length; start++) {
    const open = t[start];
    if (open !== '{' && open !== '[') continue;
    const close = open === '{' ? '}' : ']';
    let depth = 0, inStr = false, esc = false;
    for (let i = start; i < t.length; i++) {
      const c = t[i];
      if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; }
      if (c === '"') inStr = true;
      else if (c === open) depth++;
      else if (c === close && --depth === 0) {
        try { return JSON.parse(t.slice(start, i + 1)); } catch { break; }
      }
    }
  }
  return undefined;
}

module.exports = { check, extractJson };
