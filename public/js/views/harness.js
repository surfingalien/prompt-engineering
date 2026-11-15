import { html, render, raw, on, debounce, $, uid, timeAgo } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { state, update, getPrompt, createPrompt } from '../core/store.js';
import { navigate } from '../core/nav.js';
import { getConfig } from '../core/api.js';
import { toast, openDrawer, download, confirmDialog, copyText, shareLink } from '../core/ui.js';
import { shareHarness } from '../lib/share.js';
import { loadCatalog, find, all as catalogItems } from '../core/catalog.js';
import { validateServer, envOf } from '../lib/mcp.js';
import { harnessFiles, readiness, systemPrompt, GUARDRAILS, slugify } from '../lib/harness.js';
import { makeZip } from '../lib/zip.js';
import { EMPTY_HARNESS, HARNESS_TEMPLATES } from '../data/harness-templates.js';
import { ring, codeBlock, pageHead, logoMark } from './shared.js';

// A catalog MCP server (mcp/servers.json) as an editable harness entry.
export function mcpEntry(m) {
  return {
    name: m.id, ref: m.id, logo: m.logo || '', light: Boolean(m.light), transport: m.transport, access: m.access, purpose: m.useWhen,
    url: m.url || '', headers: Object.entries(m.headers || {}).map(([k, v]) => `${k}: ${v}`).join('\n'),
    command: m.command || '', args: (m.args || []).join('\n'), env: Object.entries(m.env || {}).map(([k, d]) => `${k}  ${d}`).join('\n'),
  };
}

const getH = id => state.harnesses.find(h => h.id === id);
function saveH(h) { h.updatedAt = Date.now(); update('harnesses', list => list.map(x => (x.id === h.id ? h : x))); }
function newH(data) {
  const h = { ...EMPTY_HARNESS(), ...structuredClone(data || {}), id: uid('h'), updatedAt: Date.now() };
  update('harnesses', list => [h, ...list]);
  return h;
}

function setPath(obj, path, value) {
  const keys = path.split('.');
  let o = obj;
  for (let i = 0; i < keys.length - 1; i++) { const k = keys[i]; if (o[k] === undefined) o[k] = /^\d+$/.test(keys[i + 1]) ? [] : {}; o = o[k]; }
  o[keys.at(-1)] = value;
}
function getPath(obj, path) { return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj); }

const LAYERS = [
  ['mission', 'harness', 'Mission & identity', 'Who the agent is, what it’s for, and how it works'],
  ['guardrails', 'shield', 'Guardrails', 'Trust boundaries and safety behaviors'],
  ['memory', 'brain', 'Project memory', 'CLAUDE.md: facts the agent needs every session'],
  ['tools', 'tool', 'Tools', 'Actions the agent can take'],
  ['mcp', 'plug', 'MCP servers', 'External tools and data via the Model Context Protocol'],
  ['skills', 'layers', 'Skills', 'Expertise loaded on demand'],
  ['subagents', 'council', 'Subagents', 'Specialists with their own context'],
  ['evals', 'evals', 'Evals', 'Cases that prove it works'],
];

