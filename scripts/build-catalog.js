#!/usr/bin/env node
// Build public/data/catalog.json from two sources:
//   1. the legacy library already in catalog.json (items without a `path`)
//   2. skill packs in skills/<name>/SKILL.md (Agent Skills format)
//
//   node scripts/build-catalog.js           rebuild catalog.json
//   node scripts/build-catalog.js --check   exit 1 if catalog.json is stale
//
// Each SKILL.md is a real, installable Agent Skill: copy the folder into
// .claude/skills/ and Claude Code picks it up. PromptForge-specific fields live
// under `metadata`, which the Agent Skills spec reserves for this purpose.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, 'skills');
const CATALOG = path.join(ROOT, 'public', 'data', 'catalog.json');

const KINDS = ['skill', 'prompt', 'agent', 'technique', 'reference'];
const LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];
const DOMAINS = ['coding', 'agents', 'research', 'product', 'writing', 'data-ml', 'thinking', 'design', 'testing', 'security', 'devops', 'business', 'trading', 'specialized', 'system-prompts'];

// Minimal YAML subset: `key: value`, one nested `metadata:` map, inline [a, b] lists, quoted strings.
function parseScalar(v) {
  v = v.trim();
  if (v.startsWith('[') && v.endsWith(']')) return v.slice(1, -1).split(',').map(s => parseScalar(s)).filter(s => s !== '');
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1);
  return v;
}
function parseFrontmatter(src, file) {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(src);
  if (!m) throw new Error(`${file}: missing YAML frontmatter`);
  const data = {};
  let nested = null;
  for (const line of m[1].split('\n')) {
    if (!line.trim()) continue;
    const kv = /^(\s*)([\w-]+):\s*(.*)$/.exec(line);
    if (!kv) throw new Error(`${file}: cannot parse frontmatter line "${line}"`);
    const [, indent, key, value] = kv;
    if (indent.length) {
      if (!nested) throw new Error(`${file}: indented key "${key}" outside a map`);
      nested[key] = parseScalar(value);
    } else if (value === '') {
      nested = data[key] = {};
    } else {
      nested = null;
      data[key] = parseScalar(value);
    }
  }
  return { data, body: m[2].trim() };
}

function validate(slug, fm, file) {
  const errs = [];
  if (fm.name !== slug) errs.push(`name "${fm.name}" must match folder "${slug}"`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.name || '') || fm.name.length > 64) errs.push('name must be lowercase-hyphenated, ≤64 chars');
  if (!fm.description || fm.description.length > 1024) errs.push('description is required and must be ≤1024 chars');
  const md = fm.metadata || {};
  if (!md.title) errs.push('metadata.title is required');
  if (md.kind && !KINDS.includes(md.kind)) errs.push(`metadata.kind must be one of ${KINDS}`);
  if (!LEVELS.includes(md.level)) errs.push(`metadata.level must be one of ${LEVELS}`);
  if (!DOMAINS.includes(md.domain)) errs.push(`metadata.domain must be one of ${DOMAINS}`);
  if (!md.pack) errs.push('metadata.pack is required');
  if (errs.length) throw new Error(`${file}:\n  - ${errs.join('\n  - ')}`);
}

// Relative paths of every file in a skill folder (scripts, references, assets).
function listFiles(dir, prefix = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).sort((a, c) => a.name.localeCompare(c.name)).flatMap(e => {
    if (e.name.startsWith('.') || e.name === '__pycache__') return [];
    const rel = prefix ? `${prefix}/${e.name}` : e.name;
    return e.isDirectory() ? listFiles(path.join(dir, e.name), rel) : [rel];
  });
}

const vars = t => [...new Set([...String(t).matchAll(/\{\{\s*([a-zA-Z0-9_][\w\- ]*?)\s*\}\}/g)].map(m => m[1]))];

function loadSkills() {
  if (!fs.existsSync(SKILLS_DIR)) return [];
  return fs.readdirSync(SKILLS_DIR, { withFileTypes: true }).filter(d => d.isDirectory()).sort((a, b) => a.name.localeCompare(b.name)).map(d => {
    const file = path.join(SKILLS_DIR, d.name, 'SKILL.md');
    const rel = path.relative(ROOT, file);
    const { data, body } = parseFrontmatter(fs.readFileSync(file, 'utf8'), rel);
    validate(d.name, data, rel);
    const md = data.metadata;
    const files = listFiles(path.join(SKILLS_DIR, d.name)).filter(f => f !== 'SKILL.md');
    return {
      id: `pack-${d.name}`, kind: md.kind || 'skill', title: md.title, summary: data.description,
      source: md.source || 'PromptForge', body, vars: vars(body), level: md.level, domain: md.domain,
      pack: md.pack, path: `skills/${d.name}`, ...(md.tags ? { tags: md.tags } : {}), ...(files.length ? { files } : {}),
    };
  });
}

function build() {
  const existing = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
  const legacy = existing.filter(it => !it.path);
  // Legacy finance skills belong with the new trading collections.
  for (const it of legacy) if (it.source === 'PromptForge Finance') it.domain = 'trading';
  const packs = loadSkills();
  const ids = new Set();
  for (const it of [...packs, ...legacy]) {
    if (ids.has(it.id)) throw new Error(`duplicate id ${it.id}`);
    ids.add(it.id);
  }
  return { json: JSON.stringify([...packs, ...legacy]), packs, legacy };
}

if (require.main === module) {
  const { json, packs, legacy } = build();
  const current = fs.readFileSync(CATALOG, 'utf8');
  if (process.argv.includes('--check')) {
    if (current !== json) { console.error('catalog.json is stale: run `npm run build:catalog`'); process.exit(1); }
    console.log(`catalog.json is up to date (${packs.length} pack skills + ${legacy.length} library items)`);
  } else {
    fs.writeFileSync(CATALOG, json);
    const byPack = packs.reduce((m, p) => (m[p.pack] = (m[p.pack] || 0) + 1, m), {});
    console.log(`catalog.json: ${packs.length} pack skills + ${legacy.length} library items`, byPack);
  }
}

module.exports = { build, parseFrontmatter, loadSkills };
