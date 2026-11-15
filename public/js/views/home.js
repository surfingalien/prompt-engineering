import { html, render, raw, on } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { state, createPrompt } from '../core/store.js';
import { navigate } from '../core/nav.js';
import { LEVELS, LESSONS, lessonsForLevel } from '../data/curriculum.js';
import { analyzePrompt } from '../lib/analyze.js';
import { analysisPanel, lockedNotice } from './shared.js';
import { getConfig } from '../core/api.js';
import { PACKS } from '../core/catalog.js';

const DEMO_BEFORE = 'write a blog post about our product';
const DEMO_AFTER = `You are a B2B content strategist.

<context>
We sell Ledgerly, invoicing software for freelance designers. Readers are designers who hate admin work. This post will be our launch announcement on the blog and in our newsletter.
</context>

<instructions>
Write a launch blog post that shows how Ledgerly turns a 30-minute invoicing chore into 2 minutes.
</instructions>

<success_criteria>
A great post: opens with a relatable pain point, shows one concrete before/after workflow, and ends with a single call to action.
</success_criteria>

<output_format>Markdown with a title and 3–4 short sections. 600–800 words.</output_format>`;

export default {
  title: 'Home',
  async mount(root) {
    const done = id => Boolean(state.progress[id]);
    const totalDone = LESSONS.filter(l => done(l.id)).length;
    const next = LESSONS.find(l => !done(l.id));
    const recent = [...state.prompts].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3);
    const before = analyzePrompt({ user: DEMO_BEFORE });
    const after = analyzePrompt({ user: DEMO_AFTER });
    const cfg = await getConfig();

    render(root, html`
      <section class="hero">
        <div class="eyebrow">Prompt engineering studio for Claude</div>
        <h1 class="hero-title">From your first prompt<br>to a production agent harness.</h1>
        <p class="hero-sub">Learn the principles, build prompts with guidance, test them against Claude, and ship the scaffolding that makes agents dependable. Everything in one calm workspace.</p>
        <div class="btn-row" style="margin-top:28px">
          <a class="btn btn-primary btn-lg" href="#/${next ? `learn/${next.id}` : 'learn'}">${raw(icon('learn'))}${totalDone ? 'Continue learning' : 'Start learning'}</a>
          <a class="btn btn-lg" href="#/build">${raw(icon('build'))}Build a prompt</a>
          <button class="btn btn-ghost btn-lg" data-act="blank">${raw(icon('workbench'))}Open a blank workbench</button>
        </div>
        ${cfg.ready ? '' : html`<div style="margin-top:24px;max-width:720px">${lockedNotice(cfg, 'Learning, building, the analyzer, the library and harness exports all still work.')}</div>`}
      </section>

      <section class="section">
        <div class="row between" style="margin-bottom:16px"><h2 class="section-title" style="margin:0">The path</h2><a href="#/learn" class="subtle">${totalDone} of ${LESSONS.length} lessons complete →</a></div>
        <div class="path">
          ${LEVELS.map(lv => {
            const ls = lessonsForLevel(lv.id);
            const n = ls.filter(l => done(l.id)).length;
            return html`<a class="card path-step lv-${lv.id}" href="#/learn?level=${lv.id}">
              <div class="path-num">${lv.n}</div>
              <div class="path-title">${lv.title}</div>
              <p class="muted" style="font-size:var(--fs-sm)">${lv.tagline}</p>
              <ul class="path-lessons">${ls.map(l => html`<li class="${done(l.id) ? 'done' : ''}">${raw(icon(done(l.id) ? 'checkCircle' : 'circle'))}${l.title}</li>`)}</ul>
              <div class="progress" style="margin-top:auto"><div style="width:${Math.round(100 * n / ls.length)}%"></div></div>
            </a>`;
          })}
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">See the difference</h2>
        <div class="grid grid-2 compare">
          <div class="card"><div class="card-head"><span class="badge bad">Before</span></div><pre class="code" tabindex="0" style="min-height:80px">${DEMO_BEFORE}</pre><div style="margin-top:16px">${analysisPanel(before, { compact: true, limit: 3 })}</div></div>
          <div class="card"><div class="card-head"><span class="badge good">After</span><button class="btn btn-sm" data-act="demo">${raw(icon('workbench'))}Open in workbench</button></div><pre class="code" tabindex="0" style="max-height:260px">${DEMO_AFTER}</pre><div style="margin-top:16px">${analysisPanel(after, { compact: true, limit: 3 })}</div></div>
        </div>
      </section>

      <section class="section">
        <div class="row between" style="margin-bottom:16px"><h2 class="section-title" style="margin:0">New skill collections</h2><a href="#/library" class="subtle">Browse the library →</a></div>
        <div class="grid grid-3">${PACKS.map(p => html`<a class="card feature" href="#/library?pack=${p.id}"><div class="feature-ic">${raw(icon(p.icon))}</div><div class="card-title">${p.title}</div><p class="muted" style="font-size:var(--fs-sm);margin-top:4px">${p.blurb}</p></a>`)}</div>
      </section>

      <section class="section">
        <h2 class="section-title">Everything you need, in order</h2>
        <div class="grid grid-3">
          ${[
            ['learn', 'Learn', 'Seventeen focused lessons, each with a before/after example and an exercise you run for real.', 'learn'],
            ['build', 'Build', 'Answer a few plain-language questions; get a structured, best-practice prompt with a live quality score.', 'build'],
            ['workbench', 'Test', 'Run against Claude with streaming, compare models or versions side by side, and track every revision.', 'workbench'],
            ['evals', 'Measure', 'Turn success criteria into test suites with code checks and Claude-graded rubrics. Export to promptfoo.', 'evals'],
            ['harness', 'Ship', 'Design an agent’s system prompt, CLAUDE.md, skills, subagents, tools and guardrails, then download the files.', 'harness'],
            ['library', 'Explore', '500+ curated skills, prompts, agents and techniques, searchable by domain and level.', 'library'],
          ].map(([ic, t, d, href]) => html`<a class="card feature" href="#/${href}"><div class="feature-ic">${raw(icon(ic))}</div><div class="card-title">${t}</div><p class="muted" style="font-size:var(--fs-sm);margin-top:4px">${d}</p></a>`)}
        </div>
      </section>

      ${recent.length ? html`<section class="section">
        <div class="row between" style="margin-bottom:16px"><h2 class="section-title" style="margin:0">Recent prompts</h2><a href="#/workbench" class="subtle">All prompts →</a></div>
        <div class="grid grid-3">${recent.map(p => html`<a class="card" href="#/workbench/${p.id}"><div class="card-title">${p.title}</div><p class="subtle" style="margin-top:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${(p.user || p.system).slice(0, 180) || 'Empty prompt'}</p></a>`)}</div>
      </section>` : ''}
    `);

    return on(root, 'click', '[data-act]', (e, b) => {
      if (b.dataset.act === 'blank') navigate(`workbench/${createPrompt().id}`);
      if (b.dataset.act === 'demo') navigate(`workbench/${createPrompt({ title: 'Launch blog post', user: DEMO_AFTER, source: 'home demo' }).id}`);
    });
  },
};
