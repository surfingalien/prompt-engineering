// ─── PromptForge app shell ───────────────────────────────────────────────────
// Hash router + sidebar + command palette + settings. Views are lazy-loaded
// ES modules exporting { title, wide?, mount(root, ctx) → cleanup? }.

import { html, render, raw, on, $, debounce } from './core/dom.js';
import { icon, LOGO } from './core/icons.js';
import { state, update, subscribe, exportWorkspace, importWorkspace, resetWorkspace, createPrompt } from './core/store.js';
import { getConfig, formatCost } from './core/api.js';
import { toast, openModal, download, confirmDialog, copyText } from './core/ui.js';
import { loadCatalog, query as queryCatalog } from './core/catalog.js';
import { LESSONS } from './data/curriculum.js';
import { navigate } from './core/nav.js';

const NAV = [
  { group: null, items: [{ id: 'home', label: 'Home', icon: 'home' }] },
  { group: 'Learn', items: [{ id: 'learn', label: 'Learning path', icon: 'learn' }, { id: 'library', label: 'Library', icon: 'library' }] },
  { group: 'Create', items: [{ id: 'build', label: 'Prompt builder', icon: 'build' }, { id: 'workbench', label: 'Workbench', icon: 'workbench' }] },
  { group: 'Ship', items: [{ id: 'harness', label: 'Harness studio', icon: 'harness' }, { id: 'evals', label: 'Evals', icon: 'evals' }] },
  { group: 'Tools', items: [{ id: 'council', label: 'Council', icon: 'council' }, { id: 'scout', label: 'Scout', icon: 'scout' }] },
];
const VIEWS = {
  home: () => import('./views/home.js'),
  learn: () => import('./views/learn.js'),
  library: () => import('./views/library.js'),
  build: () => import('./views/build.js'),
  workbench: () => import('./views/workbench.js'),
  harness: () => import('./views/harness.js'),
  evals: () => import('./views/evals.js'),
  council: () => import('./views/council.js'),
  scout: () => import('./views/scout.js'),
  import: () => import('./views/import.js'),
};

// ── Theme ────────────────────────────────────────────────────────────────────
const media = window.matchMedia('(prefers-color-scheme: dark)');
function applyTheme() {
  const t = state.settings.theme;
  document.documentElement.dataset.theme = t === 'dark' || (t !== 'light' && media.matches) ? 'dark' : 'light';
}
media.addEventListener('change', applyTheme);
function toggleTheme() {
  const dark = document.documentElement.dataset.theme === 'dark';
  update('settings', s => ({ ...s, theme: dark ? 'light' : 'dark' }));
  applyTheme();
  renderSidebar();
}

