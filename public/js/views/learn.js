import { html, render, raw, on } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { state, setLessonDone, createPrompt } from '../core/store.js';
import { navigate } from '../core/nav.js';
import { toast } from '../core/ui.js';
import { LEVELS, LESSONS, lessonById, lessonsForLevel } from '../data/curriculum.js';
import { analyzePrompt } from '../lib/analyze.js';
import { renderMarkdown } from '../lib/markdown.js';
import { ring, levelBadge, codeBlock, pageHead } from './shared.js';

function lessonIndex(root, query) {
  const done = id => Boolean(state.progress[id]);
  const total = LESSONS.filter(l => done(l.id)).length;
  render(root, html`
    ${pageHead({ eyebrow: 'Learning path', title: 'From first prompt to production harness', desc: 'Four levels, seventeen short lessons. Each teaches one principle with a real before-and-after, then hands you an exercise to run in the Workbench.' })}
    <div class="card sunken row wrap" style="gap:20px;margin-bottom:32px">
      <div style="flex:1;min-width:220px"><div class="label">Your progress</div><div class="progress" style="margin-top:10px"><div style="width:${Math.round(100 * total / LESSONS.length)}%"></div></div></div>
      <div class="subtle">${total} of ${LESSONS.length} lessons · ~${LESSONS.reduce((s, l) => s + l.minutes, 0)} minutes total</div>
    </div>
    ${LEVELS.map(lv => html`
      <section class="level-block" id="level-${lv.id}">
        <div class="level-head">
          <div class="level-num lv-${lv.id}">${lv.n}</div>
          <div><h2 class="section-title" style="margin:0">${lv.title}</h2><p class="muted">${lv.tagline}</p><p class="subtle" style="margin-top:4px">Outcome: ${lv.outcome}</p></div>
        </div>
        <div class="grid grid-2 lesson-grid">${lessonsForLevel(lv.id).map((l, i) => html`
          <a class="card lesson-card ${done(l.id) ? 'is-done' : ''}" href="#/learn/${l.id}">
            <div class="row between"><span class="subtle">Lesson ${lv.n}.${i + 1} · ${l.minutes} min</span>${done(l.id) ? html`<span class="badge good">${raw(icon('check'))}Done</span>` : ''}</div>
            <div class="card-title" style="margin-top:6px;font-size:var(--fs-md)">${l.title}</div>
            <p class="muted" style="font-size:var(--fs-sm);margin-top:4px">${l.summary}</p>
          </a>`)}</div>
      </section>`)}
  `);
  if (query.level) requestAnimationFrame(() => root.querySelector(`#level-${query.level}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
}

function promptPreview(p) {
  return [p.system && `[System]\n${p.system}`, p.user].filter(Boolean).join('\n\n[User]\n');
}

function lessonPage(root, lesson) {
  const idx = LESSONS.indexOf(lesson);
  const prev = LESSONS[idx - 1];
  const next = LESSONS[idx + 1];
  const lv = LEVELS.find(l => l.id === lesson.level);
  const nInLevel = lessonsForLevel(lesson.level).indexOf(lesson) + 1;
  const before = analyzePrompt(lesson.before);
  const after = analyzePrompt(lesson.after);
  const draw = () => {
    const done = Boolean(state.progress[lesson.id]);
    render(root, html`
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#/learn">Learning path</a><span>/</span><a href="#/learn?level=${lv.id}">Level ${lv.n} · ${lv.title}</a></nav>
      <article class="lesson">
        <header class="lesson-head">
          <div class="row wrap" style="gap:8px">${levelBadge(lesson.level)}<span class="subtle">Lesson ${lv.n}.${nInLevel} · ${lesson.minutes} min read</span></div>
          <h1 class="page-title" style="margin-top:12px">${lesson.title}</h1>
          <p class="page-desc">${lesson.summary}</p>
        </header>

        <div class="md lesson-body">${raw(renderMarkdown(lesson.body))}</div>

        <h2 class="section-title" style="margin-top:40px">Before and after</h2>
        <div class="grid grid-2">
          <div class="card flat"><div class="card-head"><span class="badge bad">Before</span>${lesson.scored === false ? '' : ring(before.score, 'sm')}</div>${codeBlock(promptPreview(lesson.before), { label: 'before prompt' })}</div>
          <div class="card flat"><div class="card-head"><span class="badge good">After</span>${lesson.scored === false ? '' : ring(after.score, 'sm')}</div>${codeBlock(promptPreview(lesson.after), { label: 'after prompt' })}</div>
        </div>
        <div class="callout accent" style="margin-top:16px">${raw(icon('bulb'))}<div><b>Why it’s better.</b> ${lesson.whyBetter}</div></div>

        <div class="grid grid-2" style="margin-top:32px;align-items:start">
          <div class="card">
            <div class="card-title">${raw(icon('checkCircle'))}Checklist</div>
            <ul class="checklist">${lesson.checklist.map(c => html`<li>${raw(icon('check'))}${c}</li>`)}</ul>
          </div>
          <div class="card exercise">
            <div class="eyebrow" style="margin:0">Exercise</div>
            <div class="card-title" style="font-size:var(--fs-md);margin-top:4px">${lesson.exercise.title}</div>
            <p class="muted" style="font-size:var(--fs-sm);margin-top:6px">${lesson.exercise.hint}</p>
            <p class="subtle" style="margin-top:6px">In the workbench, <b>Check my answer</b> has Claude grade your attempt against this lesson’s checklist.</p>
            <div class="btn-row" style="margin-top:16px">
              <button class="btn btn-primary" data-act="exercise">${raw(icon('workbench'))}Try it in the workbench</button>
              <button class="btn" data-act="after">Load the “after” example</button>
            </div>
          </div>
        </div>

        <footer class="lesson-foot">
          <button class="btn ${done ? '' : 'btn-dark'}" data-act="done">${raw(icon(done ? 'checkCircle' : 'check'))}${done ? 'Completed. Mark as not done' : 'Mark lesson complete'}</button>
          <div class="lesson-nav">
            ${prev ? html`<a class="btn btn-ghost" href="#/learn/${prev.id}">${raw(icon('arrowLeft'))}${prev.title}</a>` : ''}
            ${next ? html`<a class="btn" href="#/learn/${next.id}">${next.title}${raw(icon('arrowRight'))}</a>` : html`<a class="btn btn-primary" href="#/harness">Open the Harness studio${raw(icon('arrowRight'))}</a>`}
          </div>
        </footer>
      </article>`);
  };
  draw();
  return on(root, 'click', '[data-act]', (e, b) => {
    const act = b.dataset.act;
    if (act === 'done') {
      const wasDone = Boolean(state.progress[lesson.id]);
      setLessonDone(lesson.id, !wasDone);
      if (!wasDone) toast(next ? `Nice. Next up: ${next.title}` : 'You finished the whole path!');
      draw();
    } else if (act === 'exercise' || act === 'after') {
      const src = act === 'exercise' ? lesson.exercise : lesson.after;
      const p = createPrompt({ title: `${act === 'exercise' ? 'Exercise' : 'Example'}: ${lesson.exercise.title}`, system: src.system || '', user: src.user || '', source: `lesson:${lesson.id}` });
      navigate(`workbench/${p.id}?lesson=${lesson.id}`);
    }
  });
}

export default {
  title: 'Learn',
  mount(root, { params, query }) {
    const lesson = params[0] && lessonById(params[0]);
    if (params[0] && !lesson) { render(root, html`<div class="empty"><h3>Lesson not found</h3><a class="btn" href="#/learn">Back to the path</a></div>`); return null; }
    if (lesson) return lessonPage(root, lesson);
    lessonIndex(root, query);
    return null;
  },
};