function listView(root) {
  render(root, html`
    ${pageHead({ eyebrow: 'Harness studio', title: 'Design the harness around your agent', desc: 'A harness is everything around the model that makes an agent dependable: mission, memory, tools, skills, subagents, guardrails and evals. Design each layer here and export ready-to-use files for Claude Code and the Claude API.' })}
    <div class="harness-diagram card sunken">
      ${LAYERS.map(([, ic, t, d]) => html`<div class="hd-layer">${raw(icon(ic))}<div><b>${t}</b><span>${d}</span></div></div>`)}
    </div>
    ${state.harnesses.length ? html`<section class="section"><h2 class="section-title">Your harnesses</h2>
      <div class="grid grid-3">${state.harnesses.map(h => {
        const r = readiness(h);
        return html`<a class="card row" style="gap:14px" href="#/harness/${h.id}">${ring(r.score, 'sm')}<div style="min-width:0"><div class="card-title">${h.name}</div><div class="subtle">${(h.tools || []).length} tools · ${(h.subagents || []).length} subagents · ${(h.evals || []).length} evals · ${timeAgo(h.updatedAt)}</div></div></a>`;
      })}</div></section>` : ''}
    <section class="section">
      <h2 class="section-title">Start from a template</h2>
      <div class="grid grid-4">
        <button class="card" data-new="blank"><div class="feature-ic">${raw(icon('plus'))}</div><div class="card-title">Blank harness</div><p class="subtle" style="margin-top:4px">Start with sensible guardrails and nothing else.</p></button>
        ${HARNESS_TEMPLATES.map(t => html`<button class="card" data-new="${t.id}"><div class="feature-ic">${raw(icon('harness'))}</div><div class="card-title">${t.title}</div><p class="subtle" style="margin-top:4px">${t.desc}</p></button>`)}
      </div>
    </section>`);
  return on(root, 'click', '[data-new]', async (e, b) => {
    const t = HARNESS_TEMPLATES.find(x => x.id === b.dataset.new);
    const data = t ? structuredClone(t.data) : {};
    const refs = [...(data.skills || []), ...(data.subagents || [])].filter(x => x.ref);
    if (refs.length) {
      try {
        await loadCatalog();
        for (const x of refs) {
          const it = find(`pack-${x.ref}`);
          if (!it) continue;
          if ('body' in x) x.body = it.body; else x.prompt = it.body;
        }
      } catch { /* offline: keep the short template text */ }
    }
    navigate(`harness/${newH(data).id}`);
  });
}