// ── Router ───────────────────────────────────────────────────────────────────
export function parseHash(hash = location.hash) {
  const [path, qs] = hash.replace(/^#\/?/, '').split('?');
  const [name, ...rest] = path.split('/').filter(Boolean);
  return { name: VIEWS[name] ? name : 'home', params: rest.map(decodeURIComponent), query: Object.fromEntries(new URLSearchParams(qs || '')) };
}

let cleanup = null;
let current = null;
let renderSeq = 0;
async function route() {
  const r = parseHash();
  const seq = ++renderSeq;
  const main = $('#main');
  if (typeof cleanup === 'function') { try { cleanup(); } catch (e) { console.error(e); } }
  cleanup = null;
  current = r.name;
  // Drawers and dialogs belong to the page that opened them.
  document.querySelectorAll('dialog[open]').forEach(d => d.close());
  renderSidebar();
  closeNav();
  try {
    const mod = (await VIEWS[r.name]()).default;
    if (seq !== renderSeq) return;
    const root = document.createElement('div');
    root.className = `view ${mod.wide ? 'wide' : ''}`;
    main.replaceChildren(root);
    document.title = `${mod.title} · PromptForge`;
    window.scrollTo(0, 0);
    cleanup = await mod.mount(root, r);
    if (seq !== renderSeq && typeof cleanup === 'function') { cleanup(); cleanup = null; return; }
    main.focus({ preventScroll: true });
  } catch (e) {
    console.error(e);
    render(main, html`<div class="view"><div class="empty"><h3>Something went wrong loading this page</h3><p>${e.message}</p><a class="btn" href="#/home">Go home</a></div></div>`);
  }
}

// ── Sidebar & topbar ─────────────────────────────────────────────────────────
let cfg = { ready: false, models: [] };
function renderSidebar() {
  const done = Object.values(state.progress).filter(Boolean).length;
  const counts = { learn: `${done}/${LESSONS.length}`, workbench: state.prompts.length || '', harness: state.harnesses.length || '', evals: state.suites.length || '' };
  const dark = document.documentElement.dataset.theme === 'dark';
  render($('#sidebar'), html`
    <a class="brand" href="#/home">
      <span class="brand-mark">${raw(LOGO)}</span>
      <span><div class="brand-name">PromptForge</div><div class="brand-sub">Prompt studio for Claude</div></span>
    </a>
    <button class="search-trigger" data-action="palette">${raw(icon('search'))}<span>Search or jump to…</span><span class="kbd">${navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} K</span></button>
    <nav aria-label="Main">
      ${NAV.map(g => html`<div class="nav-group">
        ${g.group ? html`<div class="nav-label">${g.group}</div>` : ''}
        ${g.items.map(i => html`<a class="nav-link" href="#/${i.id}" ${current === i.id ? raw('aria-current="page"') : ''}>${raw(icon(i.icon))}<span>${i.label}</span>${counts[i.id] ? html`<span class="count">${counts[i.id]}</span>` : ''}</a>`)}
      </div>`)}
    </nav>
    <div class="sidebar-foot">
      <div class="status-line" title="${statusTitle()}">
        <span class="dot ${cfg.ready ? 'ok' : 'off'}"></span>${cfg.ready ? (cfg.via === 'user-key' ? 'Using your key' : 'Claude connected') : ({ password: 'Locked: password needed', budget: 'Daily budget used up' }[cfg.lockedReason] || 'Offline mode')}
        <span class="spacer"></span><span title="Estimated spend this browser">${formatCost(state.usage.cost)}</span>
      </div>
      <div class="foot-actions">
        <button class="btn btn-ghost btn-sm" data-action="settings">${raw(icon('settings'))}Settings</button>
        <span class="spacer"></span>
        <button class="btn btn-ghost btn-icon btn-sm" data-action="theme" aria-label="Switch to ${dark ? 'light' : 'dark'} theme">${raw(icon(dark ? 'sun' : 'moon'))}</button>
      </div>
    </div>`);
  render($('#topbar'), html`
    <button class="btn btn-ghost btn-icon" data-action="nav" aria-label="Open navigation">${raw(icon('menu'))}</button>
    <a class="brand" href="#/home"><span class="brand-mark">${raw(LOGO)}</span><span class="brand-name">PromptForge</span></a>
    <span class="spacer"></span>
    <button class="btn btn-ghost btn-icon" data-action="palette" aria-label="Search">${raw(icon('search'))}</button>`);
}
function statusTitle() {
  if (cfg.ready) return cfg.via === 'user-key' ? 'Runs use your own API key' : 'Live runs enabled';
  return { password: 'Enter the access password in Settings, or add your own API key', budget: 'Today’s shared budget is used up; add your own API key in Settings' }[cfg.lockedReason]
    || 'No API key: runs are off. Add your own key in Settings; everything else works offline.';
}
const openNav = () => $('#shell').classList.add('nav-open');
const closeNav = () => $('#shell').classList.remove('nav-open');

// ── Command palette ──────────────────────────────────────────────────────────
function openPalette() {
  if ($('dialog.palette')) return;
  const dlg = document.createElement('dialog');
  dlg.className = 'palette';
  dlg.setAttribute('aria-label', 'Command palette');
  render(dlg, html`<div class="palette-panel">
    <div class="palette-input">${raw(icon('search'))}<input type="text" placeholder="Search pages, lessons, 500+ templates…" aria-label="Search" autocomplete="off" spellcheck="false"><span class="kbd">esc</span></div>
    <div class="palette-list" role="listbox"></div>
    <div class="palette-foot"><span><span class="kbd">↑</span> <span class="kbd">↓</span> navigate</span><span><span class="kbd">↵</span> open</span></div>
  </div>`);
  document.body.appendChild(dlg);
  const input = $('input', dlg);
  const list = $('.palette-list', dlg);
  let results = [];
  let sel = 0;

  const actions = [
    { group: 'Actions', label: 'New blank prompt', icon: 'plus', run: () => navigate(`workbench/${createPrompt().id}`) },
    { group: 'Actions', label: 'Toggle light / dark theme', icon: 'moon', run: toggleTheme },
    { group: 'Actions', label: 'Open settings', icon: 'settings', run: openSettings },
  ];
  const pages = NAV.flatMap(g => g.items).map(i => ({ group: 'Go to', label: i.label, icon: i.icon, run: () => navigate(i.id) }));

  const draw = async () => {
    const q = input.value.trim().toLowerCase();
    const match = s => !q || s.toLowerCase().includes(q);
    results = [
      ...pages.filter(p => match(p.label)),
      ...actions.filter(a => match(a.label)),
      ...LESSONS.filter(l => q && match(`${l.title} ${l.summary}`)).slice(0, 5).map(l => ({ group: 'Lessons', label: l.title, sum: l.summary, icon: 'learn', meta: `Level ${l.levelN}`, run: () => navigate(`learn/${l.id}`) })),
      ...state.prompts.filter(p => q && match(p.title)).slice(0, 4).map(p => ({ group: 'Your prompts', label: p.title, icon: 'workbench', run: () => navigate(`workbench/${p.id}`) })),
    ];
    if (q.length > 1) {
      await loadCatalog();
      results.push(...queryCatalog(q).slice(0, 8).map(it => ({ group: 'Library', label: it.title, sum: it.summary, icon: 'library', meta: it.kind, run: () => navigate(`library/${encodeURIComponent(it.id)}`) })));
    }
    sel = Math.min(sel, Math.max(0, results.length - 1));
    let lastGroup = null;
    render(list, results.length ? html`${results.map((r, i) => {
      const head = r.group !== lastGroup ? html`<div class="palette-group">${r.group}</div>` : '';
      lastGroup = r.group;
      return html`${head}<button class="palette-item" role="option" data-i="${i}" aria-selected="${String(i === sel)}">${raw(icon(r.icon))}<span>${r.label}</span>${r.sum ? html`<span class="sum">${r.sum}</span>` : ''}${r.meta ? html`<span class="meta">${r.meta}</span>` : ''}</button>`;
    })}` : html`<div class="empty" style="margin:8px;padding:28px">No matches for “${input.value}”.</div>`);
  };
  const choose = i => { const r = results[i]; if (!r) return; dlg.close(); r.run(); };
  const highlight = () => {
    list.querySelectorAll('.palette-item').forEach(b => b.setAttribute('aria-selected', String(Number(b.dataset.i) === sel)));
    list.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  };
  input.addEventListener('input', debounce(() => { sel = 0; draw(); }, 90));
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, results.length - 1); highlight(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); highlight(); e.preventDefault(); }
    else if (e.key === 'Enter') { choose(sel); e.preventDefault(); }
  });
  on(list, 'click', '.palette-item', (e, b) => choose(Number(b.dataset.i)));
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => dlg.remove());
  dlg.showModal();
  draw();
}

