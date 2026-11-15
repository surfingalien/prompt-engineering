// MCP servers: the curated catalog, config generation, secret checks, and the
// Harness studio export.
const { test, before } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const { servers } = JSON.parse(fs.readFileSync(path.join(ROOT, 'mcp', 'servers.json'), 'utf8'));
let M, H, S, T;
before(async () => {
  M = await import('../public/js/lib/mcp.js');
  H = await import('../public/js/lib/harness.js');
  S = await import('../public/js/lib/share.js');
  T = await import('../public/js/data/harness-templates.js');
});

test('every curated server is valid, unique, documented and free of literal secrets', () => {
  const ids = new Set();
  for (const s of servers) {
    assert.deepEqual(M.validateServer(s), [], s.id);
    assert.ok(!ids.has(s.id), `duplicate ${s.id}`);
    ids.add(s.id);
    assert.ok(s.security.length >= 1 && s.examples.length >= 1, `${s.id}: needs examples and security notes`);
    assert.match(s.docs, /^https:\/\//);
    // Every ${VAR} a server references must be documented in `env`.
    for (const [name, desc] of Object.entries(M.envOf(s))) assert.ok(desc, `${s.id}: document ${name} in env`);
  }
  assert.ok(servers.length >= 12);
});

test('catalog.json carries the servers as kind "mcp" in the mcp-servers collection', () => {
  const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'public', 'data', 'catalog.json'), 'utf8'));
  const items = catalog.filter(it => it.kind === 'mcp');
  assert.equal(items.length, servers.length);
  for (const it of items) {
    assert.equal(it.pack, 'mcp-servers');
    assert.ok(it.mcp && it.mcp.transport && it.body.includes('Security notes'));
  }
});

test('serverConfig: http and stdio shapes match Claude Code .mcp.json', () => {
  const gh = servers.find(s => s.id === 'github');
  assert.deepEqual(M.serverConfig(gh), { type: 'http', url: 'https://api.githubcopilot.com/mcp/', headers: gh.headers });
  const brave = servers.find(s => s.id === 'brave-search');
  assert.deepEqual(M.serverConfig(brave), { command: 'npx', args: ['-y', '@brave/brave-search-mcp-server', '--transport', 'stdio'], env: { BRAVE_API_KEY: '${BRAVE_API_KEY}' } });
  // Editor text form gives the same result as the catalog form.
  const edited = { name: 'Brave', transport: 'stdio', command: 'npx', args: '-y\n@brave/brave-search-mcp-server\n--transport\nstdio', env: 'BRAVE_API_KEY  key' };
  assert.deepEqual(M.serverConfig(edited), M.serverConfig(brave));
  assert.deepEqual(M.headersOf({ headers: 'Authorization: Bearer ${T}\nX-A: b:c' }), { Authorization: 'Bearer ${T}', 'X-A': 'b:c' });
});

test('mcpJson dedupes names; claudeAddCommand uses local scope and lets the shell fill secrets', () => {
  const json = JSON.parse(M.mcpJson([{ name: 'GitHub', transport: 'http', url: 'https://a.example/mcp' }, { name: 'github', transport: 'http', url: 'https://b.example/mcp' }, { name: '  ' }]));
  assert.deepEqual(Object.keys(json.mcpServers), ['github', 'github-2']);
  const gh = M.claudeAddCommand(servers.find(s => s.id === 'github'));
  assert.match(gh, /^claude mcp add --transport http --scope local /);
  assert.match(gh, /--header "Authorization: Bearer \$\{GITHUB_PAT\}"/);
  const brave = M.claudeAddCommand(servers.find(s => s.id === 'brave-search'));
  assert.equal(brave, 'claude mcp add --scope local --env "BRAVE_API_KEY=${BRAVE_API_KEY}" brave-search -- npx -y @brave/brave-search-mcp-server --transport stdio');
  assert.match(M.claudeAddCommand({ name: 'x', transport: 'stdio', command: 'npx', args: ["it's"] }), /'it'\\''s'$/);
});

test('literal secrets are caught; ${ENV} references are fine', () => {
  const s = (headers, extra = {}) => ({ name: 'x', transport: 'http', url: 'https://x.example/mcp', headers, ...extra });
  assert.deepEqual(M.literalSecrets(s('Authorization: Bearer ${TOKEN}')), []);
  assert.ok(M.literalSecrets(s('Authorization: Bearer ghp_abcdefghijklmnopqrstuvwxyz0123')).includes('GitHub token'));
  assert.ok(M.literalSecrets(s('', { url: 'https://x.example/mcp?key=sk_live_abcdefghijklmnop' })).includes('Stripe key'));
  assert.ok(M.validateServer(s('Authorization: Bearer abcdefghijklmnopqrstuvwxyz0123456789')).some(e => /literal bearer token/.test(e)));
  assert.ok(M.validateServer({ name: 'x', transport: 'http', url: 'http://evil.example/mcp' }).some(e => /https/.test(e)));
  assert.deepEqual(M.validateServer({ name: 'x', transport: 'http', url: 'http://localhost:3845/mcp' }), []);
});

test('harness export: .mcp.json, CLAUDE.md section and readiness checks', () => {
  const template = T.HARNESS_TEMPLATES.find(t => t.id === 'code-reviewer').data;
  const files = H.harnessFiles(template);
  const mcpFile = files.find(f => f.path === '.mcp.json');
  assert.ok(mcpFile, 'code-review template exports .mcp.json');
  const cfg = JSON.parse(mcpFile.content).mcpServers.github;
  assert.equal(cfg.headers['X-MCP-Readonly'], 'true');
  assert.equal(cfg.headers.Authorization, 'Bearer ${GITHUB_PAT}');
  const claude = files.find(f => f.path === 'CLAUDE.md').content;
  assert.match(claude, /## MCP servers[\s\S]*\*\*github\*\* \(read-only\)[\s\S]*`GITHUB_PAT`/);

  const r = H.readiness(template);
  assert.ok(r.checks.find(c => c.id === 'mcp-secrets').ok);
  assert.ok(r.checks.find(c => c.id === 'mcp-confirm').ok);
  const risky = { ...template, guardrails: { injection: true }, mcp: [{ name: 'gh', transport: 'http', access: 'read-write', url: 'https://x.example/mcp', headers: 'Authorization: Bearer ghp_abcdefghijklmnopqrstuvwxyz0123' }] };
  const rr = H.readiness(risky);
  assert.equal(rr.checks.find(c => c.id === 'mcp-secrets').ok, false);
  assert.equal(rr.checks.find(c => c.id === 'mcp-confirm').ok, false);
  // Harnesses without MCP servers keep their original checklist.
  assert.ok(!H.readiness({}).checks.some(c => c.id.startsWith('mcp')));
  assert.ok(!H.harnessFiles({}).some(f => f.path === '.mcp.json'));
});

test('share links keep MCP servers, with types and logo names sanitized', () => {
  const out = S.sanitize({ k: 'harness', h: { name: 'A', mcp: [{ name: 'gh', transport: 'weird', access: 'admin', logo: '../../evil', url: 'https://x.example/mcp', headers: 'Authorization: Bearer ${T}' }] } });
  const m = out.harness.mcp[0];
  assert.equal(m.transport, 'http');
  assert.equal(m.access, 'read-write');
  assert.equal(m.logo, '');
  assert.equal(m.headers, 'Authorization: Bearer ${T}');
});
