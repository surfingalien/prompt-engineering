// Shared view widgets: score ring, analyzer panel, level badge, code block.
import { html, raw, highlightPrompt } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { scoreColor } from '../core/ui.js';
import { levelLabel } from '../core/catalog.js';

export const levelBadge = level => html`<span class="badge lv-${level}">${levelLabel(level)}</span>`;

export function ring(score, size = '') {
  return html`<div class="ring ${size}" style="--p:${score};--c:${raw(scoreColor(score))}" role="img" aria-label="Score ${score} of 100"><span>${score}</span></div>`;
}

const DIM_LABEL = { clarity: 'Clarity', context: 'Context', structure: 'Structure', specificity: 'Specificity', output: 'Output', robustness: 'Robustness' };
const SEV_ICON = { warn: 'alert', tip: 'bulb', good: 'checkCircle', info: 'info' };

export function analysisPanel(a, { compact = false, limit = 8 } = {}) {
  const items = a.findings.slice(0, limit);
  return html`
    <div class="row" style="gap:16px;align-items:center">
      ${ring(a.score)}
      <div style="min-width:0">
        <div style="font:500 1.05rem var(--font-serif)">${a.grade}</div>
        <div class="subtle">${a.words} words · ~${a.tokens.toLocaleString()} tokens${a.vars.length ? ` · ${a.vars.length} variable${a.vars.length > 1 ? 's' : ''}` : ''}</div>
      </div>
    </div>
    ${compact ? '' : html`<div class="bars" style="margin-top:16px">${Object.entries(a.dimensions).map(([k, v]) => html`
      <div class="bar"><span>${DIM_LABEL[k]}</span><div class="track"><div class="fill" style="width:${v}%;background:${raw(scoreColor(v))}"></div></div><span class="val">${v}</span></div>`)}</div>`}
    <div class="findings" style="margin-top:16px">${items.map(f => html`
      <div class="finding ${f.severity}">${raw(icon(SEV_ICON[f.severity], 'ic'))}<div><b>${f.title}</b><p>${f.detail}</p>${f.fix ? html`<p class="fix">${f.fix}</p>` : ''}</div></div>`)}
    </div>`;
}

export function codeBlock(text, { highlight = true, copy = true, label = '' } = {}) {
  return html`<div class="code-wrap">
    ${copy ? html`<button class="btn btn-sm copy-btn" data-copy="${text}" aria-label="Copy ${label}">${raw(icon('copy'))}Copy</button>` : ''}
    <pre class="code">${highlight ? highlightPrompt(text) : text}</pre></div>`;
}

export function pageHead({ eyebrow, title, desc, actions = '' }) {
  return html`<header class="page-head"><div>${eyebrow ? html`<div class="eyebrow">${eyebrow}</div>` : ''}<h1 class="page-title">${title}</h1>${desc ? html`<p class="page-desc">${desc}</p>` : ''}</div>${actions ? html`<div class="page-actions">${actions}</div>` : ''}</header>`;
}
