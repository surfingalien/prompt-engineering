// Skill packs: every skills/<name>/SKILL.md must be a valid Agent Skill and be
// reflected in public/data/catalog.json (run `npm run build:catalog`).
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { build, loadSkills, loadMcp, parseFrontmatter } = require('../scripts/build-catalog');

const ROOT = path.join(__dirname, '..');

test('every skill folder has a spec-compliant SKILL.md', () => {
  const skills = loadSkills(); // throws with a precise message on any violation
  assert.ok(skills.length >= 50, `expected the skill packs, found ${skills.length}`);
  for (const s of skills) {
    assert.ok(s.summary.length >= 60, `${s.path}: description should say what it does and when to use it`);
    assert.ok(/\{\{[\w-]+\}\}/.test(s.body), `${s.path}: body should expose at least one {{variable}}`);
    assert.ok(/^# /m.test(s.body), `${s.path}: body should start with a heading`);
  }
});

test('catalog.json is in sync with skills/', () => {
  const { json } = build();
  assert.equal(fs.readFileSync(path.join(ROOT, 'public', 'data', 'catalog.json'), 'utf8'), json, 'run `npm run build:catalog`');
});

test('every pack used by a skill or MCP server is a known collection, and every collection has items', async () => {
  const { PACKS } = await import('../public/js/data/packs.js');
  const ids = new Set(PACKS.map(p => p.id));
  const used = new Set([...loadSkills(), ...loadMcp()].map(s => s.pack));
  for (const p of used) assert.ok(ids.has(p), `unknown pack ${p}`);
  for (const p of ids) assert.ok(used.has(p), `empty pack ${p}`);
});

test('trading and quant skills carry a risk disclaimer where they touch money', () => {
  for (const s of loadSkills().filter(x => ['trading-desk', 'vol-surface'].includes(x.pack))) {
    assert.match(s.body, /not financial advice/i, `${s.path} needs a disclaimer`);
  }
});

test('frontmatter parser handles quoting, lists and nested metadata', () => {
  const { data, body } = parseFrontmatter('---\nname: a-b\ndescription: "x: y"\nmetadata:\n  title: "T: t"\n  tags: [one, "two"]\n---\n# Body\n', 't');
  assert.equal(data.description, 'x: y');
  assert.deepEqual(data.metadata.tags, ['one', 'two']);
  assert.equal(data.metadata.title, 'T: t');
  assert.equal(body, '# Body');
});

test('pack filter in search narrows to one collection', async () => {
  const { prepare, search } = await import('../public/js/lib/search.js');
  const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'public', 'data', 'catalog.json'), 'utf8'));
  const idx = prepare(catalog);
  const micro = search(idx, '', { pack: 'microstructure' });
  assert.equal(micro.length, 8);
  assert.ok(micro.every(i => i.pack === 'microstructure'));
  assert.ok(search(idx, 'square-root impact').some(i => i.id === 'pack-micro-market-impact'));
});
