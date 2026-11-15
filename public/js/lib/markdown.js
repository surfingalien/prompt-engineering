// Small, safe Markdown renderer for model output. Everything is HTML-escaped
// first; only a fixed set of constructs is turned back into markup, and links
// are restricted to http(s). Good enough for chat output — not CommonMark.

import { escapeHtml } from './escape.js';

function inline(s) {
  return s
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>')
    .replace(/(^|[^_\w])_([^_\n]+)_(?!\w)/g, '$1<em>$2</em>')
    .replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

export function renderMarkdown(src) {
  const text = escapeHtml(String(src ?? '').replace(/\r\n?/g, '\n'));
  const out = [];
  const linesArr = text.split('\n');
  let i = 0;
  while (i < linesArr.length) {
    const line = linesArr[i];
    const fence = /^```\s*([\w+-]*)\s*$/.exec(line);
    if (fence) {
      const body = [];
      i++;
      while (i < linesArr.length && !/^```\s*$/.test(linesArr[i])) body.push(linesArr[i++]);
      i++;
      out.push(`<pre class="md-code"${fence[1] ? ` data-lang="${fence[1]}"` : ''}><code>${body.join('\n')}</code></pre>`);
      continue;
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) { out.push(`<h${h[1].length + 2} class="md-h">${inline(h[2])}</h${h[1].length + 2}>`); i++; continue; }
    if (/^\s*(---|\*\*\*)\s*$/.test(line)) { out.push('<hr>'); i++; continue; }
    if (/^&gt;\s?/.test(line)) {
      const q = [];
      while (i < linesArr.length && /^&gt;\s?/.test(linesArr[i])) q.push(linesArr[i++].replace(/^&gt;\s?/, ''));
      out.push(`<blockquote>${inline(q.join('<br>'))}</blockquote>`);
      continue;
    }
    if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < linesArr.length && /^\s*\|[\s:|-]+\|\s*$/.test(linesArr[i + 1])) {
      const row = l => l.trim().replace(/^\||\|$/g, '').split('|').map(c => inline(c.trim()));
      const head = row(line); i += 2;
      const rows = [];
      while (i < linesArr.length && /^\s*\|.*\|\s*$/.test(linesArr[i])) rows.push(row(linesArr[i++]));
      out.push(`<div class="md-table"><table><thead><tr>${head.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    const li = /^\s*([-*+]|\d+[.)])\s+/;
    if (li.test(line)) {
      const ordered = /^\s*\d/.test(line);
      const items = [];
      while (i < linesArr.length && li.test(linesArr[i])) items.push(inline(linesArr[i++].replace(li, '')));
      out.push(`<${ordered ? 'ol' : 'ul'}>${items.map(x => `<li>${x}</li>`).join('')}</${ordered ? 'ol' : 'ul'}>`);
      continue;
    }
    if (!line.trim()) { i++; continue; }
    const para = [];
    while (i < linesArr.length && linesArr[i].trim() && !/^(```|#{1,4}\s|\s*([-*+]|\d+[.)])\s|&gt;)/.test(linesArr[i])) para.push(linesArr[i++]);
    if (!para.length) para.push(linesArr[i++]);
    out.push(`<p>${inline(para.join('<br>'))}</p>`);
  }
  return out.join('\n');
}
