import { html, render, raw, on, debounce, $ } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { state, createPrompt, toggleFavorite, isFavorite } from '../core/store.js';
import { navigate } from '../core/nav.js';
import { copyText, openDrawer, toast, download } from '../core/ui.js';
import { loadCatalog, query, find, counts, all as allItems, KINDS, DOMAINS, LEVELS, PACKS, packById } from '../core/catalog.js';
import { extractVars } from '../lib/template.js';
import { makeZip } from '../lib/zip.js';
import { levelBadge, codeBlock, pageHead, logoMark } from './shared.js';
import { mcpJson, claudeAddCommand, envOf } from '../lib/mcp.js';

const PAGE = 36;

function toWorkbench(it) {
  const asSystem = it.kind === 'agent' || it.kind === 'reference';
  const p = createPrompt({ title: it.title, system: asSystem ? it.body : '', user: asSystem ? 'Hi! Briefly, what can you help me with?' : it.body, source: `library:${it.id}` });
  navigate(`workbench/${p.id}`);
}

const AUTH = { none: 'No sign-in', oauth: 'OAuth sign-in', token: 'API token' };
const mcpLogo = (m, size) => logoMark({ logo: m.logo, light: m.light, label: m.name }, { size, decorative: true });

function openMcp(it, { onChange } = {}) {
  const m = it.mcp;
  const env = Object.entries(envOf(m));
  const json = mcpJson([m]);
  const cmd = claudeAddCommand(m);
  const fav = isFavorite(it.id);
  return openDrawer({
    title: it.title,
    subtitle: html`${mcpLogo(m, 20)}<span class="badge">MCP server</span><span class="badge">${m.transport === 'http' ? 'Remote (HTTP)' : 'Local (stdio)'}</span><span class="badge">${AUTH[m.auth] || m.auth}</span><span class="badge ${m.access === 'read' ? 'good' : 'warn'}">${m.access === 'read' ? 'Read-only' : 'Can make changes'}</span>`,
    body: html`
      <p class="muted" style="font-size:var(--fs-md);margin-bottom:12px">${it.summary}</p>
      <p style="margin-bottom:14px"><b>Use when:</b> ${m.useWhen}</p>
      <div class="label" style="margin-bottom:6px">What it can do</div>
      <ul class="plain-list" style="margin-bottom:16px">${m.examples.map(e => html`<li>${e}</li>`)}</ul>
      <div class="callout warn" style="margin-bottom:16px">${raw(icon('shield'))}<div><b>Security</b><ul class="plain-list">${m.security.map(e => html`<li>${e}</li>`)}</ul></div></div>
      ${env.length ? html`<div class="label" style="margin-bottom:6px">Environment variables</div><ul class="plain-list" style="margin-bottom:16px">${env.map(([k, d]) => html`<li><code>${k}</code>${d ? ` ${d}` : ''}</li>`)}</ul>` : ''}
      <div class="label" style="margin-bottom:6px">Share with your team: <code>.mcp.json</code> in the repository root</div>
      ${codeBlock(json, { label: '.mcp.json' })}
      <p class="subtle" style="margin:8px 0 16px">Claude Code reads it on start and asks each person to approve the server. Secrets stay <code>\${VAR}</code> references, filled in from each person’s environment.</p>
      <div class="label" style="margin-bottom:6px">Just for you: the Claude Code command</div>
      ${codeBlock(cmd, { label: 'claude mcp add command' })}
      <p class="subtle" style="margin-top:8px">${m.auth === 'oauth' ? 'Then run /mcp inside Claude Code to sign in. ' : ''}Source: ${it.source} · <a href="${m.docs}" target="_blank" rel="noopener noreferrer">official documentation</a></p>`,
    actions: [
      { label: 'Add to a harness', icon: 'harness', primary: true, onClick: ({ close }) => { close(); navigate(`harness?addMcp=${encodeURIComponent(it.id)}`); } },
      { label: 'Copy .mcp.json', icon: 'copy', onClick: () => copyText(json, '.mcp.json copied') },
      { label: 'Copy command', icon: 'copy', onClick: () => copyText(cmd, 'Command copied') },
      { label: fav ? 'Saved' : 'Save', icon: 'star', onClick: ({ button }) => {
        const now = toggleFavorite(it.id);
        button.lastChild.textContent = now ? 'Saved' : 'Save';
        toast(now ? 'Added to favorites' : 'Removed from favorites');
        onChange?.();
      } },
    ],
    onClose: () => { if (location.hash.startsWith('#/library/')) history.replaceState(null, '', `#/library${sessionStorage.getItem('pf.libq') || ''}`); },
  });
}