function editorView(root, h, cfg, mcpCatalog = []) {
  let section = 'mission';

  const tx = (path, { rows = 3, ph = '', mono = false } = {}) => html`<textarea class="textarea ${mono ? 'mono' : ''}" rows="${rows}" data-path="${path}" placeholder="${ph}">${getPath(h, path) || ''}</textarea>`;
  const inp = (path, ph = '') => html`<input class="input" data-path="${path}" value="${getPath(h, path) || ''}" placeholder="${ph}">`;
  const rm = path => html`<button class="btn btn-sm btn-ghost btn-danger" data-remove="${path}" aria-label="Remove">${raw(icon('trash'))}</button>`;

  const SECTIONS = {
    mission: () => html`
      <div class="grid id-grid" style="gap:12px">
        <label class="field"><span class="label">Name</span>${inp('name', 'e.g. Code Review Agent')}</label>
        <label class="field"><span class="label">Model</span><select class="select" data-path="model">${(cfg.allModels || cfg.models).filter(m => m.provider !== 'gateway').map(m => html`<option value="${m.id}" ${h.model === m.id ? raw('selected') : ''}>${m.label}</option>`)}</select></label>
        <label class="field"><span class="label">Effort</span><select class="select" data-path="effort">${cfg.efforts.map(e => html`<option ${h.effort === e ? raw('selected') : ''}>${e}</option>`)}</select></label>
      </div>
      <label class="field" style="margin-top:16px"><span class="label">Mission <span class="opt">the core of the system prompt</span></span>${tx('mission', { rows: 9, ph: 'You are the … agent for … Your job is … Work by … ' })}
        <span class="help">State the role, the environment, the goal and the working method. Specific beats generic: name the repo, the users, the stakes.</span></label>
      <label class="field"><span class="label">Definition of done <span class="opt">one per line</span></span>${tx('finish', { rows: 3, ph: 'Tests pass\nSummary of what changed and why' })}
        <span class="help">Checkable conditions the agent verifies before it reports success.</span></label>
      <div class="btn-row" style="margin-top:12px"><button class="btn btn-sm" data-act="test-mission">${raw(icon('workbench'))}Test the system prompt in the workbench</button></div>`,
    guardrails: () => html`
      <p class="subtle" style="margin-bottom:12px">Enabled guardrails are added to the system prompt. Pair them with real permissions: prompts guide behavior, architecture enforces it.</p>
      <div class="stack">${GUARDRAILS.map(g => html`<label class="check guard"><input type="checkbox" data-guard="${g.id}" ${h.guardrails?.[g.id] ? raw('checked') : ''}><span><b>${g.label}</b><br><span class="subtle">${g.text}</span></span></label>`)}</div>`,
    memory: () => html`
      <p class="subtle" style="margin-bottom:12px">Becomes <code>CLAUDE.md</code>, read at the start of every Claude Code session. Keep it short and factual.</p>
      <label class="field"><span class="label">Overview</span>${tx('project.overview', { rows: 2, ph: 'What this project is, the stack, where key things live.' })}</label>
      <label class="field"><span class="label">Commands</span>${tx('project.commands', { rows: 3, mono: true, ph: 'npm test\nnpm run lint' })}</label>
      <label class="field"><span class="label">Conventions <span class="opt">one per line</span></span>${tx('project.conventions', { rows: 3, ph: 'Money is integer cents\nTests live next to code' })}</label>
      <label class="field"><span class="label">Boundaries <span class="opt">one per line</span></span>${tx('project.boundaries', { rows: 3, ph: 'Never edit migrations by hand' })}</label>`,
    tools: () => html`
      <p class="subtle" style="margin-bottom:12px">Exported as strict Messages API tool definitions. The description is the most important field: say what it does, when to use it, and what it returns.</p>
      <div class="stack">${(h.tools || []).map((t, i) => html`<div class="card flat item-card">
        <div class="row" style="gap:8px">${inp(`tools.${i}.name`, 'tool_name')}${rm(`tools.${i}`)}</div>
        <label class="field" style="margin-top:10px"><span class="label">Description</span>${tx(`tools.${i}.description`, { rows: 3, ph: 'What it does, when to use it (and when not), what it returns.' })}</label>
        <div class="label" style="margin-top:10px">Parameters</div>
        ${(t.params || []).map((p, j) => html`<div class="param-row">
          <input class="input input-sm" data-path="tools.${i}.params.${j}.name" value="${p.name || ''}" placeholder="name" aria-label="Parameter name">
          <select class="select select-sm" data-path="tools.${i}.params.${j}.type" aria-label="Type">${['string', 'integer', 'number', 'boolean'].map(ty => html`<option ${p.type === ty ? raw('selected') : ''}>${ty}</option>`)}</select>
          <input class="input input-sm" data-path="tools.${i}.params.${j}.description" value="${p.description || ''}" placeholder="description" aria-label="Parameter description">
          ${rm(`tools.${i}.params.${j}`)}</div>`)}
        <button class="btn btn-sm btn-ghost" data-add="tools.${i}.params">${raw(icon('plus'))}Parameter</button>
      </div>`)}</div>
      <button class="btn btn-sm" style="margin-top:12px" data-add="tools">${raw(icon('plus'))}Add tool</button>`,
    mcp: () => html`
      <p class="subtle" style="margin-bottom:12px">Exported as <code>.mcp.json</code> for Claude Code. MCP servers give the agent ready-made tools (GitHub, a browser, docs, issue trackers) instead of ones you write yourself. Start read-only, and keep secrets as <code>\${ENV_VAR}</code> references.</p>
      ${mcpCatalog.length ? html`<div class="row wrap" style="gap:8px;margin-bottom:14px">
        <select class="select select-sm" style="width:auto" data-mcp-pick aria-label="MCP server from the library">
          ${mcpCatalog.map(it => html`<option value="${it.id}">${it.title}: ${it.mcp.access === 'read' ? 'read-only' : 'read-write'}</option>`)}
        </select>
        <button class="btn btn-sm btn-primary" data-act="mcp-add">${raw(icon('plus'))}Add server</button>
        <a class="btn btn-sm btn-ghost" href="#/library?pack=mcp-servers">${raw(icon('library'))}Browse MCP servers</a>
      </div>` : ''}
      <div class="stack">${(h.mcp || []).map((m, i) => {
        const errs = validateServer(m);
        const env = Object.keys(envOf(m));
        return html`<div class="card flat item-card">
          <div class="row" style="gap:8px">${logoMark({ logo: m.logo, light: m.light, label: m.name || 'MCP server' }, { size: 22, decorative: true })}${inp(`mcp.${i}.name`, 'server-name')}${rm(`mcp.${i}`)}</div>
          <div class="grid grid-2" style="gap:10px;margin-top:10px">
            <label class="field"><span class="label">Transport</span><select class="select" data-path="mcp.${i}.transport">${[['http', 'Remote (HTTP)'], ['stdio', 'Local (stdio)']].map(([v, l]) => html`<option value="${v}" ${m.transport === v ? raw('selected') : ''}>${l}</option>`)}</select></label>
            <label class="field"><span class="label">Access</span><select class="select" data-path="mcp.${i}.access">${[['read', 'Read-only'], ['read-write', 'Can make changes']].map(([v, l]) => html`<option value="${v}" ${m.access === v ? raw('selected') : ''}>${l}</option>`)}</select></label>
          </div>
          ${m.transport === 'stdio' ? html`
            <label class="field"><span class="label">Command</span>${inp(`mcp.${i}.command`, 'npx')}</label>
            <label class="field"><span class="label">Arguments <span class="opt">one per line</span></span>${tx(`mcp.${i}.args`, { rows: 3, mono: true, ph: '-y\n@scope/server' })}</label>`
          : html`
            <label class="field"><span class="label">URL</span>${inp(`mcp.${i}.url`, 'https://example.com/mcp')}</label>
            <label class="field"><span class="label">Headers <span class="opt">one per line, Name: value</span></span>${tx(`mcp.${i}.headers`, { rows: 2, mono: true, ph: 'Authorization: Bearer \${API_TOKEN}' })}</label>`}
          <label class="field"><span class="label">Environment variables <span class="opt">one per line: NAME and what it is</span></span>${tx(`mcp.${i}.env`, { rows: 2, mono: true, ph: 'API_TOKEN  read-only token for the project' })}</label>
          <label class="field"><span class="label">Use when…</span>${inp(`mcp.${i}.purpose`, 'Why the agent has this server; goes into CLAUDE.md')}</label>
          ${env.length ? html`<p class="subtle">Each person sets ${env.map(e => html`<code>${e}</code> `)}in their environment; the file only holds references.</p>` : ''}
          ${errs.length ? html`<div class="callout warn" style="margin-top:8px">${raw(icon('alert'))}<div>${errs.map(e => html`<div>${e}</div>`)}</div></div>` : ''}
        </div>`;
      })}</div>
      <button class="btn btn-sm" style="margin-top:12px" data-add="mcp">${raw(icon('plus'))}Add custom server</button>`,
    skills: () => html`
      <p class="subtle" style="margin-bottom:12px">Each becomes <code>.claude/skills/&lt;name&gt;/SKILL.md</code>. The description is always visible to Claude; the body loads only when relevant, so write the description as “use when…”.</p>
      <div class="stack">${(h.skills || []).map((s, i) => html`<div class="card flat item-card">
        <div class="row" style="gap:8px">${inp(`skills.${i}.name`, 'Skill name')}${rm(`skills.${i}`)}</div>
        <label class="field" style="margin-top:10px"><span class="label">Use when…</span>${inp(`skills.${i}.description`, 'Use when the task involves …')}</label>
        <label class="field"><span class="label">Instructions</span>${tx(`skills.${i}.body`, { rows: 5, mono: true })}</label>
      </div>`)}</div>
      <div class="btn-row" style="margin-top:12px"><button class="btn btn-sm" data-add="skills">${raw(icon('plus'))}Add skill</button><a class="btn btn-sm btn-ghost" href="#/library?kind=skill">${raw(icon('library'))}Browse skills in the library</a></div>`,
    subagents: () => html`
      <p class="subtle" style="margin-bottom:12px">Each becomes <code>.claude/agents/&lt;name&gt;.md</code>. Give each one job, a description of when to delegate, and only the tools it needs.</p>
      <div class="stack">${(h.subagents || []).map((s, i) => html`<div class="card flat item-card">
        <div class="row" style="gap:8px">${inp(`subagents.${i}.name`, 'Subagent name')}${rm(`subagents.${i}`)}</div>
        <label class="field" style="margin-top:10px"><span class="label">Use when…</span>${inp(`subagents.${i}.description`, 'Use after code changes to run tests and report failures')}</label>
        <div class="grid grid-2" style="gap:10px">
          <label class="field"><span class="label">Tools <span class="opt">comma-separated</span></span>${inp(`subagents.${i}.tools`, 'Read, Grep, Bash')}</label>
          <label class="field"><span class="label">Model</span><select class="select" data-path="subagents.${i}.model">${['inherit', 'opus', 'sonnet', 'haiku'].map(m => html`<option ${s.model === m ? raw('selected') : ''}>${m}</option>`)}</select></label>
        </div>
        <label class="field"><span class="label">System prompt</span>${tx(`subagents.${i}.prompt`, { rows: 5 })}</label>
      </div>`)}</div>
      <button class="btn btn-sm" style="margin-top:12px" data-add="subagents">${raw(icon('plus'))}Add subagent</button>`,
    evals: () => html`
      <p class="subtle" style="margin-bottom:12px">Exported to <code>harness/evals.yaml</code> for promptfoo, graded against your expectation. Include typical, edge and adversarial cases.</p>
      <div class="stack">${(h.evals || []).map((e, i) => html`<div class="card flat item-card">
        <div class="row" style="gap:8px;align-items:flex-start"><div style="flex:1" class="stack">
          <label class="field"><span class="label">Task / input</span>${tx(`evals.${i}.input`, { rows: 2 })}</label>
          <label class="field"><span class="label">Expected behavior</span>${inp(`evals.${i}.expect`, 'What a correct response does')}</label>
        </div>${rm(`evals.${i}`)}</div>
      </div>`)}</div>
      <button class="btn btn-sm" style="margin-top:12px" data-add="evals">${raw(icon('plus'))}Add case</button>`,
  };

  const NEW_ITEM = { mcp: () => ({ name: '', transport: 'http', access: 'read', url: '', headers: '', command: '', args: '', env: '', purpose: '' }), tools: () => ({ name: '', description: '', params: [] }), skills: () => ({ name: '', description: '', body: '' }), subagents: () => ({ name: '', description: '', tools: '', model: 'inherit', prompt: '' }), evals: () => ({ input: '', expect: '' }), params: () => ({ name: '', type: 'string', description: '' }) };

  function drawSide() {
    const r = readiness(h);
    const files = harnessFiles(h);
    render($('#h-side', root), html`
      <div class="card">
        <div class="row" style="gap:14px">${ring(r.score)}<div><div style="font:500 1.05rem var(--font-serif)">Readiness</div><div class="subtle">${r.checks.filter(c => c.ok).length} of ${r.checks.length} checks</div></div></div>
        <ul class="ready-list">${r.checks.map(c => html`<li class="${c.ok ? 'ok' : ''}">${raw(icon(c.ok ? 'checkCircle' : 'circle'))}${c.label}</li>`)}</ul>
      </div>
      <div class="card" style="margin-top:14px">
        <div class="card-head"><div class="card-title">${raw(icon('folder'))}Files</div><span class="subtle">${files.length}</span></div>
        <div class="file-tree">${files.map((f, i) => html`<button class="file-row" data-file="${i}">${raw(icon('file'))}<span>${f.path}</span></button>`)}</div>
        <div class="btn-row" style="margin-top:14px">
          <button class="btn btn-primary" data-act="zip">${raw(icon('download'))}Download .zip</button>
          <button class="btn" data-act="copy-system">${raw(icon('copy'))}System prompt</button>
        </div>
      </div>`);
  }

  function draw() {
    render(root, html`
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#/harness">Harness studio</a><span>/</span><span>${h.name}</span></nav>
      <div class="row between wrap" style="gap:12px;margin-bottom:20px">
        <h1 class="page-title">${h.name}</h1>
        <div class="btn-row"><button class="btn btn-sm" data-act="share">${raw(icon('external'))}Share link</button><button class="btn btn-sm" data-act="duplicate">Duplicate</button><button class="btn btn-sm btn-ghost btn-danger" data-act="delete">${raw(icon('trash'))}Delete</button></div>
      </div>
      <div class="h-layout">
        <nav class="h-nav" aria-label="Harness layers">${LAYERS.map(([id, ic, t]) => {
          const n = { mcp: h.mcp?.length, tools: h.tools?.length, skills: h.skills?.length, subagents: h.subagents?.length, evals: h.evals?.length, guardrails: Object.values(h.guardrails || {}).filter(Boolean).length }[id];
          return html`<button class="h-nav-item" data-section="${id}" aria-current="${String(section === id)}">${raw(icon(ic))}<span>${t}</span>${n ? html`<span class="count">${n}</span>` : ''}</button>`;
        })}</nav>
        <section class="card h-main"><h2 class="section-title">${LAYERS.find(l => l[0] === section)[2]}</h2>${SECTIONS[section]()}</section>
        <aside class="sticky-col" id="h-side"></aside>
      </div>`);
    drawSide();
  }

  const persist = debounce(() => { saveH(h); drawSide(); }, 300);
  draw();

  const offs = [
    on(root, 'input', '[data-path]', (e, el) => { setPath(h, el.dataset.path, el.value); if (el.dataset.path === 'name') root.querySelector('.page-title').textContent = el.value || 'Untitled'; persist(); }),
    on(root, 'change', 'select[data-path]', (e, el) => { setPath(h, el.dataset.path, el.value); if (/^mcp\.\d+\.transport$/.test(el.dataset.path)) { saveH(h); draw(); } else persist(); }),
    on(root, 'change', '[data-guard]', (e, el) => { h.guardrails = { ...(h.guardrails || {}), [el.dataset.guard]: el.checked }; persist(); }),
    on(root, 'click', '[data-section]', (e, b) => { section = b.dataset.section; draw(); }),
    on(root, 'click', '[data-add]', (e, b) => {
      const path = b.dataset.add;
      const kind = path.split('.').at(-1);
      const arr = getPath(h, path) || [];
      arr.push(NEW_ITEM[kind]());
      setPath(h, path, arr);
      saveH(h); draw();
      const inputs = root.querySelectorAll('.h-main [data-path]');
      inputs[inputs.length - 1]?.closest('.item-card, .param-row')?.querySelector('input, textarea')?.focus();
    }),
    on(root, 'click', '[data-remove]', (e, b) => {
      const keys = b.dataset.remove.split('.');
      const idx = Number(keys.pop());
      getPath(h, keys.join('.')).splice(idx, 1);
      saveH(h); draw();
    }),
    on(root, 'click', '[data-file]', (e, b) => {
      const f = harnessFiles(h)[Number(b.dataset.file)];
      openDrawer({ title: f.path, subtitle: html`<span class="badge">${f.lang}</span>`, body: codeBlock(f.content, { highlight: f.lang === 'markdown', label: f.path }),
        actions: [{ label: 'Copy', icon: 'copy', primary: true, onClick: () => copyText(f.content) }, { label: 'Download', icon: 'download', onClick: () => download(f.path.split('/').pop(), f.content) }] });
    }),
    on(root, 'click', '[data-act]', async (e, b) => {
      const act = b.dataset.act;
      if (act === 'mcp-add') {
        const it = mcpCatalog.find(x => x.id === $('[data-mcp-pick]', root)?.value);
        if (!it) return;
        h.mcp = [...(h.mcp || []), mcpEntry(it.mcp)];
        saveH(h); draw();
        toast(`Added ${it.title}`);
      } else if (act === 'zip') {
        const files = harnessFiles(h);
        const folder = slugify(h.name);
        files.push({ path: 'README.md', content: `# ${h.name} — harness\n\nGenerated by PromptForge.\n\n- \`CLAUDE.md\` and \`.claude/\` go in your repository root for Claude Code.\n- \`harness/agent.ts\` is a minimal agent loop on the Anthropic TypeScript SDK: \`npm i @anthropic-ai/sdk && npx tsx harness/agent.ts "your task"\`.\n- \`harness/evals.yaml\` runs with \`npx promptfoo eval -c harness/evals.yaml\`.\n${(h.mcp || []).length ? '- \`.mcp.json\` lists MCP servers for Claude Code. Each person sets the environment variables it references; Claude Code asks them to approve the servers on first use.\n' : ''}` });
        download(`${folder}-harness.zip`, new Blob([makeZip(files.map(f => ({ ...f, path: `${folder}/${f.path}` })))], { type: 'application/zip' }));
        toast('Harness downloaded');
      } else if (act === 'copy-system') copyText(systemPrompt(h), 'System prompt copied');
      else if (act === 'share') shareLink(shareHarness(h), 'Share link').catch(err => toast(err.message, 'error'));
      else if (act === 'test-mission') {
        const p = createPrompt({ title: `${h.name} — system prompt`, system: systemPrompt(h), user: h.evals?.[0]?.input || 'Hi! Briefly, what can you help me with?', source: `harness:${h.id}` });
        navigate(`workbench/${p.id}`);
      } else if (act === 'duplicate') {
        const { id, ...rest } = h;
        navigate(`harness/${newH({ ...rest, name: `${h.name} (copy)` }).id}`);
      } else if (act === 'delete') {
        if (await confirmDialog(`Delete “${h.name}”?`, 'This removes the harness from this browser.', 'Delete', true)) {
          update('harnesses', list => list.filter(x => x.id !== h.id)); navigate('harness');
        }
      }
    }),
  ];
  return () => { persist(); offs.forEach(o => o()); };
}

