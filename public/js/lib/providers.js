// ─── Who serves a model? ─────────────────────────────────────────────────────
// Maps a PromptForge model entry (Claude, or a "gw:<upstream>" gateway model)
// to the provider behind it, for logos and labels. Gateways name models as
// "provider/model" (OmniRoute: "groq/llama-3.3-70b-versatile") or by family
// only ("llama-3.3-70b"), so both the prefix and the model family are checked.
// Logos live in /img/logos (from homarr-labs/dashboard-icons, Apache-2.0).
//
// Pure — unit tested in Node.

export const PROVIDERS = {
  anthropic: { label: 'Anthropic', logo: 'claude-ai', light: true },
  google: { label: 'Google', logo: 'google-gemini' },
  groq: { label: 'Groq' },
  cerebras: { label: 'Cerebras' },
  openrouter: { label: 'OpenRouter' },
  nvidia: { label: 'NVIDIA', logo: 'nvidia' },
  cloudflare: { label: 'Cloudflare', logo: 'cloudflare' },
  mistral: { label: 'Mistral AI', logo: 'mistral-ai' },
  deepseek: { label: 'DeepSeek', logo: 'deepseek' },
  qwen: { label: 'Qwen', logo: 'qwen' },
  meta: { label: 'Meta Llama', logo: 'meta' },
  openai: { label: 'OpenAI', logo: 'openai', light: true },
  xai: { label: 'xAI', logo: 'grok' },
  github: { label: 'GitHub Models', logo: 'github', light: true },
  huggingface: { label: 'Hugging Face', logo: 'hugging-face' },
  ollama: { label: 'Ollama', logo: 'ollama' },
  perplexity: { label: 'Perplexity', logo: 'perplexity', light: true },
  cohere: { label: 'Cohere' },
  together: { label: 'Together AI' },
  fireworks: { label: 'Fireworks AI' },
};

// Route prefixes gateways use, mapped to a provider id.
const PREFIX = {
  anthropic: 'anthropic', claude: 'anthropic',
  gemini: 'google', google: 'google', 'google-ai': 'google', vertex: 'google', gemma: 'google',
  groq: 'groq', cerebras: 'cerebras', openrouter: 'openrouter', or: 'openrouter',
  nvidia: 'nvidia', nim: 'nvidia', 'nvidia-nim': 'nvidia',
  cloudflare: 'cloudflare', cf: 'cloudflare', 'workers-ai': 'cloudflare', '@cf': 'cloudflare',
  mistral: 'mistral', mistralai: 'mistral', deepseek: 'deepseek', 'deepseek-ai': 'deepseek',
  qwen: 'qwen', alibaba: 'qwen', meta: 'meta', 'meta-llama': 'meta', llama: 'meta',
  openai: 'openai', xai: 'xai', 'x-ai': 'xai', grok: 'xai',
  github: 'github', gh: 'github', 'github-models': 'github',
  huggingface: 'huggingface', hf: 'huggingface', ollama: 'ollama',
  perplexity: 'perplexity', pplx: 'perplexity', cohere: 'cohere',
  together: 'together', togetherai: 'together', fireworks: 'fireworks', 'fireworks-ai': 'fireworks',
};

// Model families, checked when no route prefix matched.
const FAMILY = [
  [/\bclaude\b/, 'anthropic'],
  [/\b(gemini|gemma)/, 'google'],
  [/\b(llama|codellama)/, 'meta'],
  [/\b(mistral|mixtral|codestral|ministral|magistral|devstral|pixtral)/, 'mistral'],
  [/\bdeepseek/, 'deepseek'],
  [/\b(qwen|qwq)/, 'qwen'],
  [/\b(gpt|o[1-9](-|$)|chatgpt)/, 'openai'],
  [/\bgrok/, 'xai'],
  [/\bnemotron/, 'nvidia'],
  [/\b(command-r|command-a|aya)/, 'cohere'],
  [/\bsonar/, 'perplexity'],
];

const entry = id => ({ id, ...PROVIDERS[id] });

/**
 * Provider behind a model.
 * @param {{id:string, provider?:string}|string} model  a model entry or id
 * @param {string} [gatewayName]  label for gateway-routed "auto" models
 * @returns {{id:string, label:string, logo?:string, light?:boolean, router?:boolean}}
 */
export function providerOf(model, gatewayName = 'Gateway') {
  const id = typeof model === 'string' ? model : model?.id || '';
  if (!id.startsWith('gw:')) return entry('anthropic');
  const upstream = id.slice(3).toLowerCase();
  // "auto", "auto:fast", "auto/coding": the gateway picks the provider per request.
  if (/^auto([:/].*)?$/.test(upstream)) return { id: 'router', label: gatewayName, router: true };
  const parts = upstream.split('/');
  for (const p of parts.slice(0, -1)) if (PREFIX[p]) return entry(PREFIX[p]);
  for (const [re, pid] of FAMILY) if (re.test(upstream)) return entry(pid);
  return { id: 'other', label: parts.length > 1 ? parts[0] : 'Other' };
}

/** Logo file paths for a provider (or MCP server) logo name. */
export function logoPaths(logo, light) {
  if (!logo) return null;
  return { light: `/img/logos/${logo}.svg`, dark: `/img/logos/${logo}${light ? '-light' : ''}.svg` };
}

/** One- or two-letter monogram for providers without a logo. */
export function monogram(label) {
  const words = String(label || '?').replace(/[^\p{L}\p{N} ]/gu, ' ').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '?';
  return (words.length > 1 ? words[0][0] + words[1][0] : words[0].slice(0, 2)).toUpperCase();
}

/** Group gateway models by provider: [{provider, models:[...]}], largest first. */
export function groupByProvider(models, gatewayName) {
  const groups = new Map();
  for (const m of models) {
    const p = providerOf(m, gatewayName);
    if (!groups.has(p.id)) groups.set(p.id, { provider: p, models: [] });
    groups.get(p.id).models.push(m);
  }
  return [...groups.values()].sort((a, b) => (a.provider.router ? -1 : b.provider.router ? 1 : b.models.length - a.models.length));
}
