// AI Intelligence Scout — original feature by @surfingalien (attribution required).
import { html, render, raw, on, $ } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { scoutLibrary, saveScoutLibrary } from '../core/store.js';
import { getConfig, scout, maintainScout, auditLog, verifyAudit, currentModel } from '../core/api.js';
import { toast, confirmDialog, promptDialog, openDrawer } from '../core/ui.js';
import { invalidate } from '../core/catalog.js';
import { codeBlock, pageHead } from './shared.js';

const TOPICS = ['Multi-agent orchestration', 'Agent evals', 'Market microstructure', 'Options volatility surfaces', 'Autoresearch loops', 'RAG systems', 'MCP servers', 'Browser automation', 'Prompt-injection defense', 'Agent memory', 'Code review agents', 'Data pipelines'];
const TIER = { gold: 'good', silver: 'info', bronze: 'warn', quarantined: 'bad' };

export default {
  title: 'Scout',
  async mount(root) {
    const cfg = await getConfig();
    let results = null;
    let busy = false;
    let maintenance = null;
    let audit = null;

    const key = (kind, it) => (kind === 'skill' ? it.id : it.name);
    const isSaved = (kind, it) => { const lib = scoutLibrary(); return kind === 'skill' ? lib.skills.some(s => s.id === it.id) : lib.agents.some(a => a.name === it.name); };

    function itemCard(kind, it) {
      const t = it.trust || {};
      const review = it.governance?.decision === 'review';
      return html`<div class="card scout-card">
        <div class="row" style="gap:6px;flex-wrap:wrap"><span class="badge">${kind}</span>${t.tier ? html`<span class="badge ${TIER[t.tier] || ''}" title="Trust score ${t.score}">${t.tier} · ${t.score}</span>` : ''}
          ${it.verification?.verdict === 'pass' ? html`<span class="badge good">${raw(icon('check'))}verified</span>` : it.verification ? html`<span class="badge">${it.verification.verdict}</span>` : ''}
          ${review ? html`<span class="badge warn" title="${(it.governance.reasons || []).join('; ')}">needs review</span>` : ''}</div>
        <div class="card-title" style="margin-top:8px">${it.name}</div>
        <p class="subtle" style="margin-top:4px">${kind === 'skill' ? it.desc : (it.tags || []).join(' · ')}</p>
        <div class="btn-row" style="margin-top:12px">
          <button class="btn btn-sm" data-view="${kind}|${key(kind, it)}">View</button>
          ${isSaved(kind, it) ? html`<span class="badge good">Saved</span>` : html`<button class="btn btn-sm btn-primary" data-save="${kind}|${key(kind, it)}">${raw(icon('save'))}Save to library</button>`}
        </div>
      </div>`;
    }

    function draw() {
      const lib = scoutLibrary();
      render(root, html`
        ${pageHead({ eyebrow: 'AI Intelligence Scout', title: 'Discover new skills and agents', desc: 'Scout asks Claude to generate new skill templates and agent prompts on a topic, then runs every item through a governance pipeline: policy rules, a second-model verification, trust scoring, and a tamper-evident audit log.' })}
        <div class="card">
          <div class="input-group"><input class="input" data-topic placeholder="Topic, e.g. “evaluating RAG pipelines”" value="${TOPICS[0]}" aria-label="Topic">
            <select class="select" style="width:auto" data-type aria-label="What to generate"><option value="both">Skills + agents</option><option value="skills">Skills only</option><option value="agents">Agents only</option></select>
            <select class="select" style="width:auto" data-count aria-label="How many">${[2, 3, 4, 5].map(n => html`<option ${n === 3 ? raw('selected') : ''}>${n}</option>`)}</select>
            <button class="btn btn-primary" data-act="run" ${cfg.ready && !busy ? '' : raw('disabled')}>${busy ? raw('<span class="spinner"></span>Scouting…') : raw(`${icon('scout')}Run Scout`)}</button></div>
          <div class="chips" style="margin-top:12px">${TOPICS.map(t => html`<button class="chip" data-topic-pick="${t}">${t}</button>`)}</div>
          ${cfg.ready ? '' : html`<p class="subtle" style="margin-top:10px">Scout needs an <code>ANTHROPIC_API_KEY</code> on the server.</p>`}
        </div>

        ${results ? html`<section class="section">
          <div class="row between"><h2 class="section-title" style="margin:0">Discoveries</h2>
            <div class="row" style="gap:8px"><span class="subtle">${results.meta.tokens_used.input + results.meta.tokens_used.output} tokens · audit #${results.meta.audit_seq}</span><button class="btn btn-sm" data-act="save-all">Save all</button></div></div>
          <div class="grid grid-auto" style="margin-top:14px">${results.skills.map(s => itemCard('skill', s))}${results.agents.map(a => itemCard('agent', a))}</div>
          ${results.meta.rejected?.length ? html`<details class="card sunken" style="margin-top:14px"><summary><b>${results.meta.rejected.length} item(s) rejected by governance</b></summary>
            <ul style="margin:10px 0 0">${results.meta.rejected.map(r => html`<li><b>${r.key}</b> (${r.stage}): ${(r.reasons || []).join('; ')}</li>`)}</ul></details>` : ''}
        </section>` : ''}

        <section class="section">
          <div class="row between wrap" style="gap:10px"><h2 class="section-title" style="margin:0">Your Scout library <span class="subtle">${lib.skills.length + lib.agents.length} items</span></h2>
            <div class="btn-row"><button class="btn btn-sm" data-act="maintain" ${cfg.ready && lib.skills.length + lib.agents.length ? '' : raw('disabled')}>${raw(icon('shield'))}Maintain library</button><a class="btn btn-sm btn-ghost" href="#/library?q=scout">View in library</a></div></div>
          <p class="subtle" style="margin:6px 0 14px">Saved items appear in the Library. The maintainer re-checks every item against today’s policy and a fresh verification, and suggests what to prune.</p>
          ${maintenance ? html`<div class="card sunken" style="margin-bottom:14px"><div class="row" style="gap:8px"><b>Maintenance:</b><span class="badge good">${maintenance.summary.keep} keep</span><span class="badge warn">${maintenance.summary.flag} flag</span><span class="badge bad">${maintenance.summary.prune} prune</span><span class="spacer"></span>${maintenance.summary.prune ? html`<button class="btn btn-sm btn-danger" data-act="prune">Remove ${maintenance.summary.prune} pruned</button>` : ''}</div>
            <ul style="margin:10px 0 0;font-size:var(--fs-sm)">${[...maintenance.skills, ...maintenance.agents].filter(r => r.action !== 'keep').map(r => html`<li><b>${r.name || r.key}</b> → ${r.action}: ${(r.reasons || []).join('; ')}</li>`)}</ul></div>` : ''}
          ${lib.skills.length + lib.agents.length ? html`<div class="stack">${[...lib.skills.map(s => ['skill', s]), ...lib.agents.map(a => ['agent', a])].map(([kind, it]) => html`
            <div class="card flat row wrap" style="gap:10px;padding:12px 16px">
              <span class="badge">${kind}</span>${it.trust?.tier ? html`<span class="badge ${TIER[it.trust.tier] || ''}">${it.trust.tier}</span>` : ''}
              <b>${it.name}</b>${it.note ? html`<span class="subtle">· ${it.note}</span>` : ''}
              <span class="spacer"></span>
              <button class="btn btn-sm btn-ghost" data-note="${kind}|${key(kind, it)}">Note</button>
              <button class="btn btn-sm btn-ghost btn-danger" data-remove="${kind}|${key(kind, it)}" aria-label="Remove ${it.name}">${raw(icon('trash'))}</button>
            </div>`)}</div>` : html`<div class="empty" style="padding:28px"><p>Nothing saved yet. Run Scout and save the discoveries you trust.</p></div>`}
        </section>

        <section class="section">
          <div class="row between"><h2 class="section-title" style="margin:0">Audit log</h2><div class="btn-row"><button class="btn btn-sm" data-act="audit">Load recent runs</button><button class="btn btn-sm" data-act="verify">${raw(icon('lock'))}Verify hash chain</button></div></div>
          <p class="subtle" style="margin-top:6px">Every Scout run is appended to a SHA-256 hash chain on the server; editing any past entry breaks the chain.</p>
          ${audit ? html`<div class="stack" style="margin-top:12px">${audit.length ? audit.map(e => html`<div class="card flat" style="padding:10px 14px;font-size:var(--fs-sm)"><b>#${e.seq}</b> · ${e.event || 'scout'} · ${e.topic || ''} <span class="subtle">${new Date(e.ts || e.timestamp || Date.now()).toLocaleString()} · ${(e.accepted || []).length} accepted · ${(e.rejected || []).length} rejected · <code>${String(e.hash).slice(0, 12)}…</code></span></div>`) : html`<p class="subtle">No runs recorded yet.</p>`}</div>` : ''}
        </section>
        <p class="subtle" style="margin-top:40px">Scout is an original feature by <a href="https://github.com/surfingalien" target="_blank" rel="noopener">@surfingalien</a>. Attribution required for derivative works.</p>`);
    }

    const findResult = (kind, k) => (kind === 'skill' ? results?.skills.find(s => s.id === k) : results?.agents.find(a => a.name === k));
    function persist(kind, it) {
      const lib = scoutLibrary();
      if (kind === 'skill' && !lib.skills.some(s => s.id === it.id)) lib.skills.push(it);
      if (kind === 'agent' && !lib.agents.some(a => a.name === it.name)) lib.agents.push(it);
      saveScoutLibrary(lib); invalidate();
    }
    async function save(kind, it) {
      if (it.governance?.decision === 'review' && !(await confirmDialog('Save an item flagged for review?', `Policy flagged “${it.name}”: ${(it.governance.reasons || []).join('; ')}. Review it before using it.`, 'Save anyway'))) return false;
      persist(kind, it); return true;
    }

    draw();
    const offs = [
      on(root, 'click', '[data-topic-pick]', (e, b) => { $('[data-topic]', root).value = b.dataset.topicPick; }),
      on(root, 'click', '[data-view]', (e, b) => {
        const [kind, k] = b.dataset.view.split(/\|(.*)/s);
        const it = findResult(kind, k);
        openDrawer({ title: it.name, subtitle: html`<span class="badge">${kind}</span>${it.trust ? html`<span class="badge ${TIER[it.trust.tier] || ''}">${it.trust.tier} · ${it.trust.score}</span>` : ''}`,
          body: html`${it.verification?.reason ? html`<div class="callout" style="margin-bottom:12px">${raw(icon('shield'))}<div><b>Verifier:</b> ${it.verification.reason}</div></div>` : ''}${codeBlock(kind === 'skill' ? it.prompt : it.text)}` });
      }),
      on(root, 'click', '[data-save]', async (e, b) => {
        const [kind, k] = b.dataset.save.split(/\|(.*)/s);
        if (await save(kind, findResult(kind, k))) { toast('Saved to your library'); draw(); }
      }),
      on(root, 'click', '[data-remove]', async (e, b) => {
        const [kind, k] = b.dataset.remove.split(/\|(.*)/s);
        const lib = scoutLibrary();
        if (kind === 'skill') lib.skills = lib.skills.filter(s => s.id !== k); else lib.agents = lib.agents.filter(a => a.name !== k);
        saveScoutLibrary(lib); invalidate(); draw(); toast('Removed');
      }),
      on(root, 'click', '[data-note]', async (e, b) => {
        const [kind, k] = b.dataset.note.split(/\|(.*)/s);
        const lib = scoutLibrary();
        const it = kind === 'skill' ? lib.skills.find(s => s.id === k) : lib.agents.find(a => a.name === k);
        const note = await promptDialog('Note', 'A note for your future self', it.note || '');
        if (note === null) return;
        it.note = note; saveScoutLibrary(lib); invalidate(); draw();
      }),
      on(root, 'click', '[data-act]', async (e, b) => {
        const act = b.dataset.act;
        try {
          if (act === 'run') {
            busy = true; draw();
            results = await scout({ topic: $('[data-topic]', root)?.value || TOPICS[0], type: $('[data-type]', root)?.value, count: Number($('[data-count]', root)?.value || 3), model: (await currentModel()).id });
            toast(`${results.skills.length + results.agents.length} discoveries passed governance`);
          } else if (act === 'save-all') {
            let n = 0;
            for (const s of results.skills) if (!isSaved('skill', s) && await save('skill', s)) n++;
            for (const a of results.agents) if (!isSaved('agent', a) && await save('agent', a)) n++;
            toast(`Saved ${n} item${n === 1 ? '' : 's'}`);
          } else if (act === 'maintain') {
            b.disabled = true;
            maintenance = await maintainScout({ ...scoutLibrary(), model: (await currentModel()).id });
          } else if (act === 'prune') {
            const prune = new Set([...maintenance.skills, ...maintenance.agents].filter(r => r.action === 'prune').map(r => r.key));
            const lib = scoutLibrary();
            lib.skills = lib.skills.filter(s => !prune.has(s.id)); lib.agents = lib.agents.filter(a => !prune.has(a.name));
            saveScoutLibrary(lib); invalidate(); maintenance = null; toast(`Removed ${prune.size} item(s)`);
          } else if (act === 'audit') audit = await auditLog();
          else if (act === 'verify') {
            const v = await verifyAudit();
            toast(v.valid ? `Chain intact: ${v.entries} entries verified` : `Chain broken at entry #${v.first_break?.seq}: ${v.first_break?.reason}`, v.valid ? 'ok' : 'error');
          }
        } catch (err) { toast(err.message, 'error'); }
        busy = false; draw();
      }),
    ];
    return () => offs.forEach(o => o());
  },
};
