// The skill calculators (skills/*/scripts/*.py) are run by Claude instead of
// mental arithmetic, so their numbers must be right. Each test checks a value
// that can be derived by hand. Skipped if python3 is unavailable.
const { test } = require('node:test');
const assert = require('node:assert');
const { execFileSync } = require('child_process');
const path = require('path');

const SKILLS = path.join(__dirname, '..', 'skills');
let python = null;
try { execFileSync('python3', ['--version']); python = 'python3'; } catch {}

const run = (script, args) => execFileSync(python, ['-B', path.join(SKILLS, script), ...args], { encoding: 'utf8' });
const num = (out, re) => { const m = re.exec(out); assert.ok(m, `pattern ${re} not found in:\n${out}`); return Number(m[1].replace(/,/g, '')); };

test('market impact: 1% of ADV at 2% vol with Y=1 is 20 bps, and 4x size is 2x impact', { skip: !python }, () => {
  const out = run('micro-market-impact/scripts/impact.py', ['--size', '20000', '--adv', '2000000', '--vol', '0.02', '--y', '1', '--price', '10']);
  assert.equal(num(out, /^\s+1x\s+[\d,]+\s+([\d.]+)/m), 20.0);
  assert.equal(num(out, /^\s+4x\s+[\d,]+\s+([\d.]+)/m), 40.0);
  assert.equal(num(out, /^\s+1x\s+[\d,]+\s+[\d.]+\s+([\d,]+)/m), 400);
});

test('deflated Sharpe: one trial equals PSR; many trials deflate it', { skip: !python }, () => {
  const one = run('quant-deflated-sharpe/scripts/dsr.py', ['--sharpe', '0.1', '--n-obs', '1000']);
  // PSR = Phi(0.1 * sqrt(999) / sqrt(1 + 0.5*0.01)) = Phi(3.1529...) ≈ 0.9992
  assert.equal(num(one, /PSR vs 0\s+([\d.]+)/), 0.9992);
  assert.equal(num(one, /^DSR\s+([\d.]+)/m), 0.9992);
  const many = run('quant-deflated-sharpe/scripts/dsr.py', ['--sharpe', '0.1', '--n-obs', '1000', '--trials', '100', '--sharpe-var', '0.002']);
  assert.ok(num(many, /^DSR\s+([\d.]+)/m) < 0.5);
  assert.match(many, /verdict\s+likely noise/);
});

test('impermanent loss: x*y=k IL is -20% at 4x and -5.72% at 2x; concentrated range amplifies it', { skip: !python }, () => {
  const out = run('quant-lp-impermanent-loss/scripts/il.py', ['--p0', '2000', '--lower', '1600', '--upper', '2500']);
  assert.equal(num(out, /^\s+4\.0\s+(-?[\d.]+)%/m), -20.0);
  assert.equal(num(out, /^\s+2\.0\s+(-?[\d.]+)%/m), -5.72);
  // At 0.9x (1800, in range) a v3 position loses more than the 0.14% of x*y=k.
  assert.ok(num(out, /^\s+1800\.00\s+[\d.]+\s+[\d.]+\s+(-?[\d.]+)%/m) < -1);
});

test('variance swap: a flat 20% vol surface prices the strike at ~20 vol points', { skip: !python }, () => {
  const out = run('vol-variance-swap/scripts/varswap.py', ['--demo-flat-vol', '0.2']);
  const k = num(out, /fair strike ([\d.]+) vol points/);
  assert.ok(Math.abs(k - 20) < 0.3, `got ${k}`);
});

test('position sizer: 1% risk on a 5% stop sizes 20% of equity; no edge means SKIP', { skip: !python }, () => {
  const out = run('desk-position-sizer/scripts/size.py', ['--equity', '1000', '--entry', '1', '--stop', '0.95']);
  assert.match(out, /DECISION: SIZE\s+200\.00 \(20\.0% of equity\)/);
  const skip = run('desk-position-sizer/scripts/size.py', ['--equity', '1000', '--entry', '1', '--stop', '0.95', '--win-rate', '0.3', '--payoff', '1.5', '--n-trades', '80']);
  assert.match(skip, /DECISION: SKIP\s+reason: Kelly fraction/);
  const liq = run('desk-position-sizer/scripts/size.py', ['--equity', '1000', '--entry', '1', '--stop', '0.95', '--liquidity', '5000', '--max-liq-share', '2']);
  assert.match(liq, /binding: liquidity/);
});
