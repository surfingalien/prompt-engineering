// Shared view widgets: score ring, analyzer panel, level badge, code block.
import { html, raw, highlightPrompt } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { scoreColor } from '../core/ui.js';
import { levelLabel } from '../core/catalog.js';
import { providerOf, logoPaths, monogram } from '../lib/providers.js';

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
    <pre class="code" tabindex="0">${highlight ? highlightPrompt(text) : text}</pre></div>`;
}

const LOCKED_TEXT = {
  no_key: 'This server has no shared Claude key, so live runs are off.',
  password: 'This server’s shared key is protected by an access password.',
  budget: 'Today’s shared budget on this server is used up (it resets at 00:00 UTC).',
  quota: 'Today’s free-model quota on this server is used up (it resets at 00:00 UTC).',
};

const isFree = m => m && m.provider === 'gateway';

/**
 * <option>s for a model picker, grouped by provider when there is more than
 * one ("Claude" and the free gateway). `long` adds each model's blurb.
 */
export function modelOptions(cfg, selected, { long = false, models = cfg.models } = {}) {
  const opt = m => html`<option value="${m.id}" ${m.id === selected ? raw('selected') : ''}>${long ? m.label : m.short || m.label}${isFree(m) ? ' · free' : ''}${long && m.blurb ? ` — ${m.blurb}` : ''}</option>`;
  const claude = models.filter(m => !isFree(m));
  const free = models.filter(isFree);
  if (!claude.length || !free.length) return models.map(opt);
  const freeGroup = html`<optgroup label="${`Free models (${cfg.gateway?.name || 'gateway'})`}">${free.map(opt)}</optgroup>`;
  const claudeGroup = html`<optgroup label="Claude">${claude.map(opt)}</optgroup>`;
  return cfg.via === 'gateway' ? [freeGroup, claudeGroup] : [claudeGroup, freeGroup];
}

/** True when `id` is a free gateway model (effort and thinking are Claude-only). */
export const isGatewayModel = id => typeof id === 'string' && id.startsWith('gw:');

/** Why live runs are unavailable, and the fix. Empty when runs are available. */
export function lockedNotice(cfg, extra = '') {
  if (cfg.ready) return '';
  const why = LOCKED_TEXT[cfg.lockedReason] || LOCKED_TEXT.no_key;
  const fix = cfg.lockedReason === 'password' ? 'Enter the password, or add your own Anthropic API key, in Settings.' : 'Add your own Anthropic API key in Settings to run prompts.';
  return html`<div class="callout warn locked-notice">${raw(icon('lock'))}<div>${why} ${fix}${extra ? html` ${extra}` : ''} <button class="btn btn-sm" data-action="settings" style="margin-left:6px">Open settings</button></div></div>`;
}

export function pageHead({ eyebrow, title, desc, actions = '' }) {
  return html`<header class="page-head"><div>${eyebrow ? html`<div class="eyebrow">${eyebrow}</div>` : ''}<h1 class="page-title">${title}</h1>${desc ? html`<p class="page-desc">${desc}</p>` : ''}</div>${actions ? html`<div class="page-actions">${actions}</div>` : ''}</header>`;
}

/**
 * A provider or MCP-server logo: the SVG from /img/logos (with its
 * light-colored variant on the dark theme), or a monogram when there is none.
 */
export function logoMark({ logo, light, label }, { size = 18, decorative = false } = {}) {
  const paths = logoPaths(logo, light);
  const name = label || 'Logo';
  // Decorative when the name is already written next to the logo.
  const a11y = decorative ? raw('aria-hidden="true"') : html`role="img" aria-label="${name}" title="${name}"`;
  if (!paths) return html`<span class="logo-mark mono" style="--s:${size}px" ${a11y}>${monogram(name)}</span>`;
  return html`<span class="logo-mark" style="--s:${size}px" ${a11y}><img class="lm-l" src="${paths.light}" alt="" width="${size}" height="${size}" loading="lazy">${light ? html`<img class="lm-d" src="${paths.dark}" alt="" width="${size}" height="${size}" loading="lazy">` : ''}</span>`;
}

/** Logo of the provider behind model `id` (Claude, or the gateway's upstream). */
export function providerMark(cfg, id, opts) {
  const model = (cfg.allModels || cfg.models || []).find(m => m.id === id) || { id };
  return logoMark(providerOf(model, cfg.gateway?.name || 'Gateway'), opts);
}