export function openItem(it, { onChange } = {}) {
  if (it.kind === 'mcp' && it.mcp) return openMcp(it, { onChange });
  const kind = KINDS.find(k => k.id === it.kind);
  const vars = extractVars(it.body);
  const fav = isFavorite(it.id);
  const d = openDrawer({
    title: it.title,
    subtitle: html`<span class="badge">${kind?.one || it.kind}</span>${levelBadge(it.level)}<span class="badge">${DOMAINS[it.domain] || it.domain}</span>${it.scout ? html`<span class="badge accent">Scout</span>` : ''}${it.pack ? html`<span class="badge accent">${packById(it.pack)?.title || it.pack}</span>` : ''}`,
    body: html`
      ${it.summary ? html`<p class="muted" style="font-size:var(--fs-md);margin-bottom:16px">${it.summary}</p>` : ''}
      ${it.kind === 'reference' ? html`<div class="callout warn" style="margin-bottom:16px">${raw(icon('info'))}<div>Community-collected system prompt, kept for study. Its authenticity and currency are <b>not verified</b>, and the original product may behave differently today.</div></div>` : ''}
      ${it.kind === 'technique' ? html`<div class="callout" style="margin-bottom:16px">${raw(icon('learn'))}<div>Techniques are taught in depth in the <a href="#/learn">learning path</a>. The snippet below is a minimal illustration.</div></div>` : ''}
      ${it.path ? html`<div class="callout accent" style="margin-bottom:16px">${raw(icon('download'))}<div><b>Installable Agent Skill.</b> Copy <code>${it.path}/</code> from the repository into your project’s <code>.claude/skills/</code> folder and Claude Code will use it automatically, or download it below.${it.files?.length ? html`<div style="margin-top:6px">Includes ${it.files.map(f => html`<code>${f}</code> `)}: a calculator Claude runs instead of doing the math by hand.</div>` : ''}</div></div>` : ''}
      ${vars.length ? html`<div class="row wrap" style="gap:6px;margin-bottom:12px"><span class="subtle">Variables:</span>${vars.map(v => html`<code>{{${v}}}</code>`)}</div>` : ''}
      ${codeBlock(it.body, { label: it.title })}
      <p class="subtle" style="margin-top:12px">Source: ${it.source || 'PromptForge'}${it.note ? ` · Note: ${it.note}` : ''}</p>`,
    actions: [
      { label: it.kind === 'agent' || it.kind === 'reference' ? 'Try as system prompt' : 'Open in workbench', icon: 'workbench', primary: true, onClick: ({ close }) => { close(); toWorkbench(it); } },
      { label: 'Copy', icon: 'copy', onClick: () => copyText(it.body) },
      { label: fav ? 'Saved' : 'Save', icon: 'star', onClick: ({ button }) => {
        const now = toggleFavorite(it.id);
        button.lastChild.textContent = now ? 'Saved' : 'Save';
        toast(now ? 'Added to favorites' : 'Removed from favorites');
        onChange?.();
      } },
      ...(it.path ? [{ label: it.files?.length ? 'Download skill (.zip)' : 'Download SKILL.md', icon: 'download', onClick: async () => {
        try {
          const name = it.path.split('/').pop();
          const paths = ['SKILL.md', ...(it.files || [])];
          const contents = await Promise.all(paths.map(async p => {
            const r = await fetch(`/${it.path}/${p}`);
            if (!r.ok) throw new Error(`${p}: HTTP ${r.status}`);
            return { path: `${name}/${p}`, content: await r.text() };
          }));
          if (contents.length === 1) download('SKILL.md', contents[0].content, 'text/markdown');
          else download(`${name}.zip`, new Blob([makeZip(contents)], { type: 'application/zip' }));
        } catch (e) { toast(`Download failed: ${e.message}`, 'error'); }
      } }] : []),
      ...(it.kind === 'skill' || it.kind === 'agent' ? [{ label: it.kind === 'skill' ? 'Add to a harness' : 'Use as harness mission', icon: 'harness', onClick: ({ close }) => { close(); navigate(`harness?add${it.kind === 'skill' ? 'Skill' : 'Mission'}=${encodeURIComponent(it.id)}`); } }] : []),
    ],
    onClose: () => { if (location.hash.startsWith('#/library/')) history.replaceState(null, '', `#/library${sessionStorage.getItem('pf.libq') || ''}`); },
  });
  return d;
}

