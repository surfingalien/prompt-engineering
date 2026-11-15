// Opens a share link (#/import?d=…): preview first, save only on request.
import { html, render, raw, on } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { createPrompt, update } from '../core/store.js';
import { uid } from '../core/dom.js';
import { navigate } from '../core/nav.js';
import { toast } from '../core/ui.js';
import { decodeShare } from '../lib/share.js';
import { analyzePrompt } from '../lib/analyze.js';
import { harnessFiles, readiness } from '../lib/harness.js';
import { EMPTY_HARNESS } from '../data/harness-templates.js';
import { codeBlock, pageHead, ring } from './shared.js';

export default {
  title: 'Shared item',
  async mount(root, { query }) {
    let item;
    try { item = await decodeShare(query.d || ''); }
    catch (e) {
      render(root, html`${pageHead({ eyebrow: 'Share link', title: 'This link could not be opened' })}<div class="empty"><h3>${e.message}</h3><p>Ask the sender to copy the full link again.</p><a class="btn" href="#/home">Go home</a></div>`);
      return null;
    }
    const isPrompt = item.kind === 'prompt';
    const a = isPrompt ? analyzePrompt(item) : null;
    const h = isPrompt ? null : { ...EMPTY_HARNESS(), ...item.harness };
    render(root, html`
      ${pageHead({ eyebrow: 'Shared with you', title: isPrompt ? item.title : h.name, desc: 'Someone shared this through a PromptForge link. Nothing is saved until you choose to. Read it before you use it.' })}
      <div class="callout" style="margin-bottom:20px">${raw(icon('shield'))}<div>Shared content came from outside your workspace. Review it as you would any prompt from the internet before running it, especially anything that uses tools.</div></div>
      ${isPrompt ? html`
        <div class="grid" style="grid-template-columns:minmax(0,1fr) 300px;align-items:start">
          <div class="stack">
            ${item.system ? html`<div class="label">System prompt</div>${codeBlock(item.system, { copy: false })}` : ''}
            <div class="label">User message</div>${codeBlock(item.user || '(empty)', { copy: false })}
          </div>
          <div class="card row" style="gap:14px">${ring(a.score)}<div><b>${a.grade}</b><div class="subtle">${a.words} words · ${a.vars.length} variables</div></div></div>
        </div>`
      : html`
        <div class="grid" style="grid-template-columns:minmax(0,1fr) 300px;align-items:start">
          <div class="stack">
            <div class="label">Mission</div>${codeBlock(h.mission || '(empty)', { copy: false })}
            <div class="label">Files it will generate</div>
            <ul class="checklist">${harnessFiles(h).map(f => html`<li>${raw(icon('file'))}<code>${f.path}</code></li>`)}</ul>
          </div>
          <div class="card row" style="gap:14px">${ring(readiness(h).score)}<div><b>Readiness</b><div class="subtle">${h.tools.length} tools · ${h.subagents.length} subagents · ${h.evals.length} evals</div></div></div>
        </div>`}
      <div class="btn-row" style="margin-top:24px">
        <button class="btn btn-primary" data-act="save">${raw(icon('save'))}Save to my workspace</button>
        <a class="btn btn-ghost" href="#/home">Don’t save</a>
      </div>`);
    return on(root, 'click', '[data-act="save"]', () => {
      if (isPrompt) {
        const p = createPrompt({ title: item.title, system: item.system, user: item.user, source: 'share link' });
        toast('Saved to your workspace'); navigate(`workbench/${p.id}`);
      } else {
        const nh = { ...h, id: uid('h'), updatedAt: Date.now() };
        update('harnesses', list => [nh, ...list]);
        toast('Saved to your workspace'); navigate(`harness/${nh.id}`);
      }
    });
  },
};
