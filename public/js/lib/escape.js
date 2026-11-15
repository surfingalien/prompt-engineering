// HTML escaping. Every string from data, users, or the model goes through
// this before touching innerHTML — the app never builds inline event handlers.
const MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => MAP[c]);
}