export default {
  title: 'Harness studio',
  async mount(root, { params, query }) {
    const cfg = await getConfig();
    let mcpCatalog = [];
    try { await loadCatalog(); mcpCatalog = catalogItems().filter(it => it.kind === 'mcp' && it.mcp); } catch { /* offline: custom servers only */ }
    // Entry points from other views
    if (query.fromPrompt) {
      const p = getPrompt(query.fromPrompt);
      const h = newH({ name: p?.title || 'New agent', mission: p ? (p.system || p.user) : '' });
      history.replaceState(null, '', `#/harness/${h.id}`);
      return editorView(root, h, cfg, mcpCatalog);
    }
    if (query.addMcp) {
      const it = mcpCatalog.find(x => x.id === query.addMcp);
      if (it) {
        const h = state.harnesses[0] ? getH(state.harnesses[0].id) : newH({});
        h.mcp = [...(h.mcp || []), mcpEntry(it.mcp)];
        saveH(h);
        toast(`Added ${it.title} to ${h.name}`);
        history.replaceState(null, '', `#/harness/${h.id}`);
        return editorView(root, h, cfg, mcpCatalog);
      }
    }
    if (query.addSkill || query.addMission) {
      await loadCatalog();
      const it = find(query.addSkill || query.addMission);
      if (it) {
        let h;
        if (query.addMission) h = newH({ name: it.title, mission: it.body });
        else {
          h = state.harnesses[0] ? getH(state.harnesses[0].id) : newH({});
          h.skills = [...(h.skills || []), { name: it.title, description: it.summary ? `Use when: ${it.summary}` : '', body: it.body }];
          saveH(h);
          toast(`Added “${it.title}” to ${h.name}`);
        }
        history.replaceState(null, '', `#/harness/${h.id}`);
        return editorView(root, h, cfg, mcpCatalog);
      }
    }
    const h = params[0] && getH(params[0]);
    if (params[0] && !h) { navigate('harness'); return null; }
    return h ? editorView(root, h, cfg, mcpCatalog) : listView(root);
  },
};
