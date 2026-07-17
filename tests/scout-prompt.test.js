// Structural checks on the Scout system prompt — no API key required, so
// these run on every `npm test`. Semantic behavior (does the model actually
// follow the contract) is covered separately by `npm run eval` (promptfoo),
// which does call the API.
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const PROMPT_PATH = path.join(__dirname, '..', 'prompts', 'scout-system.txt');
const prompt = fs.readFileSync(PROMPT_PATH, 'utf8');

const SKILL_CATEGORIES = ['research','code','agent','ml','writing','devops','security','testing','frontend','backend','product','design'];
const AGENT_CATEGORIES = ['research','core-development','data-ai','infrastructure','specialized-domains','orchestration','quality-assurance'];

test('prompt demands JSON-only output', () => {
  assert.match(prompt, /Output ONLY valid JSON/);
});

test('prompt specifies the skills array shape', () => {
  for (const field of ['"skills"', '"id"', '"name"', '"cat"', '"origin"', '"desc"', '"prompt"']) {
    assert.ok(prompt.includes(field), `expected skill schema to mention ${field}`);
  }
});

test('prompt specifies the agents array shape', () => {
  for (const field of ['"agents"', '"name"', '"source"', '"cat"', '"tags"', '"text"']) {
    assert.ok(prompt.includes(field), `expected agent schema to mention ${field}`);
  }
});

test('every skill category in the prompt is in governance\'s allowed set', () => {
  const line = prompt.match(/"cat": "one of: ([^"]+)"[^\n]*\n\s*"origin"/);
  assert.ok(line, 'expected to find the skill cat enum line');
  const listed = line[1].split('|');
  for (const cat of listed) assert.ok(SKILL_CATEGORIES.includes(cat), `${cat} not in governance skill categories`);
  // catches a category being added to governance but not the prompt (or vice versa)
  assert.deepStrictEqual(listed.sort(), [...SKILL_CATEGORIES].sort());
});

test('every agent category in the prompt is in governance\'s allowed set', () => {
  const line = prompt.match(/"cat": "one of: ([^"]+)"[^\n]*\n\s*"tags"/);
  assert.ok(line, 'expected to find the agent cat enum line');
  const listed = line[1].split('|');
  for (const cat of listed) assert.ok(AGENT_CATEGORIES.includes(cat), `${cat} not in governance agent categories`);
  assert.deepStrictEqual(listed.sort(), [...AGENT_CATEGORIES].sort());
});

test('prompt requires a {{variable}} placeholder in skill prompts', () => {
  assert.match(prompt, /\{\{variable\}\}/);
});
