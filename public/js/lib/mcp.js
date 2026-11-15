// ─── MCP server configuration ────────────────────────────────────────────────
// Turns a server description (from mcp/servers.json, or one a user edits in
// the Harness studio) into the files and commands that install it:
//
//   .mcp.json            project-scoped servers for Claude Code (checked in;
//                        secrets stay ${ENV_VAR} references, expanded at runtime)
//   claude mcp add …     the equivalent CLI command for your own machine
//
// A server is { name, transport: 'stdio'|'http', command, args, url, headers,
// env, access: 'read'|'read-write' }. `args`, `headers` and `env` may be
// arrays/objects (catalog) or one-per-line text (the harness editor):
//   args     "-y\n@pkg/server"            or ["-y", "@pkg/server"]
//   headers  "Authorization: Bearer ${T}" or { Authorization: "Bearer ${T}" }
//   env      "TOKEN  what it is for"      or { TOKEN: "what it is for" }
//
// Pure — unit tested in Node.

export const slugName = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64) || 'server';

const lines = v => String(v || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
export const argsOf = s => (Array.isArray(s.args) ? s.args.map(String) : lines(s.args));
export function headersOf(s) {
  if (s.headers && typeof s.headers === 'object' && !Array.isArray(s.headers)) return { ...s.headers };
  const out = {};
  for (const l of lines(s.headers)) {
    const i = l.indexOf(':');
    if (i > 0) out[l.slice(0, i).trim()] = l.slice(i + 1).trim();
  }
  return out;
}
/** Environment variables the server needs: declared ones plus every ${VAR} it references. */
export function envOf(s) {
  const out = {};
  if (s.env && typeof s.env === 'object' && !Array.isArray(s.env)) Object.assign(out, s.env);
  else for (const l of lines(s.env)) { const m = /^([A-Za-z_][A-Za-z0-9_]*)\s*(.*)$/.exec(l); if (m) out[m[1]] = m[2].replace(/^[-—:]\s*/, ''); }
  const refs = [s.url || '', s.command || '', ...argsOf(s), ...Object.values(headersOf(s))].join('\n');
  for (const m of refs.matchAll(/\$\{([A-Za-z_][A-Za-z0-9_]*)(?::-[^}]*)?\}/g)) if (!(m[1] in out)) out[m[1]] = '';
  return out;
}

/** The server's entry in .mcp.json. */
export function serverConfig(s) {
  if (s.transport === 'http') {
    const headers = headersOf(s);
    return { type: 'http', url: String(s.url || ''), ...(Object.keys(headers).length ? { headers } : {}) };
  }
  const env = Object.keys(s.env && typeof s.env === 'object' && !Array.isArray(s.env) ? s.env : envOf({ env: s.env }));
  return { command: String(s.command || ''), args: argsOf(s), ...(env.length ? { env: Object.fromEntries(env.map(k => [k, `\${${k}}`])) } : {}) };
}

/** A complete .mcp.json for a list of servers (unique, slugged names). */
export function mcpJson(servers) {
  const mcpServers = {};
  for (const s of servers || []) {
    if (!String(s.name || '').trim()) continue;
    let name = slugName(s.name);
    for (let i = 2; name in mcpServers; i++) name = `${slugName(s.name)}-${i}`;
    mcpServers[name] = serverConfig(s);
  }
  return `${JSON.stringify({ mcpServers }, null, 2)}\n`;
}

const shq = v => (/^[\w@%+=:,./-]+$/.test(v) ? v : `'${String(v).replace(/'/g, `'\\''`)}'`);
// Values with ${VAR} are double-quoted so the shell fills them in from your environment.
const arg = v => (/\$\{/.test(v) ? `"${String(v).replace(/["\\`]/g, '\\$&')}"` : shq(v));

/**
 * The equivalent `claude mcp add` command. Local scope (the default) keeps the
 * server and its expanded secrets in your own Claude Code config, outside the
 * repository; commit the .mcp.json instead to share a server with a team.
 */
export function claudeAddCommand(s, { scope = 'local' } = {}) {
  const name = slugName(s.name);
  if (s.transport === 'http') {
    const headers = Object.entries(headersOf(s)).map(([k, v]) => ` --header ${arg(`${k}: ${v}`)}`).join('');
    return `claude mcp add --transport http --scope ${scope}${headers} ${name} ${arg(s.url || '')}`;
  }
  const env = Object.keys(envOf(s)).map(k => ` --env ${arg(`${k}=\${${k}}`)}`).join('');
  return `claude mcp add --scope ${scope}${env} ${name} -- ${[s.command, ...argsOf(s)].filter(Boolean).map(arg).join(' ')}`;
}

// Credentials pasted as literal values instead of ${ENV} references.
const SECRET_PATTERNS = [
  [/\bgh[pousr]_[A-Za-z0-9]{20,}/, 'GitHub token'],
  [/\bgithub_pat_[A-Za-z0-9_]{20,}/, 'GitHub token'],
  [/\bsk-ant-[\w-]{20,}/, 'Anthropic key'],
  [/\bsk-[A-Za-z0-9_-]{20,}/, 'API key'],
  [/\b[rs]k_(live|test)_[A-Za-z0-9]{10,}/, 'Stripe key'],
  [/\bxox[abposr]-[A-Za-z0-9-]{10,}/, 'Slack token'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key'],
  [/\blin_api_[A-Za-z0-9]{20,}/, 'Linear key'],
  [/\b(Bearer|Token)\s+(?!\$\{)[A-Za-z0-9._~+/=-]{24,}/, 'bearer token'],
];

/** Literal secrets found in a server's command, args, URL or headers. */
export function literalSecrets(s) {
  const text = [s.url || '', s.command || '', ...argsOf(s), ...Object.values(headersOf(s))].join('\n');
  return SECRET_PATTERNS.filter(([re]) => re.test(text)).map(([, label]) => label);
}

/** Problems that would make the server fail to load or leak a secret. */
export function validateServer(s) {
  const errs = [];
  if (!String(s.name || '').trim()) errs.push('name is required');
  if (!['stdio', 'http'].includes(s.transport)) errs.push('transport must be stdio or http');
  if (s.transport === 'http' && !/^https:\/\/[^\s]+$|^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(String(s.url || ''))) errs.push('url must be https:// (or http://localhost)');
  if (s.transport === 'stdio' && !String(s.command || '').trim()) errs.push('command is required');
  if (s.access && !['read', 'read-write'].includes(s.access)) errs.push('access must be read or read-write');
  for (const label of literalSecrets(s)) errs.push(`contains a literal ${label}: use a \${ENV_VAR} reference`);
  return errs;
}