// ── Settings ─────────────────────────────────────────────────────────────────
async function openSettings() {
  const c = await getConfig();
  const s = state.settings;
  const u = state.usage;
  const r = await openModal({
    title: 'Settings',
    body: html`
      <label class="field"><span class="label">Default model</span>
        <select class="select" name="model">${c.models.map(m => html`<option value="${m.id}" ${(s.model || c.defaultModel) === m.id ? raw('selected') : ''}>${m.label} — ${m.blurb}</option>`)}</select></label>
      <label class="field"><span class="label">Default effort</span>
        <select class="select" name="effort">${c.efforts.map(e => html`<option ${s.effort === e ? raw('selected') : ''}>${e}</option>`)}</select>
        <span class="help">Effort controls how deeply Claude thinks. Medium is a strong default; raise it for hard reasoning.</span></label>
      <label class="field"><span class="label">Theme</span>
        <select class="select" name="theme">${['system', 'light', 'dark'].map(t => html`<option ${s.theme === t ? raw('selected') : ''}>${t}</option>`)}</select></label>
      <hr class="divider">
      <div class="label">Access</div>
      ${c.serverReady ? html`<p class="help">This server provides a shared Claude key${c.budget?.daily ? html` with a daily budget: <b>$${c.budget.spent.toFixed(2)}</b> of $${c.budget.daily} used today (resets at 00:00 UTC)` : ''}.</p>` : html`<p class="help">This server has no shared Claude key. Add your own to run prompts.</p>`}
      ${c.access?.passwordRequired ? html`<label class="field"><span class="label">Access password <span class="opt">required for the shared key</span></span><input class="input" name="accessPassword" type="password" autocomplete="current-password" value="${s.accessPassword || ''}"></label>` : ''}
      <label class="field"><span class="label">Your Anthropic API key <span class="opt">optional</span></span><input class="input" name="userApiKey" type="password" autocomplete="off" spellcheck="false" placeholder="sk-ant-…" value="${s.userApiKey || ''}">
        <span class="help">Used instead of the shared key, billed to you, and not limited by the shared budget. It is stored only in this browser and sent only to this site’s server, for each request. It is never saved on the server or included in exports.</span></label>
      <hr class="divider">
      <label class="field"><span class="label">Spend alert (USD)</span><input class="input" name="budgetUsd" type="number" min="0" step="1" value="${s.budgetUsd}">
        <span class="help">Estimated spend from this browser: <b>${formatCost(u.cost)}</b> across ${u.runs} runs (${(u.input + u.output).toLocaleString()} tokens). Estimates only.</span></label>
      <hr class="divider">
      <div class="btn-row">
        <button class="btn btn-sm" type="submit" value="export">${raw(icon('download'))}Export workspace</button>
        <button class="btn btn-sm" type="submit" value="import">${raw(icon('upload'))}Import…</button>
        <button class="btn btn-sm" type="submit" value="usage">Reset usage meter</button>
        <button class="btn btn-sm btn-danger" type="submit" value="reset">${raw(icon('trash'))}Clear all data</button>
      </div>
      <p class="help">Your prompts, suites and harnesses are stored only in this browser. Export regularly to back them up.</p>`,
    actions: [{ id: 'save', label: 'Save', primary: true }],
  });
  if (!r) return;
  if (r.action === 'export') { download(`promptforge-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(exportWorkspace(), null, 2), 'application/json'); return; }
  if (r.action === 'usage') { update('usage', () => ({ input: 0, output: 0, cost: 0, runs: 0, since: Date.now() })); renderSidebar(); toast('Usage meter reset'); return; }
  if (r.action === 'import') {
    const inp = Object.assign(document.createElement('input'), { type: 'file', accept: 'application/json' });
    inp.onchange = async () => {
      try { importWorkspace(JSON.parse(await inp.files[0].text())); toast('Workspace imported'); route(); }
      catch (e) { toast(e.message, 'error'); }
    };
    inp.click();
    return;
  }
  if (r.action === 'reset') {
    if (await confirmDialog('Clear all data?', 'This deletes every prompt, suite, harness, favorite and lesson progress stored in this browser. Export first if you want a backup.', 'Delete everything', true)) {
      resetWorkspace(); location.reload();
    }
    return;
  }
  const userApiKey = String(r.data.userApiKey || '').trim();
  if (userApiKey && !/^sk-ant-[\w-]{20,}$/.test(userApiKey)) { toast('That API key doesn’t look right (it should start with sk-ant-). Not saved.', 'error'); return; }
  update('settings', st => ({ ...st, model: r.data.model, effort: r.data.effort, theme: r.data.theme, budgetUsd: Number(r.data.budgetUsd) || 0,
    userApiKey, ...(r.data.accessPassword !== undefined ? { accessPassword: String(r.data.accessPassword) } : {}) }));
  cfg = await getConfig(true);
  applyTheme(); renderSidebar(); toast('Settings saved');
  route();
}

// ── Global events ────────────────────────────────────────────────────────────
on(document, 'click', '[data-copy]', (e, el) => copyText(el.dataset.copy));
on(document, 'click', '[data-action]', (e, el) => {
  const a = el.dataset.action;
  if (a === 'palette') { e.preventDefault(); openPalette(); }
  else if (a === 'theme') toggleTheme();
  else if (a === 'settings') openSettings();
  else if (a === 'nav') openNav();
});
$('#scrim').addEventListener('click', closeNav);
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
  if (e.key === 'Escape') closeNav();
});
window.addEventListener('hashchange', route);
let budgetWarned = false;
subscribe(slice => {
  if (['progress', 'prompts', 'harnesses', 'suites', 'usage'].includes(slice)) renderSidebar();
  if (slice === 'usage' && !budgetWarned && state.settings.budgetUsd && state.usage.cost >= state.settings.budgetUsd) {
    budgetWarned = true;
    toast(`Heads up: estimated spend passed your $${state.settings.budgetUsd} alert.`, 'error');
  }
});

applyTheme();
renderSidebar();
route();
getConfig().then(c => { cfg = c; renderSidebar(); });