export default {
  title: 'Library',
  async mount(root, { params, query: q }) {
    const f = { q: q.q || '', kind: q.kind || 'all', domain: q.domain || 'all', level: q.level || 'all', pack: q.pack || 'all', fav: q.fav === '1' };
    let shown = PAGE;

    render(root, html`
      ${pageHead({ eyebrow: 'Library', title: 'Templates, skills, agents and MCP servers', desc: '500+ unique, curated items from the open-source prompt-engineering community, plus installable skills and MCP servers, organized by what you’re doing and how advanced it is.' })}
      <div id="lib-packs"></div>
      <div class="lib-search">${raw(icon('search'))}<input class="input" type="search" placeholder="Search by task, tool or technique: “code review”, “RAG”, “PRD”…" value="${f.q}" data-q aria-label="Search the library"></div>
      <div id="lib-facets"></div>
      <div id="lib-results"><div class="grid grid-auto">${Array.from({ length: 6 }, () => html`<div class="skeleton" style="height:150px"></div>`)}</div></div>`);

    try { await loadCatalog(); }
    catch (e) { render($('#lib-results', root), html`<div class="empty"><h3>Couldn’t load the library</h3><p>${e.message}</p></div>`); return null; }

    const syncUrl = () => {
      const sp = new URLSearchParams();
      if (f.q) sp.set('q', f.q);
      for (const k of ['kind', 'domain', 'level', 'pack']) if (f[k] !== 'all') sp.set(k, f[k]);
      if (f.fav) sp.set('fav', '1');
      const qs = sp.toString() ? `?${sp}` : '';
      sessionStorage.setItem('pf.libq', qs);
      history.replaceState(null, '', `#/library${qs}`);
    };

    function draw() {
      const favIds = f.fav ? new Set(state.favorites) : undefined;
      const base = query(f.q, { ids: favIds, pack: f.pack });
      const packCounts = allItems().reduce((m, it) => (it.pack ? (m[it.pack] = (m[it.pack] || 0) + 1, m) : m), {});
      render($('#lib-packs', root), html`
        <div class="row between" style="margin-bottom:10px"><span class="label">Collections <span class="opt">installable Agent Skills and MCP servers</span></span>${f.pack !== 'all' ? html`<button class="btn btn-sm btn-ghost" data-pack="all">${raw(icon('x'))}Show everything</button>` : ''}</div>
        <div class="pack-strip">${PACKS.map(p => html`<button class="pack-card ${f.pack === p.id ? 'active' : ''}" data-pack="${p.id}" aria-pressed="${String(f.pack === p.id)}">
          <span class="pack-ic">${raw(icon(p.icon))}</span><span class="pack-t">${p.title}</span><span class="pack-n">${packCounts[p.id] || 0} ${p.unit || 'skills'}</span></button>`)}</div>
        ${f.pack !== 'all' ? html`<p class="muted" style="margin:12px 0 4px">${packById(f.pack)?.blurb}</p>` : ''}`);
      const c = counts(base);
      const results = base.filter(it => (f.kind === 'all' || it.kind === f.kind) && (f.domain === 'all' || it.domain === f.domain) && (f.level === 'all' || it.level === f.level));
      render($('#lib-facets', root), html`
        <div class="facets">
          <div class="chips" role="group" aria-label="Type">
            <button class="chip" data-f="kind" data-v="all" aria-pressed="${String(f.kind === 'all')}">All <span class="n">${base.length}</span></button>
            ${KINDS.map(k => html`<button class="chip" data-f="kind" data-v="${k.id}" aria-pressed="${String(f.kind === k.id)}" title="${k.desc}">${k.label} <span class="n">${c.kind[k.id] || 0}</span></button>`)}
            <button class="chip" data-f="fav" aria-pressed="${String(f.fav)}">${raw(icon('star'))}Saved <span class="n">${state.favorites.length}</span></button>
          </div>
          <div class="row wrap" style="gap:10px">
            <select class="select select-sm" style="width:auto" data-f="domain" aria-label="Domain">
              <option value="all">All domains</option>
              ${Object.entries(DOMAINS).filter(([k]) => c.domain[k]).map(([k, l]) => html`<option value="${k}" ${f.domain === k ? raw('selected') : ''}>${l} (${c.domain[k]})</option>`)}
            </select>
            <div class="seg" role="group" aria-label="Level">
              <button data-f="level" data-v="all" aria-pressed="${String(f.level === 'all')}">Any level</button>
              ${LEVELS.map(l => html`<button data-f="level" data-v="${l.id}" aria-pressed="${String(f.level === l.id)}">${l.label}</button>`)}
            </div>
          </div>
        </div>`);
      const page = results.slice(0, shown);
      render($('#lib-results', root), html`
        <p class="subtle" style="margin:4px 0 14px" aria-live="polite">${results.length.toLocaleString()} result${results.length === 1 ? '' : 's'}${f.q ? html` for “${f.q}”` : ''}</p>
        ${results.length ? html`<div class="grid grid-auto">${page.map(it => html`
          <button class="card lib-card" data-open="${it.id}">
            <div class="row" style="gap:6px;margin-bottom:8px">${it.mcp ? mcpLogo(it.mcp, 18) : ''}<span class="badge">${KINDS.find(k => k.id === it.kind)?.one || it.kind}</span>${levelBadge(it.level)}${it.pack && !it.mcp ? html`<span class="badge accent">skill pack</span>` : ''}${it.mcp ? html`<span class="badge ${it.mcp.access === 'read' ? 'good' : 'warn'}">${it.mcp.access === 'read' ? 'read-only' : 'read-write'}</span>` : ''}${isFavorite(it.id) ? raw(`<span class="fav-star" title="Saved">${icon('star')}</span>`) : ''}</div>
            <div class="card-title">${it.title}</div>
            <p class="lib-sum">${it.summary}</p>
            <div class="subtle lib-src">${DOMAINS[it.domain] || it.domain} · ${it.source}</div>
          </button>`)}</div>
          ${results.length > shown ? html`<div style="text-align:center;margin-top:24px"><button class="btn" data-more>Show more (${(results.length - shown).toLocaleString()} left)</button></div>` : ''}`
        : html`<div class="empty"><h3>Nothing matches</h3><p>Try a broader search or clear a filter.</p><button class="btn" data-clear>Clear filters</button></div>`}`);
    }

    draw();
    const deepItem = params[0] && find(decodeURIComponent(params[0]));
    if (deepItem) openItem(deepItem, { onChange: draw });

    const setQ = debounce(v => { f.q = v; shown = PAGE; syncUrl(); draw(); }, 150);
    const offs = [
      on(root, 'input', '[data-q]', (e, el) => setQ(el.value)),
      on(root, 'click', 'button[data-f]', (e, b) => {
        if (b.dataset.f === 'fav') f.fav = !f.fav; else f[b.dataset.f] = b.dataset.v;
        shown = PAGE; syncUrl(); draw();
      }),
      on(root, 'change', 'select[data-f]', (e, el) => { f[el.dataset.f] = el.value; shown = PAGE; syncUrl(); draw(); }),
      on(root, 'click', '[data-more]', () => { shown += PAGE * 2; draw(); }),
      on(root, 'click', '[data-pack]', (e, b) => { f.pack = f.pack === b.dataset.pack ? 'all' : b.dataset.pack; shown = PAGE; syncUrl(); draw(); }),
      on(root, 'click', '[data-clear]', () => { Object.assign(f, { q: '', kind: 'all', domain: 'all', level: 'all', pack: 'all', fav: false }); $('[data-q]', root).value = ''; syncUrl(); draw(); }),
      on(root, 'click', '[data-open]', (e, b) => {
        const it = find(b.dataset.open);
        if (!it) return;
        history.replaceState(null, '', `#/library/${encodeURIComponent(it.id)}`);
        openItem(it, { onChange: draw });
      }),
    ];
    if (!params[0]) syncUrl();
    return () => offs.forEach(o => o());
  },
};
