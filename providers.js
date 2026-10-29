// Multi-provider model routing.
//
// The browser and the Scout keep speaking the Anthropic Messages shape; this
// module translates at the edge so any OpenAI-compatible provider (OpenRouter,
// OpenAI, Groq, Mistral, Gemini, Ollama) can serve a request and the caller
// still gets an Anthropic-shaped response. API keys stay server-side.
//
// Model ids:
//   claude-sonnet-4-6                 → Anthropic (unchanged, backward compatible)
//   openrouter:google/gemini-2.5-pro  → <provider>:<provider-specific model>
//
// A provider is usable only when its key (or, for Ollama, base URL) is set in
// the server environment — clients can never point the server at a URL.

const MODEL_ID_RE = /^[A-Za-z0-9._:\/@-]{1,100}$/;

const PROVIDERS = {
  anthropic:  { label: 'Anthropic',  native: true, keyEnv: 'ANTHROPIC_API_KEY' },
  openrouter: { label: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1',                              keyEnv: 'OPENROUTER_API_KEY' },
  openai:     { label: 'OpenAI',     baseUrl: 'https://api.openai.com/v1',                                 keyEnv: 'OPENAI_API_KEY' },
  groq:       { label: 'Groq',       baseUrl: 'https://api.groq.com/openai/v1',                            keyEnv: 'GROQ_API_KEY' },
  mistral:    { label: 'Mistral',    baseUrl: 'https://api.mistral.ai/v1',                                 keyEnv: 'MISTRAL_API_KEY' },
  gemini:     { label: 'Gemini',     baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',   keyEnv: 'GEMINI_API_KEY' },
  // Local server: enabled by OLLAMA_BASE_URL (e.g. http://localhost:11434/v1); key optional.
  ollama:     { label: 'Ollama',     baseUrlEnv: 'OLLAMA_BASE_URL', keyEnv: 'OLLAMA_API_KEY', keyOptional: true },
};

// Suggested models shown in the UI picker. Any model id the provider accepts
// also works when typed via API — these are just convenient defaults.
const SUGGESTED_MODELS = {
  openrouter: ['openai/gpt-4.1', 'google/gemini-2.5-pro', 'meta-llama/llama-3.3-70b-instruct', 'mistralai/mistral-large'],
  openai:     ['gpt-4.1', 'gpt-4.1-mini'],
  groq:       ['llama-3.3-70b-versatile'],
  mistral:    ['mistral-large-latest'],
  gemini:     ['gemini-2.5-pro', 'gemini-2.5-flash'],
  ollama:     ['llama3.2'],
};

// Parse a model id into {provider, model}; null if malformed or unknown provider.
function resolve(modelId) {
  if (typeof modelId !== 'string' || !MODEL_ID_RE.test(modelId)) return null;
  const idx = modelId.indexOf(':');
  if (idx === -1) return modelId.startsWith('claude-') ? { provider: 'anthropic', model: modelId } : null;
  const provider = modelId.slice(0, idx);
  const model = modelId.slice(idx + 1);
  if (!PROVIDERS[provider] || provider === 'anthropic' || !model) return null;
  return { provider, model };
}

function baseUrlFor(provider, env) {
  const p = PROVIDERS[provider];
  const url = p.baseUrlEnv ? env[p.baseUrlEnv] : p.baseUrl;
  return url ? url.replace(/\/+$/, '') : null;
}

function isConfigured(provider, env = process.env) {
  const p = PROVIDERS[provider];
  if (!p) return false;
  if (p.native) return !!env[p.keyEnv];
  if (!baseUrlFor(provider, env)) return false;
  return p.keyOptional ? true : !!env[p.keyEnv];
}

// Provider catalogue for the UI — never includes keys or base URLs.
function listProviders(env = process.env) {
  return Object.entries(PROVIDERS).map(([id, p]) => ({
    id,
    label: p.label,
    configured: isConfigured(id, env),
    models: (SUGGESTED_MODELS[id] || []).map(m => `${id}:${m}`),
  }));
}

function textOf(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content.filter(b => b && b.type === 'text').map(b => b.text).join('\n');
}

// Anthropic Messages request → OpenAI chat.completions request.
function toOpenAIBody(body, model) {
  const messages = [];
  const system = textOf(body.system);
  if (system) messages.push({ role: 'system', content: system });
  for (const m of body.messages || []) messages.push({ role: m.role, content: textOf(m.content) });
  const out = { model, messages };
  if (body.max_tokens) out.max_tokens = body.max_tokens;
  if (typeof body.temperature === 'number') out.temperature = body.temperature;
  if (typeof body.top_p === 'number') out.top_p = body.top_p;
  if (Array.isArray(body.stop_sequences) && body.stop_sequences.length) out.stop = body.stop_sequences;
  return out;
}

const STOP_REASONS = { stop: 'end_turn', length: 'max_tokens' };

// OpenAI chat.completions response → Anthropic Messages response.
function fromOpenAIResponse(data, model) {
  const choice = data.choices && data.choices[0];
  return {
    id: data.id || null,
    type: 'message',
    role: 'assistant',
    model: data.model || model,
    content: [{ type: 'text', text: (choice && choice.message && choice.message.content) || '' }],
    stop_reason: STOP_REASONS[choice && choice.finish_reason] || (choice && choice.finish_reason) || null,
    usage: {
      input_tokens: (data.usage && data.usage.prompt_tokens) || 0,
      output_tokens: (data.usage && data.usage.completion_tokens) || 0,
    },
  };
}

function errorResult(status, message) {
  return { ok: false, status, data: { error: { message } } };
}

// Run one request against whichever provider owns body.model.
// Returns {ok, status, data} with data in Anthropic shape on success and
// {error:{message}} on failure — callers never see provider-specific formats.
// `anthropicRequest(apiKey, body)` is injected so server.js keeps its single
// Helicone-aware Anthropic call path.
async function callModel(body, { env = process.env, anthropicRequest, fetchImpl = fetch } = {}) {
  const target = resolve(body && body.model);
  if (!target) return errorResult(400, 'Unknown or malformed model id.');
  if (!isConfigured(target.provider, env)) {
    return errorResult(400, `Provider "${target.provider}" is not configured on this server.`);
  }

  if (PROVIDERS[target.provider].native) {
    const upstream = await anthropicRequest(env[PROVIDERS.anthropic.keyEnv], body);
    return { ok: upstream.ok, status: upstream.status, data: await upstream.json() };
  }

  const p = PROVIDERS[target.provider];
  const headers = { 'Content-Type': 'application/json' };
  if (env[p.keyEnv]) headers.Authorization = `Bearer ${env[p.keyEnv]}`;
  const upstream = await fetchImpl(`${baseUrlFor(target.provider, env)}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(toOpenAIBody(body, target.model)),
  });
  let data;
  try { data = await upstream.json(); } catch { return errorResult(502, `${p.label} returned a non-JSON response.`); }
  if (!upstream.ok) {
    const msg = (data.error && (data.error.message || data.error)) || `${p.label} request failed.`;
    return errorResult(upstream.status, typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
  return { ok: true, status: 200, data: fromOpenAIResponse(data, target.model) };
}

// Pick the model that judges Scout output. SCOUT_VERIFIER_MODEL lets you use a
// different *vendor* than the generator (the strongest independence); it is
// ignored if unusable or identical to the generator. Otherwise fall back to
// the caller-supplied default (same-vendor, different model).
function pickVerifier(scoutModel, defaultVerifier, env = process.env) {
  const override = env.SCOUT_VERIFIER_MODEL;
  const target = override && resolve(override);
  if (target && override !== scoutModel && isConfigured(target.provider, env)) return override;
  return defaultVerifier;
}

module.exports = {
  PROVIDERS, resolve, isConfigured, listProviders,
  toOpenAIBody, fromOpenAIResponse, callModel, pickVerifier,
};
