// ─── Catalog: library content + saved Scout discoveries ──────────────────────
import { prepare, search } from '../lib/search.js';
import { scoutLibrary } from './store.js';

export const KINDS = [
  { id: 'skill', label: 'Skills', one: 'Skill', desc: 'Reusable workflow templates' },
  { id: 'prompt', label: 'Prompts', one: 'Prompt', desc: 'Ready-to-use prompts and personas' },
  { id: 'agent', label: 'Agents', one: 'Agent', desc: 'System prompts for specialist agents' },
  { id: 'technique', label: 'Techniques', one: 'Technique', desc: 'Core prompting patterns' },
  { id: 'reference', label: 'References', one: 'Reference', desc: 'Community-collected product system prompts' },
];
export const DOMAINS = {
  coding: 'Coding', agents: 'Agents & orchestration', research: 'Research', product: 'Product & strategy', writing: 'Writing',
  'data-ml': 'Data & ML', thinking: 'Thinking & decisions', design: 'Design', testing: 'Testing & QA', security: 'Security',
  devops: 'DevOps', business: 'Business', specialized: 'Specialized', 'system-prompts': 'System prompts',
};
export const LEVELS = [
  { id: 'beginner', label: 'Beginner', n: 1 },
  { id: 'intermediate', label: 'Intermediate', n: 2 },
  { id: 'advanced', label: 'Advanced', n: 3 },
  { id: 'expert', label: 'Expert', n: 4 },
];
export const levelLabel = id => LEVELS.find(l => l.id === id)?.label || id;

const SCOUT_DOMAIN = { code: 'coding', frontend: 'coding', backend: 'coding', agent: 'agents', ml: 'data-ml', research: 'research', writing: 'writing', product: 'product', design: 'design', testing: 'testing', security: 'security', devops: 'devops',
  'core-development': 'coding', 'data-ai': 'data-ml', infrastructure: 'devops', orchestration: 'agents', 'quality-assurance': 'testing', 'specialized-domains': 'specialized' };

function scoutItems() {
  const lib = scoutLibrary();
  return [
    ...lib.skills.map(s => ({ id: `scout-skill-${s.id}`, kind: 'skill', title: s.name, summary: s.desc || '', domain: SCOUT_DOMAIN[s.cat] || 'agents', source: 'Scout', body: s.prompt, level: 'advanced', scout: true, note: s.note })),
    ...lib.agents.map(a => ({ id: `scout-agent-${a.name}`, kind: 'agent', title: a.name, summary: (a.text || '').slice(0, 160), domain: SCOUT_DOMAIN[a.cat] || 'agents', source: 'Scout', body: a.text, level: 'advanced', tags: a.tags, scout: true, note: a.note })),
  ];
}

let base = null;
let loading = null;
let index = null;
let items = null;

export function loadCatalog() {
  if (!loading) {
    loading = fetch('/data/catalog.json').then(r => {
      if (!r.ok) throw new Error(`catalog ${r.status}`);
      return r.json();
    }).then(data => { base = data; invalidate(); return all(); });
  }
  return loading;
}
export function invalidate() { items = null; index = null; }
export function all() {
  if (!items) items = [...scoutItems(), ...(base || [])];
  return items;
}
export function find(id) { return all().find(i => i.id === id); }
export function query(q, filters) {
  if (!index) index = prepare(all());
  return search(index, q, filters);
}
export function counts(list = all()) {
  const c = { kind: {}, domain: {}, level: {} };
  for (const it of list) {
    c.kind[it.kind] = (c.kind[it.kind] || 0) + 1;
    c.domain[it.domain] = (c.domain[it.domain] || 0) + 1;
    c.level[it.level] = (c.level[it.level] || 0) + 1;
  }
  return c;
}
