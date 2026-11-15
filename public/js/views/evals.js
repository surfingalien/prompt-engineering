import { html, render, raw, on, debounce, $, uid, timeAgo } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { state, update, getPrompt } from '../core/store.js';
import { navigate } from '../core/nav.js';
import { getConfig, streamChat, grade, currentModel, generateCases } from '../core/api.js';
import { toast, download, confirmDialog, openDrawer } from '../core/ui.js';
import { ASSERTION_TYPES, checkAssertion, toPromptfooYaml } from '../lib/evals.js';
import { extractVars, fillVars, labelFor } from '../lib/template.js';
import { renderMarkdown } from '../lib/markdown.js';
import { slugify } from '../lib/harness.js';
import { pageHead, lockedNotice, modelOptions } from './shared.js';

const getS = id => state.suites.find(s => s.id === id);
const saveS = s => update('suites', list => list.map(x => (x.id === s.id ? s : x)));

function listView(root) {
  const prompts = [...state.prompts].sort((a, b) => b.updatedAt - a.updatedAt);
  render(root, html`
    ${pageHead({ eyebrow: 'Evals', title: 'Measure before you tune', desc: 'An eval suite runs a prompt against a set of cases and checks each output, with code where possible and with Claude-graded rubrics where judgment is needed. Change one thing, re-run, and let the pass rate decide.' })}
    <div class="grid grid-3 eval-steps">
      ${[['1', 'Define success', 'Turn “good” into checks: must contain, must not contain, valid JSON, word limits, or a rubric.'], ['2', 'Collect cases', 'Typical inputs, edge cases and adversarial ones like injection attempts or missing data.'], ['3', 'Run & iterate', 'Run the suite, read the failures, change one thing, run again. Export to promptfoo for CI.']]
        .map(([n, t, d]) => html`<div class="card sunken"><div class="step-n">${n}</div><div class="card-title">${t}</div><p class="subtle" style="margin-top:4px">${d}</p></div>`)}
    </div>
    <section class="section">
      <div class="row between" style="margin-bottom:16px"><h2 class="section-title" style="margin:0">Your suites</h2>
        ${prompts.length ? html`<div class="row" style="gap:8px"><select class="select select-sm" style="width:auto" data-pick aria-label="Prompt to test">${prompts.map(p => html`<option value="${p.id}">${p.title}</option>`)}</select><button class="btn btn-primary btn-sm" data-act="new">${raw(icon('plus'))}New suite</button></div>` : ''}</div>
      ${state.suites.length ? html`<div class="grid grid-3">${state.suites.map(s => {
        const last = s.runs?.[0];
        return html`<a class="card" href="#/evals/${s.id}"><div class="card-title">${s.name}</div>
          <div class="subtle" style="margin-top:4px">${s.cases.length} case${s.cases.length === 1 ? '' : 's'} · ${getPrompt(s.promptId)?.title || 'prompt missing'}</div>
          ${last ? html`<div class="row" style="gap:8px;margin-top:12px"><span class="badge ${last.passRate >= 0.8 ? 'good' : last.passRate >= 0.5 ? 'warn' : 'bad'}">${Math.round(last.passRate * 100)}% passing</span><span class="subtle">${timeAgo(last.at)}</span></div>` : html`<div class="subtle" style="margin-top:12px">Not run yet</div>`}</a>`;
      })}</div>` : html`<div class="empty"><h3>No suites yet</h3><p>${prompts.length ? 'Pick a prompt above and create a suite, or use “Create eval suite” in the Workbench.' : 'Create a prompt in the Workbench first, then build a suite for it.'}</p>${prompts.length ? '' : html`<a class="btn btn-primary" href="#/workbench">Open the workbench</a>`}</div>`}
    </section>`);
  return on(root, 'click', '[data-act="new"]', async () => {
    const p = getPrompt($('[data-pick]', root).value);
    const vars = extractVars(p.system, p.user);
    const s = { id: uid('s'), name: `${p.title} — evals`, promptId: p.id, model: (await currentModel()).id, effort: state.settings.effort || 'medium', createdAt: Date.now(), runs: [],
      cases: [{ id: uid('c'), name: 'Case 1', vars: Object.fromEntries(vars.map(v => [v, p.vars?.[v] || ''])), assertions: [] }] };
    update('suites', list => [s, ...list]);
    navigate(`evals/${s.id}`);
  });
}

