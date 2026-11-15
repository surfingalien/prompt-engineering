import { html, render, raw, on, debounce, $ } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { state, update, createPrompt } from '../core/store.js';
import { navigate } from '../core/nav.js';
import { copyText, toast } from '../core/ui.js';
import { BLUEPRINTS, FIELDS, blueprintById } from '../data/blueprints.js';
import { composePrompt, toPlainText } from '../lib/compose.js';
import { analyzePrompt } from '../lib/analyze.js';
import { analysisPanel, codeBlock, pageHead, levelBadge } from './shared.js';

const PRO_ORDER = ['task', 'why', 'audience', 'documents', 'format', 'role', 'context', 'tone', 'length', 'constraints', 'examples', 'success'];

export default {
  title: 'Prompt builder',
  mount(root) {
    const draft = state.builder || { blueprint: 'write', mode: 'guided', fields: {} };
    const save = debounce(() => update('builder', () => draft), 300);

    function fieldsHtml() {
      const bp = blueprintById(draft.blueprint);
      const keys = PRO_ORDER.filter(k => draft.mode === 'pro' || FIELDS[k].guided);
      return html`
        ${keys.map(k => {
          const f = FIELDS[k];
          const label = bp.asSystem && k === 'task' ? 'What does the agent do?' : f.label;
          const val = draft.fields[k] || '';
          const ex = bp.example[k];
          return html`<label class="field">
            <span class="label">${label}${['task'].includes(k) ? '' : html`<span class="opt">optional</span>`}</span>
            ${f.input
              ? html`<input class="input" data-field="${k}" value="${val}" placeholder="${ex || ''}">`
              : html`<textarea class="textarea ${f.mono ? 'mono' : ''}" rows="${f.rows}" data-field="${k}" placeholder="${ex || ''}">${val}</textarea>`}
            <span class="help">${f.help}</span>
          </label>`;
        })}
        ${draft.mode === 'pro' ? html`
          <div class="field"><span class="label">Safeguards & reasoning</span>
            <label class="check"><input type="checkbox" data-flag="untrusted" ${draft.fields.untrusted ? raw('checked') : ''}><span>The material comes from outside sources. Treat it as data, never as instructions (prompt-injection defense)</span></label>
            <label class="check"><input type="checkbox" data-flag="uncertainty" ${draft.fields.uncertainty ? raw('checked') : ''}><span>Say so when information is missing instead of guessing</span></label>
            <label class="check"><input type="checkbox" data-flag="reasoning" ${draft.fields.reasoning === 'deep' ? raw('checked') : ''}><span>This is a hard problem: consider alternatives and check the work (pair with high effort)</span></label>
          </div>` : html`<div class="callout" style="margin-top:20px">${raw(icon('info'))}<div>Switch to <b>Pro</b> for role, tone, examples, success criteria and safeguards.</div></div>`}`;
    }

    function preview() {
      const bp = blueprintById(draft.blueprint);
      const composed = composePrompt(draft.fields, { asSystemPrompt: bp.asSystem });
      const a = analyzePrompt(composed);
      const empty = !composed.system && !composed.user;
      render($('#bp-preview', root), html`
        <div class="card" style="padding:0;overflow:hidden">
          <div class="preview-head row between"><span class="label">Composed prompt</span>
            <div class="btn-row"><button class="btn btn-sm" data-act="copy" ${empty ? raw('disabled') : ''}>${raw(icon('copy'))}Copy</button>
            <button class="btn btn-sm btn-primary" data-act="open" ${empty ? raw('disabled') : ''}>${raw(icon('workbench'))}Open in workbench</button></div></div>
          <div style="padding:16px">
            ${empty ? html`<div class="empty" style="padding:32px 16px"><h3>Your prompt appears here</h3><p>Answer the questions on the left, or load the example.</p></div>` : html`
              ${composed.system ? html`<div class="subtle" style="margin-bottom:6px">System prompt</div>${codeBlock(composed.system, { copy: false })}` : ''}
              ${composed.user ? html`<div class="subtle" style="margin:${composed.system ? '14px' : '0'} 0 6px">User message</div>${codeBlock(composed.user, { copy: false })}` : ''}`}
          </div>
        </div>
        <div class="card" style="margin-top:16px">${analysisPanel(a, { limit: 5 })}</div>`);
    }

    function draw() {
      const bp = blueprintById(draft.blueprint);
      render(root, html`
        ${pageHead({ eyebrow: 'Prompt builder', title: 'Build a prompt, step by step', desc: 'Pick what you’re doing, answer in plain language, and watch a structured prompt take shape with a live quality score.' })}
        <div class="bp-picker" role="radiogroup" aria-label="Task type">
          ${BLUEPRINTS.map(b => html`<button class="bp ${b.id === draft.blueprint ? 'active' : ''}" role="radio" aria-checked="${b.id === draft.blueprint}" data-bp="${b.id}">${raw(icon(b.icon))}<span class="bp-t">${b.title}</span><span class="bp-d">${b.desc}</span></button>`)}
        </div>
        <div class="split">
          <section class="card">
            <div class="row between wrap" style="margin-bottom:18px;gap:12px">
              <div class="row" style="gap:10px"><h2 style="font:500 var(--fs-lg) var(--font-serif)">${bp.title}</h2>${levelBadge(bp.level)}</div>
              <div class="row" style="gap:8px">
                <div class="seg" role="group" aria-label="Mode"><button data-mode="guided" aria-pressed="${draft.mode === 'guided'}">Guided</button><button data-mode="pro" aria-pressed="${draft.mode === 'pro'}">Pro</button></div>
                <button class="btn btn-sm" data-act="example">${raw(icon('sparkle'))}Load example</button>
                <button class="btn btn-sm btn-ghost" data-act="clear">Clear</button>
              </div>
            </div>
            <div id="bp-fields">${fieldsHtml()}</div>
          </section>
          <aside class="sticky-col" id="bp-preview"></aside>
        </div>`);
      preview();
    }

    draw();
    const refresh = debounce(preview, 120);
    const offs = [
      on(root, 'input', '[data-field]', (e, el) => { draft.fields[el.dataset.field] = el.value; save(); refresh(); }),
      on(root, 'change', '[data-flag]', (e, el) => {
        const k = el.dataset.flag;
        draft.fields[k] = k === 'reasoning' ? (el.checked ? 'deep' : '') : el.checked;
        save(); preview();
      }),
      on(root, 'click', '[data-bp]', (e, b) => { draft.blueprint = b.dataset.bp; save(); draw(); }),
      on(root, 'click', '[data-mode]', (e, b) => { draft.mode = b.dataset.mode; save(); draw(); }),
      on(root, 'click', '[data-act]', (e, b) => {
        const bp = blueprintById(draft.blueprint);
        const act = b.dataset.act;
        if (act === 'example') {
          draft.fields = { ...bp.example };
          if (Object.keys(bp.example).some(k => FIELDS[k] && !FIELDS[k].guided) || bp.example.untrusted) draft.mode = 'pro';
          save(); draw(); toast('Example loaded. Edit anything.');
        } else if (act === 'clear') { draft.fields = {}; save(); draw(); }
        else if (act === 'copy') copyText(toPlainText(composePrompt(draft.fields, { asSystemPrompt: bp.asSystem })), 'Prompt copied');
        else if (act === 'open') {
          const c = composePrompt(draft.fields, { asSystemPrompt: bp.asSystem });
          const title = (draft.fields.task || bp.title).split('\n')[0].slice(0, 60);
          const p = createPrompt({ title, system: c.system, user: c.user || (bp.asSystem ? 'Hi! What can you help me with?' : ''), source: `builder:${bp.id}` });
          navigate(`workbench/${p.id}`);
        }
      }),
    ];
    return () => offs.forEach(f => f());
  },
};
