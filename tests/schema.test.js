const { test } = require('node:test');
const assert = require('node:assert');
const { check, extractJson } = require('../src/schema');

const SCHEMA = {
  type: 'object', additionalProperties: false, required: ['pass', 'score', 'tags'],
  properties: {
    pass: { type: 'boolean' }, score: { type: 'integer' }, ratio: { type: 'number' },
    level: { type: 'string', enum: ['low', 'high'] },
    tags: { type: 'array', items: { type: 'string' } },
  },
};

test('check: accepts a valid object unchanged', () => {
  const r = check(SCHEMA, { pass: true, score: 3, tags: ['a'] });
  assert.equal(r.ok, true);
  assert.deepEqual(r.value, { pass: true, score: 3, tags: ['a'] });
});

test('check: coerces near-misses and drops unknown keys', () => {
  const r = check(SCHEMA, { pass: 'True', score: '7', ratio: '0.5', tags: [1, true], junk: 'x' });
  assert.equal(r.ok, true, r.errors.join());
  assert.deepEqual(r.value, { pass: true, score: 7, ratio: 0.5, tags: ['1', 'true'] });
});

test('check: reports missing keys, bad enums and wrong types with paths', () => {
  const r = check(SCHEMA, { pass: 'maybe', level: 'mid', tags: 'a' });
  assert.equal(r.ok, false);
  assert.ok(r.errors.includes('$.score is required'));
  assert.ok(r.errors.includes('$.pass must be true or false'));
  assert.ok(r.errors.some(e => e.startsWith('$.level must be one of')));
  assert.ok(r.errors.includes('$.tags must be an array'));
});

test('check: nested arrays of objects', () => {
  const s = { type: 'object', properties: { items: { type: 'array', items: { type: 'object', required: ['n'], properties: { n: { type: 'integer' } } } } } };
  assert.equal(check(s, { items: [{ n: 1 }, { n: '2' }] }).ok, true);
  assert.deepEqual(check(s, { items: [{}] }).errors, ['$.items[0].n is required']);
});

test('extractJson: plain, fenced, wrapped in prose, and none', () => {
  assert.deepEqual(extractJson('{"a":1}'), { a: 1 });
  assert.deepEqual(extractJson('Here you go:\n```json\n{"a": 2}\n```\nDone.'), { a: 2 });
  assert.deepEqual(extractJson('Result: {"a": "has } brace", "b": [1,2]} trailing'), { a: 'has } brace', b: [1, 2] });
  assert.deepEqual(extractJson('Items: [1, 2, 3].'), [1, 2, 3]);
  assert.equal(extractJson('no json here'), undefined);
});
