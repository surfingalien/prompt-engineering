// Line diff (LCS). Small inputs only — prompts, not repositories.
/** @returns {{op:'same'|'add'|'del', text:string}[]} */
export function lineDiff(a, b) {
  const A = String(a ?? '').split('\n');
  const B = String(b ?? '').split('\n');
  const n = A.length, m = B.length;
  if (n * m > 4_000_000) return [...A.map(text => ({ op: 'del', text })), ...B.map(text => ({ op: 'add', text }))];
  const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) {
    dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  }
  const out = []; let i = 0, j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) { out.push({ op: 'same', text: A[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) out.push({ op: 'del', text: A[i++] });
    else out.push({ op: 'add', text: B[j++] });
  }
  while (i < n) out.push({ op: 'del', text: A[i++] });
  while (j < m) out.push({ op: 'add', text: B[j++] });
  return out;
}

export function diffStats(ops) {
  return { added: ops.filter(o => o.op === 'add').length, removed: ops.filter(o => o.op === 'del').length };
}
