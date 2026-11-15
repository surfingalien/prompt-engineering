// ─── UI primitives: toast, drawer, dialogs, clipboard, download ─────────────
import { html, render, on, raw } from './dom.js';
import { icon } from './icons.js';

export function toast(message, type = 'ok') {
  const host = document.getElementById('toasts');
  const el = document.createElement('div');
  el.className = `toast ${type === 'error' ? 'error' : ''}`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  render(el, html`${raw(icon(type === 'error' ? 'alert' : 'check'))}<span>${message}</span>`);
  host.appendChild(el);
  while (host.children.length > 3) host.firstElementChild.remove();
  setTimeout(() => { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, type === 'error' ? 5200 : 2600);
}

export async function copyText(text, label = 'Copied to clipboard') {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
  }
  toast(label);
}

export function download(filename, data, type = 'text/plain') {
  const blob = data instanceof Blob ? data : new Blob([data], { type });
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: filename });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}

/**
 * Side drawer. `body` is an html template; `actions` are buttons rendered in
 * the footer: [{label, icon, primary, onClick}]. Returns { el, close }.
 */
export function openDrawer({ title, subtitle, body, actions = [], onClose }) {
  const dlg = document.createElement('dialog');
  dlg.className = 'drawer';
  dlg.setAttribute('aria-label', title);
  render(dlg, html`<div class="drawer-panel">
    <div class="drawer-head">
      <div style="flex:1;min-width:0">${subtitle ? html`<div class="row wrap" style="gap:6px;margin-bottom:8px">${subtitle}</div>` : ''}<h2>${title}</h2></div>
      <button class="btn btn-ghost btn-icon" data-close aria-label="Close">${raw(icon('x'))}</button>
    </div>
    <div class="drawer-body">${body}</div>
    ${actions.length ? html`<div class="drawer-foot">${actions.map((a, i) => html`<button class="btn ${a.primary ? 'btn-primary' : ''}" data-act="${i}">${a.icon ? raw(icon(a.icon)) : ''}${a.label}</button>`)}</div>` : ''}
  </div>`);
  document.body.appendChild(dlg);
  const close = () => { if (dlg.open) dlg.close(); };
  dlg.addEventListener('close', () => { dlg.remove(); onClose?.(); });
  dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
  on(dlg, 'click', '[data-close]', close);
  on(dlg, 'click', '[data-act]', (e, b) => actions[Number(b.dataset.act)].onClick?.({ close, el: dlg, button: b }));
  dlg.showModal();
  return { el: dlg, close };
}

/** Modal dialog with a form body; resolves with the action name or null. */
export function openModal({ title, body, actions = [{ id: 'ok', label: 'OK', primary: true }], onAction }) {
  return new Promise(resolve => {
    const dlg = document.createElement('dialog');
    dlg.className = 'modal';
    render(dlg, html`<form class="modal-panel" method="dialog">
      <h2>${title}</h2>
      <div class="stack" style="margin-top:12px">${body}</div>
      <div class="btn-row" style="justify-content:flex-end;margin-top:24px">
        <button class="btn btn-ghost" value="cancel" type="submit" formnovalidate>Cancel</button>
        ${actions.map(a => html`<button class="btn ${a.primary ? 'btn-primary' : ''} ${a.danger ? 'btn-danger' : ''}" value="${a.id}" type="submit">${a.label}</button>`)}
      </div>
    </form>`);
    document.body.appendChild(dlg);
    dlg.addEventListener('close', () => {
      const v = dlg.returnValue && dlg.returnValue !== 'cancel' ? dlg.returnValue : null;
      const form = dlg.querySelector('form');
      const data = Object.fromEntries(new FormData(form).entries());
      dlg.remove();
      if (v && onAction) onAction(v, data);
      resolve(v ? { action: v, data } : null);
    });
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close('cancel'); });
    dlg.showModal();
    dlg.querySelector('input, textarea, select')?.focus();
  });
}

export async function confirmDialog(title, message, label = 'Confirm', danger = false) {
  const r = await openModal({ title, body: html`<p class="muted">${message}</p>`, actions: [{ id: 'yes', label, primary: !danger, danger }] });
  return !!r;
}

export async function promptDialog(title, label, value = '', placeholder = '') {
  const r = await openModal({
    title,
    body: html`<label class="field"><span class="label">${label}</span><input class="input" name="value" value="${value}" placeholder="${placeholder}" autocomplete="off"></label>`,
    actions: [{ id: 'ok', label: 'Save', primary: true }],
  });
  return r ? String(r.data.value || '').trim() : null;
}

/** Build a share link for a payload and copy it. */
export async function shareLink(payload, what = 'Link') {
  const { encodeShare } = await import('../lib/share.js');
  const data = await encodeShare(payload);
  const url = `${location.origin}${location.pathname}#/import?d=${data}`;
  await copyText(url, `${what} copied. Anyone with the link can view and save a copy.`);
  if (url.length > 8000) toast('This link is long; some chat apps may cut it off. Export a file instead if it breaks.', 'error');
  return url;
}

export function scoreColor(score) {
  return score >= 85 ? 'var(--good)' : score >= 70 ? 'var(--lv-intermediate)' : score >= 45 ? 'var(--accent)' : 'var(--bad)';
}