function suiteView(root, s, cfg) {
  const results = {}; // caseId → { output, checks:[{pass, reason}], pass, error, running }
  const resultsB = {}; // same, for the comparison version
  let compareTo = ''; // version id of the prompt to compare against ('' = none)
  let generating = false;
  const versionOf = id => prompt()?.versions?.find(v => v.id === id);
  const versionLabel = id => { const vs = prompt()?.versions || []; const i = vs.findIndex(v => v.id === id); return i < 0 ? '' : `v${vs.length - i}${vs[i].note ? ` · ${vs[i].note}` : ''}`; };
  let running = false;
  let ctrl = null;

  function prompt() { return getPrompt(s.promptId); }

  function caseHtml(c, i) {
    const p = prompt();
    const vars = p ? extractVars(p.system, p.user) : Object.keys(c.vars || {});
    const r = results[c.id];
    return html`<div class="card case-card ${r ? (r.running ? 'is-running' : r.pass ? 'is-pass' : 'is-fail') : ''}">
      <div class="row" style="gap:8px">
        <span class="case-status">${r ? (r.running ? raw('<span class="spinner"></span>') : raw(icon(r.pass ? 'checkCircle' : 'alert'))) : raw(icon('circle'))}</span>
        <input class="input input-sm case-name" data-case="${c.id}" data-k="name" value="${c.name}" aria-label="Case name">
        <span class="spacer"></span>
        ${compareTo && resultsB[c.id] ? html`<span class="ab-pill ${resultsB[c.id].running ? '' : resultsB[c.id].pass ? 'good' : 'bad'}" title="Result for ${versionLabel(compareTo)}">B ${resultsB[c.id].running ? '…' : resultsB[c.id].pass ? 'pass' : 'fail'}</span>` : ''}
        ${r && !r.running ? html`<button class="btn btn-sm btn-ghost" data-output="${c.id}">View output${compareTo && resultsB[c.id] && !resultsB[c.id].running ? 's' : ''}</button>` : ''}
        <button class="btn btn-sm btn-ghost btn-danger" data-del-case="${c.id}" aria-label="Delete case">${raw(icon('trash'))}</button>
      </div>
      ${vars.length ? html`<div class="vars-grid" style="margin-top:10px">${vars.map(v => html`<label class="field"><span class="label" style="font-size:var(--fs-xs)">${labelFor(v)}</span><textarea class="textarea" rows="2" data-case="${c.id}" data-var="${v}">${c.vars?.[v] || ''}</textarea></label>`)}</div>`
        : html`<p class="subtle" style="margin-top:8px">This prompt has no {{variables}}, so every case sends the same input. Add variables to vary the cases.</p>`}
      <div class="label" style="margin-top:12px">Checks</div>
      <div class="stack" style="gap:6px;margin-top:6px">${(c.assertions || []).map((a, j) => {
        const res = r?.checks?.[j];
        const t = ASSERTION_TYPES.find(x => x.id === a.type);
        return html`<div class="assert-row">
          <select class="select select-sm" data-case="${c.id}" data-a="${j}" data-ak="type" aria-label="Check type">${ASSERTION_TYPES.map(x => html`<option value="${x.id}" ${x.id === a.type ? raw('selected') : ''}>${x.label}</option>`)}</select>
          ${a.type === 'is_json' ? html`<span class="subtle" style="padding:0 6px">no value needed</span>` : html`<input class="input input-sm" data-case="${c.id}" data-a="${j}" data-ak="value" value="${a.value || ''}" placeholder="${t?.hint || ''}" aria-label="Check value">`}
          ${res ? html`<span class="badge ${res.pass ? 'good' : 'bad'}" title="${res.reason}">${res.pass ? 'pass' : 'fail'}</span>` : html`<span></span>`}
          <button class="btn btn-sm btn-ghost" data-del-a="${c.id}:${j}" aria-label="Remove check">${raw(icon('x'))}</button>
        </div>`;
      })}</div>
      <button class="btn btn-sm btn-ghost" style="margin-top:6px" data-add-a="${c.id}">${raw(icon('plus'))}Add check</button>
      ${r?.error ? html`<div class="callout warn" style="margin-top:10px">${raw(icon('alert'))}<div>${r.error}</div></div>` : ''}
    </div>`;
  }

  function draw() {
    const p = prompt();
    const last = s.runs?.[0];
    render(root, html`
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#/evals">Evals</a><span>/</span><span>${s.name}</span></nav>
      <div class="row between wrap" style="gap:12px;margin-bottom:18px">
        <input class="title-input" data-suite="name" value="${s.name}" aria-label="Suite name">
        <div class="btn-row">
          <button class="btn btn-sm" data-act="export">${raw(icon('download'))}promptfoo YAML</button>
          <button class="btn btn-sm btn-ghost btn-danger" data-act="delete">${raw(icon('trash'))}</button>
        </div>
      </div>
      ${lockedNotice(cfg, 'You can still design the suite and export it to promptfoo.')}
      <div class="card row wrap suite-bar" style="gap:14px">
        <label class="field"><span class="label">Prompt under test</span><select class="select select-sm" data-suite="promptId">${state.prompts.map(x => html`<option value="${x.id}" ${x.id === s.promptId ? raw('selected') : ''}>${x.title}</option>`)}</select></label>
        <label class="field"><span class="label">Model</span><select class="select select-sm" data-suite="model">${modelOptions(cfg, s.model)}</select></label>
        <label class="field"><span class="label">Effort</span><select class="select select-sm" data-suite="effort">${cfg.efforts.map(e => html`<option ${e === s.effort ? raw('selected') : ''}>${e}</option>`)}</select></label>
        <label class="field"><span class="label">Compare with</span><select class="select select-sm" data-compare aria-label="Compare with a saved version">
          <option value="">Nothing (current prompt only)</option>
          ${(p?.versions || []).map(v => html`<option value="${v.id}" ${compareTo === v.id ? raw('selected') : ''}>${versionLabel(v.id)}</option>`)}
        </select></label>
        <span class="spacer"></span>
        ${p ? html`<a class="btn btn-sm btn-ghost" href="#/workbench/${p.id}">${raw(icon('workbench'))}Edit prompt</a>` : ''}
        ${running ? html`<button class="btn btn-dark" data-act="stop">${raw(icon('stop'))}Stop</button>` : html`<button class="btn btn-primary" data-act="run" ${cfg.ready && p ? '' : raw('disabled')}>${raw(icon('play'))}Run ${s.cases.length} case${s.cases.length === 1 ? '' : 's'}</button>`}
      </div>
      ${!p ? html`<div class="callout warn" style="margin-top:12px">${raw(icon('alert'))}<div>The prompt this suite tested was deleted. Pick another prompt above.</div></div>` : ''}
      ${s.runs?.length ? html`<div class="run-history">
        <span class="label">History</span>
        ${s.runs.slice(0, 10).reverse().map(r => html`<div class="hist-bar" title="${Math.round(r.passRate * 100)}% · ${new Date(r.at).toLocaleString()}${r.model ? ` · ${r.model}` : ''}"><div style="height:${Math.max(6, Math.round(r.passRate * 100))}%;background:${raw(r.passRate >= 0.8 ? 'var(--good)' : r.passRate >= 0.5 ? 'var(--warn)' : 'var(--bad)')}"></div></div>`)}
        ${last ? html`<span class="subtle">Last run: <b>${last.passed}/${last.total}</b> passing (${Math.round(last.passRate * 100)}%) · ${timeAgo(last.at)}</span>` : ''}
      </div>` : ''}
      ${compareTo && Object.keys(resultsB).length ? abSummary() : ''}
      ${p && !p.versions?.length ? html`<p class="subtle" style="margin-top:10px">Tip: save a version of the prompt in the Workbench to compare two versions on this suite.</p>` : ''}
      <div class="stack" style="margin-top:18px" id="cases">${s.cases.map(caseHtml)}</div>
      <div class="btn-row" style="margin-top:14px">
        <button class="btn" data-act="add-case">${raw(icon('plus'))}Add case</button>
        <button class="btn" data-act="gen-cases" ${cfg.ready && p && !generating ? '' : raw('disabled')}>${generating ? raw('<span class="spinner"></span>Writing cases…') : raw(`${icon('sparkle')}Generate cases with ${(s?.model || '').startsWith('gw:') ? 'AI' : 'Claude'}`)}</button>
        <select class="select select-sm" style="width:auto" data-gen-count aria-label="How many cases">${[4, 6, 8].map(n => html`<option ${n === 6 ? raw('selected') : ''}>${n}</option>`)}</select>
      </div>`);
  }

  function abSummary() {
    const done = s.cases.filter(c => results[c.id] && !results[c.id].running && resultsB[c.id] && !resultsB[c.id].running);
    const a = done.filter(c => results[c.id].pass).length;
    const b = done.filter(c => resultsB[c.id].pass).length;
    const flips = done.filter(c => results[c.id].pass !== resultsB[c.id].pass);
    const verdict = !done.length ? '' : a > b ? 'The current prompt is ahead.' : b > a ? `${versionLabel(compareTo)} is ahead.` : 'They tie on pass rate.';
    return html`<div class="card ab-summary">
      <div class="ab-cols">
        <div><div class="subtle">A · current prompt</div><div class="ab-score">${a}/${done.length}</div></div>
        <div><div class="subtle">B · ${versionLabel(compareTo)}</div><div class="ab-score">${b}/${done.length}</div></div>
      </div>
      <p class="muted" style="margin-top:8px">${verdict} ${flips.length ? `${flips.length} case${flips.length > 1 ? 's' : ''} changed outcome: ${flips.map(c => c.name).join(', ')}.` : done.length ? 'No case changed outcome.' : ''}</p>
    </div>`;
  }

  // Run one case against one prompt variant and fill in result r.
  async function runCase(c, variant, r) {
    try {
      const user = fillVars(variant.user, c.vars);
      const out = await streamChat({ model: s.model, effort: s.effort, system: fillVars(variant.system, c.vars).trim() || undefined, messages: [{ role: 'user', content: user }], maxTokens: Math.min(4096, cfg.maxOutputTokens), signal: ctrl.signal });
      r.output = out.text;
      r.checks = [];
      for (const a of c.assertions || []) {
        const det = checkAssertion(a, out.text);
        if (det) r.checks.push(det);
        else {
          const g = await grade({ output: out.text, rubric: a.value || 'The response is helpful and correct.', input: user, model: s.model, signal: ctrl.signal });
          r.checks.push({ pass: g.pass, reason: `${g.score}/10 · ${g.reason}` });
        }
      }
      r.pass = r.checks.every(x => x.pass);
    } catch (e) {
      r.error = e.name === 'AbortError' ? 'Stopped.' : e.message; r.pass = false;
    }
    r.running = false;
  }

  async function runAll() {
    const p = prompt();
    if (!p || running) return;
    const vB = compareTo ? versionOf(compareTo) : null;
    running = true; ctrl = new AbortController();
    for (const k of Object.keys(resultsB)) delete resultsB[k];
    for (const c of s.cases) { results[c.id] = { running: true }; if (vB) resultsB[c.id] = { running: true }; }
    draw();
    let passed = 0;
    const queue = [...s.cases];
    const worker = async () => {
      while (queue.length && !ctrl.signal.aborted) {
        const c = queue.shift();
        await Promise.all([
          runCase(c, p, results[c.id]),
          vB ? runCase(c, vB, resultsB[c.id]) : null,
        ]);
        if (results[c.id].pass) passed++;
        draw();
      }
    };
    await Promise.all([worker(), worker()]); // two at a time: fast, but gentle on rate limits
    running = false;
    const completed = s.cases.filter(c => results[c.id] && !results[c.id].running && !results[c.id].error?.startsWith('Stopped'));
    if (completed.length === s.cases.length) {
      const bPassed = vB ? s.cases.filter(c => resultsB[c.id]?.pass).length : null;
      s.runs = [{ at: Date.now(), passed, total: s.cases.length, passRate: s.cases.length ? passed / s.cases.length : 0, model: s.model, promptVersion: p.versions?.length || 0,
        ...(vB ? { compare: { label: versionLabel(compareTo), passed: bPassed } } : {}) }, ...(s.runs || [])].slice(0, 30);
      saveS(s);
      toast(`${passed}/${s.cases.length} cases passing`);
    }
    draw();
  }

  draw();
  const persist = debounce(() => saveS(s), 300);
  const caseOf = el => s.cases.find(c => c.id === el.dataset.case);
  const offs = [
    on(root, 'input', '[data-suite="name"]', (e, el) => { s.name = el.value; persist(); }),
    on(root, 'change', 'select[data-suite]', (e, el) => {
      s[el.dataset.suite] = el.value;
      if (el.dataset.suite === 'promptId') { const p = prompt(); const vars = extractVars(p.system, p.user); s.cases.forEach(c => { c.vars = Object.fromEntries(vars.map(v => [v, c.vars?.[v] || ''])); }); }
      saveS(s); draw();
    }),
    on(root, 'input', '[data-case][data-k]', (e, el) => { caseOf(el)[el.dataset.k] = el.value; persist(); }),
    on(root, 'input', '[data-case][data-var]', (e, el) => { const c = caseOf(el); c.vars = { ...(c.vars || {}), [el.dataset.var]: el.value }; persist(); }),
    on(root, 'input', 'input[data-ak]', (e, el) => { caseOf(el).assertions[Number(el.dataset.a)].value = el.value; persist(); }),
    on(root, 'change', 'select[data-ak]', (e, el) => { caseOf(el).assertions[Number(el.dataset.a)].type = el.value; saveS(s); draw(); }),
    on(root, 'click', '[data-add-a]', (e, b) => { const c = s.cases.find(x => x.id === b.dataset.addA); c.assertions = [...(c.assertions || []), { type: 'contains', value: '' }]; saveS(s); draw(); }),
    on(root, 'click', '[data-del-a]', (e, b) => { const [cid, j] = b.dataset.delA.split(':'); s.cases.find(x => x.id === cid).assertions.splice(Number(j), 1); saveS(s); draw(); }),
    on(root, 'click', '[data-del-case]', (e, b) => { s.cases = s.cases.filter(c => c.id !== b.dataset.delCase); saveS(s); draw(); }),
    on(root, 'click', '[data-output]', (e, b) => {
      const c = s.cases.find(x => x.id === b.dataset.output);
      const block = (r, label) => html`${label ? html`<h3 class="section-title" style="margin:8px 0 10px">${label} <span class="badge ${r.pass ? 'good' : 'bad'}">${r.pass ? 'passed' : 'failed'}</span></h3>` : ''}
        ${r.error ? html`<div class="callout warn">${raw(icon('alert'))}<div>${r.error}</div></div>` : ''}
        ${(r.checks || []).map((x, j) => html`<div class="finding ${x.pass ? 'good' : 'warn'}" style="margin-bottom:6px">${raw(icon(x.pass ? 'checkCircle' : 'alert', 'ic'))}<div><b>${ASSERTION_TYPES.find(t => t.id === c.assertions[j]?.type)?.label || 'Check'}${c.assertions[j]?.value ? `: ${c.assertions[j].value}` : ''}</b><p>${x.reason}</p></div></div>`)}
        <div class="label" style="margin:16px 0 8px">Output</div><div class="card flat md">${raw(renderMarkdown(r.output || ''))}</div>`;
      const r = results[c.id]; const rb = compareTo && resultsB[c.id] && !resultsB[c.id].running ? resultsB[c.id] : null;
      openDrawer({ title: c.name, subtitle: rb ? html`<span class="badge">A/B comparison</span>` : html`<span class="badge ${r.pass ? 'good' : 'bad'}">${r.pass ? 'passed' : 'failed'}</span>`,
        body: rb ? html`<div class="ab-drawer">${block(r, 'A · current')}<hr class="divider">${block(rb, `B · ${versionLabel(compareTo)}`)}</div>` : block(r, '') });
    }),
    on(root, 'change', '[data-compare]', (e, el) => { compareTo = el.value; for (const k of Object.keys(resultsB)) delete resultsB[k]; draw(); }),
    on(root, 'click', '[data-act]', async (e, b) => {
      const act = b.dataset.act;
      if (act === 'gen-cases') {
        const p = prompt(); if (!p) return;
        const vars = extractVars(p.system, p.user);
        generating = true; draw();
        try {
          const r = await generateCases({ system: p.system, user: p.user, vars, count: Number($('[data-gen-count]', root)?.value || 6), model: s.model });
          for (const gc of r.cases) {
            const values = Object.fromEntries((gc.values || []).map(v => [v.name, v.value]));
            s.cases.push({ id: uid('c'), name: `${gc.kind}: ${gc.name}`, vars: Object.fromEntries(vars.map(v => [v, values[v] ?? ''])), assertions: [{ type: 'rubric', value: gc.expectation }] });
          }
          saveS(s); toast(`Added ${r.cases.length} cases. Review and edit them before relying on the suite.`);
        } catch (err) { toast(err.message, 'error'); }
        generating = false; draw();
        return;
      }
      if (act === 'run') runAll();
      else if (act === 'stop') ctrl?.abort();
      else if (act === 'add-case') {
        const p = prompt(); const vars = p ? extractVars(p.system, p.user) : [];
        s.cases.push({ id: uid('c'), name: `Case ${s.cases.length + 1}`, vars: Object.fromEntries(vars.map(v => [v, ''])), assertions: (s.cases.at(-1)?.assertions || []).map(a => ({ ...a })) });
        saveS(s); draw();
      } else if (act === 'export') {
        const p = prompt();
        download(`${slugify(s.name)}.promptfooconfig.yaml`, toPromptfooYaml({ name: s.name, system: p?.system, user: p?.user || '', model: s.model, cases: s.cases }), 'text/yaml');
      } else if (act === 'delete') {
        if (await confirmDialog(`Delete “${s.name}”?`, 'This removes the suite and its run history.', 'Delete', true)) { update('suites', l => l.filter(x => x.id !== s.id)); navigate('evals'); }
      }
    }),
  ];
  return () => { ctrl?.abort(); offs.forEach(o => o()); };
}

export default {
  title: 'Evals',
  async mount(root, { params }) {
    const cfg = await getConfig();
    const s = params[0] && getS(params[0]);
    if (params[0] && !s) { navigate('evals'); return null; }
    return s ? suiteView(root, s, cfg) : listView(root);
  },
};
