// Client-side catalog search: weighted token matching with facet filters.
// ~1k items, so a precomputed lowercase haystack beats any index structure.

export function prepare(items) {
  return items.map(it => ({
    it,
    title: (it.title || '').toLowerCase(),
    meta: `${it.domain || ''} ${it.kind || ''} ${it.source || ''} ${(it.tags || []).join(' ')}`.toLowerCase(),
    summary: (it.summary || '').toLowerCase(),
    body: (it.body || '').toLowerCase(),
  }));
}

const tokenize = q => String(q || '').toLowerCase().split(/[^a-z0-9+#.]+/).filter(t => t.length > 1);

/**
 * @param {ReturnType<typeof prepare>} index
 * @param {string} query
 * @param {{kind?:string, domain?:string, level?:string, ids?:Set<string>}} [filters]
 */
export function search(index, query, filters = {}) {
  const terms = tokenize(query);
  const phrase = String(query || '').toLowerCase().trim();
  const out = [];
  for (const row of index) {
    const { it } = row;
    if (filters.kind && filters.kind !== 'all' && it.kind !== filters.kind) continue;
    if (filters.domain && filters.domain !== 'all' && it.domain !== filters.domain) continue;
    if (filters.level && filters.level !== 'all' && it.level !== filters.level) continue;
    if (filters.ids && !filters.ids.has(it.id)) continue;
    let score = 0;
    if (terms.length) {
      let matched = 0;
      for (const t of terms) {
        let s = 0;
        if (row.title.includes(t)) s += row.title.startsWith(t) ? 12 : 8;
        if (row.meta.includes(t)) s += 4;
        if (row.summary.includes(t)) s += 3;
        if (row.body.includes(t)) s += 1;
        if (s) matched++;
        score += s;
      }
      if (matched < terms.length) continue; // every term must hit somewhere
      if (phrase.length > 3 && row.title.includes(phrase)) score += 20;
    }
    out.push({ item: it, score });
  }
  if (terms.length) out.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));
  return out.map(r => r.item);
}
