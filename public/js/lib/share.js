// ─── Share links ─────────────────────────────────────────────────────────────
// A prompt or harness is compressed (deflate) into the URL itself:
//   https://host/#/import?d=<base64url>
// Nothing is uploaded: the link IS the data, and whoever opens it sees a
// preview and decides whether to save it. Decoding validates the shape and
// keeps only known fields, so a crafted link can't inject arbitrary state.

const MAX_CHARS = 200_000;

function toBase64Url(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromBase64Url(s) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
async function pipe(bytes, stream) {
  const res = new Response(new Blob([bytes]).stream().pipeThrough(stream));
  return new Uint8Array(await res.arrayBuffer());
}

const str = (v, max = 100_000) => (typeof v === 'string' ? v.slice(0, max) : '');
const arr = (v, max = 50) => (Array.isArray(v) ? v.slice(0, max) : []);

/** Keep only the fields we know, with the types we expect. */
export function sanitize(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('Not a PromptForge share link.');
  if (payload.k === 'prompt') {
    const vars = payload.vars && typeof payload.vars === 'object' ? Object.fromEntries(Object.entries(payload.vars).slice(0, 50).map(([k, v]) => [str(k, 80), str(v, 20_000)])) : {};
    return { kind: 'prompt', title: str(payload.title, 200) || 'Shared prompt', system: str(payload.system), user: str(payload.user), vars };
  }
  if (payload.k === 'harness') {
    const h = payload.h || {};
    const proj = h.project || {};
    return {
      kind: 'harness',
      harness: {
        name: str(h.name, 200) || 'Shared harness', model: str(h.model, 60), effort: str(h.effort, 20), mission: str(h.mission), finish: str(h.finish, 20_000),
        project: { overview: str(proj.overview, 20_000), commands: str(proj.commands, 20_000), conventions: str(proj.conventions, 20_000), boundaries: str(proj.boundaries, 20_000) },
        skills: arr(h.skills).map(x => ({ name: str(x?.name, 200), description: str(x?.description, 1024), body: str(x?.body) })),
        subagents: arr(h.subagents).map(x => ({ name: str(x?.name, 200), description: str(x?.description, 1024), tools: str(x?.tools, 500), model: str(x?.model, 40), prompt: str(x?.prompt) })),
        tools: arr(h.tools).map(x => ({ name: str(x?.name, 120), description: str(x?.description, 5000), params: arr(x?.params, 30).map(pr => ({ name: str(pr?.name, 80), type: ['string', 'integer', 'number', 'boolean'].includes(pr?.type) ? pr.type : 'string', description: str(pr?.description, 1000) })) })),
        guardrails: Object.fromEntries(Object.entries(h.guardrails && typeof h.guardrails === 'object' ? h.guardrails : {}).slice(0, 20).map(([k, v]) => [str(k, 40), v === true])),
        evals: arr(h.evals, 100).map(x => ({ input: str(x?.input, 20_000), expect: str(x?.expect, 2000) })),
      },
    };
  }
  throw new Error('Unknown share link type.');
}

export async function encodeShare(payload) {
  const json = new TextEncoder().encode(JSON.stringify(payload));
  return toBase64Url(await pipe(json, new CompressionStream('deflate-raw')));
}

export async function decodeShare(data) {
  if (typeof data !== 'string' || !data || data.length > MAX_CHARS || !/^[\w-]+$/.test(data)) throw new Error('This share link is malformed or too long.');
  let text;
  try { text = new TextDecoder().decode(await pipe(fromBase64Url(data), new DecompressionStream('deflate-raw'))); }
  catch { throw new Error('This share link is corrupted or incomplete. Was it cut off when copied?'); }
  let obj;
  try { obj = JSON.parse(text); } catch { throw new Error('This share link does not contain valid data.'); }
  return sanitize(obj);
}

// Variable values are deliberately left out: they often hold private data.
export const sharePrompt = p => ({ k: 'prompt', v: 1, title: p.title, system: p.system, user: p.user });
export function shareHarness(h) {
  const { id, updatedAt, ...rest } = h;
  return { k: 'harness', v: 1, h: rest };
}
