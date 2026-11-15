#!/usr/bin/env node
// One-time migration: pull the content arrays out of the legacy single-file
// front end (v4 public/index.html) and write them as normalized JSON catalogs.
//
//   git show ec4a812:public/index.html > /tmp/legacy.html
//   node scripts/extract-legacy-data.js /tmp/legacy.html
//
// The legacy script is executed inside a vm sandbox with an inert DOM stub —
// no regex parsing of JS literals — so every array is read exactly as the old
// app saw it.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = process.argv[2];
if (!src) { console.error('usage: extract-legacy-data.js <legacy-index.html>'); process.exit(1); }
const html = fs.readFileSync(src, 'utf8');
const script = (html.match(/<script[^>]*>([\s\S]*?)<\/script>/) || [])[1];
if (!script) throw new Error('no <script> block found');

const NAMES = [...script.matchAll(/^\s*(?:const|let|var)\s+([A-Z][A-Z0-9_]{3,})\s*=\s*[\[{]/gm)].map(m => m[1])
  .filter((n, i, a) => a.indexOf(n) === i && !['ALL_SKILLS', 'CCT_SOURCE_COLORS', 'CCT_CAT_COLORS'].includes(n));

// Inert, infinitely-chainable stub: any property read or call returns itself.
const inert = new Proxy(function () {}, {
  get: (t, k) => (k === Symbol.toPrimitive ? () => '' : k === 'length' ? 0 : inert),
  apply: () => inert, construct: () => inert, set: () => true,
});
const store = {};
const sandbox = {
  document: inert, window: inert, navigator: inert, location: inert, history: inert,
  localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: () => {} },
  sessionStorage: { getItem: () => null, setItem: () => {} },
  fetch: () => new Promise(() => {}), setTimeout: () => 0, setInterval: () => 0, clearTimeout: () => {},
  requestAnimationFrame: () => 0, matchMedia: () => ({ matches: false, addEventListener() {} }),
  addEventListener: () => {}, console: { log() {}, warn() {}, error() {} }, alert() {}, confirm: () => false,
  CSS: inert, IntersectionObserver: function () { return inert; }, ResizeObserver: function () { return inert; },
};
vm.createContext(sandbox);
vm.runInContext(`${script}\n;globalThis.__OUT = { ${NAMES.join(', ')} };`, sandbox, { timeout: 10000 });
const D = JSON.parse(JSON.stringify(sandbox.__OUT));

// ── Normalization ──────────────────────────────────────────────────────────
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const vars = t => [...new Set([...String(t || '').matchAll(/\{\{\s*([a-zA-Z0-9_\- ]+?)\s*\}\}/g)].map(m => m[1]))];
const levelFromText = (t = '') => {
  const n = t.length;
  if (/orchestrat|multi-agent|subagent|harness|eval|mcp|tool use|rag|pipeline|governance/i.test(t)) return n > 1500 ? 'expert' : 'advanced';
  if (n > 2500) return 'advanced';
  if (n > 700) return 'intermediate';
  return 'beginner';
};
const LEVEL = { Beginner: 'beginner', Intermediate: 'intermediate', Advanced: 'advanced' };
const seen = new Set();
const uid = (prefix, base) => { let id = `${prefix}-${slug(base) || 'item'}`; let i = 2; while (seen.has(id)) id = `${prefix}-${slug(base)}-${i++}`; seen.add(id); return id; };

const items = [];
const push = o => { o.vars = vars(o.body); o.level = o.level || levelFromText(o.body); items.push(o); };

// Skill collections (id/name/cat/origin/desc/prompt)
const SKILL_SETS = NAMES.filter(n => n.endsWith('_SKILLS') && n !== 'COG_SKILLS');
for (const set of SKILL_SETS) for (const s of D[set] || []) {
  if (!s || !s.prompt) continue;
  push({ id: uid('skill', s.id || s.name), kind: 'skill', title: s.name, summary: s.desc || '', category: s.cat || 'general',
    source: s.origin || set.replace(/_SKILLS$/, '').toLowerCase(), body: s.prompt });
}
// Prompt library
for (const p of D.PROMPTS || []) push({ id: uid('prompt', p.title), kind: 'prompt', title: p.title, summary: '', category: p.category || p.type || 'general', source: 'prompts.chat', body: p.prompt });
// Agents / system prompts
const AGENT_SETS = ['SYSTEM_PROMPTS_DATA', ...NAMES.filter(n => n.endsWith('_AGENTS')), 'X1X_SYSTEM_PROMPTS', 'CLARIT4S_PROMPTS'];
for (const set of AGENT_SETS) for (const a of D[set] || []) {
  const body = a.text || a.prompt; if (!a || !body) continue;
  const isReference = /CL4R1T4S|system_prompts_leaks|x1xhlol|leak/i.test(`${a.source} ${set}`);
  push({ id: uid(isReference ? 'ref' : 'agent', a.name), kind: isReference ? 'reference' : 'agent', title: a.name,
    summary: a.desc || '', category: a.cat || (a.tags && a.tags[0]) || (isReference ? 'system-prompt' : 'agent'),
    source: a.source || set.replace(/_AGENTS$/, '').toLowerCase(), body, tags: a.tags || [] });
}
// Techniques
for (const t of D.TECHNIQUES || []) push({ id: uid('technique', t.name), kind: 'technique', title: t.name, summary: t.desc, category: 'technique', source: 'dair-ai', body: t.example, level: LEVEL[t.level] || 'intermediate' });
// Design system prompts
for (const d of D.DESIGN_SYSTEM || []) push({ id: uid('skill', d.name), kind: 'skill', title: d.name, summary: d.desc, category: 'design', source: 'design-system', body: d.prompt, tags: d.tokens });

// Curated domain taxonomy — the legacy data used 41 overlapping category labels.
const DOMAIN = {
  coding: ['code', 'frontend', 'backend', 'core-development', 'language-experts', 'developer-experience', 'ecc'],
  agents: ['agent', 'orchestration', 'tool', 'context', 'system', 'cog'],
  research: ['research', 'research-analysis', 'search'],
  writing: ['writing'],
  product: ['product', 'business-product'],
  business: ['finance', 'marketing'],
  design: ['design'],
  'data-ml': ['ml', 'data-ai'],
  testing: ['testing', 'quality-assurance'],
  security: ['security'],
  devops: ['devops', 'infrastructure'],
  thinking: ['technique', 'council', 'brain'],
  specialized: ['specialized-domains', 'role'],
};
const domainOf = it => {
  if (it.kind === 'reference') return 'system-prompts';
  if (it.kind === 'technique') return 'thinking';
  for (const [d, cats] of Object.entries(DOMAIN)) if (cats.includes(it.category)) return d;
  return 'specialized';
};
const summarize = body => {
  const clean = String(body).replace(/```[\s\S]*?```/g, ' ')
    .replace(/\{\{\s*([\w\- ]+?)\s*\}\}/g, (_, v) => `[${v.replace(/_/g, ' ')}]`)
    .replace(/[#*>`]/g, '').replace(/\s+/g, ' ').trim();
  const first = (clean.match(/^(.{20,180}?[^\d\s][.!?])(\s|$)/) || [])[1] || clean.slice(0, 160);
  return first.length < clean.length && !/[.!?]$/.test(first) ? `${first.trim()}…` : first.trim();
};
for (const it of items) {
  it.domain = domainOf(it);
  if (!it.summary) it.summary = summarize(it.body);
  delete it.category;
  if (it.tags && !it.tags.length) delete it.tags;
}

// Dedupe identical bodies. v4's PROMPTS array mirrored most skills, so the
// same text appeared as both a "skill" and a "prompt"; keep the richest kind.
const RANK = { skill: 0, agent: 1, technique: 2, reference: 3, prompt: 4 };
const norm = b => b.replace(/\s+/g, ' ').trim().toLowerCase();
const best = new Map();
for (const it of items) {
  const k = norm(it.body);
  const cur = best.get(k);
  if (!cur || RANK[it.kind] < RANK[cur.kind]) best.set(k, it);
}
const keep = new Set(best.values());
const catalog = items.filter(it => keep.has(it));

const out = path.join(__dirname, '..', 'public', 'data');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'catalog.json'), JSON.stringify(catalog));
fs.writeFileSync(path.join(out, 'council.json'), JSON.stringify({ advisors: D.ADVISORS, modes: D.COUNCIL_CARDS }, null, 1));
fs.writeFileSync(path.join(out, 'snippets.json'), JSON.stringify(D.SNIPPETS, null, 1));

const counts = catalog.reduce((m, i) => (m[i.kind] = (m[i.kind] || 0) + 1, m), {});
console.log(`catalog: ${catalog.length} items (deduped from ${items.length})`, counts);
console.log('sets:', NAMES.map(n => `${n}=${Array.isArray(D[n]) ? D[n].length : typeof D[n]}`).join(' '));
