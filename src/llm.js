'use strict';
// ─── One interface over every provider ───────────────────────────────────────
// Routes call these two functions and never care whether the model is Claude
// (official Anthropic SDK) or a free model behind an OpenAI-compatible gateway
// (OmniRoute, FreeLLMAPI, …). Both return PromptForge's shapes:
//
//   stream(auth, req, { onDelta, onThinking, onNotice, signal })
//     → { model, stop_reason, usage }          (throws on error; 422 on refusal)
//   complete(auth, req)
//     → { text, message: { model, usage } }    (format → JSON text matching the schema)
//
// `req` is the validated request: { model, system, messages, effort, maxTokens,
// showThinking, format }. `auth` comes from guard.authorize(req, modelEntry).

const anthropic = require('./anthropic');
const gateway = require('./providers/gateway');
const { resolveModel } = require('./models');

function refusal(message) {
  const err = new Error(`Claude declined this request${message.stop_details?.category ? ` (${message.stop_details.category})` : ''}. Try rephrasing.`);
  err.status = 422;
  return err;
}

async function stream(auth, req, { onDelta, onThinking, onNotice, signal } = {}) {
  const model = resolveModel(req.model);
  if (model.provider === 'gateway') {
    return gateway.stream({
      upstream: model.upstream, system: req.system, messages: req.messages, maxTokens: req.maxTokens, signal,
      onDelta, onThinking: req.showThinking ? onThinking : null, onNotice,
    });
  }
  const { params, beta } = anthropic.buildParams({ ...req, model: model.id });
  const s = anthropic.messagesApi(auth.client, beta).stream(params);
  if (signal) signal.addEventListener('abort', () => s.abort(), { once: true });
  for await (const ev of s) {
    if (ev.type === 'content_block_delta') {
      if (ev.delta.type === 'text_delta') onDelta?.(ev.delta.text);
      else if (ev.delta.type === 'thinking_delta' && ev.delta.thinking) onThinking?.(ev.delta.thinking);
    } else if (ev.type === 'content_block_start' && ev.content_block?.type === 'fallback') {
      const b = ev.content_block;
      onNotice?.(`${b.from?.model || 'The model'} declined; continued on ${b.to?.model || 'a fallback model'}.`);
    }
  }
  const final = await s.finalMessage();
  const usage = {
    input_tokens: final.usage?.input_tokens || 0,
    output_tokens: final.usage?.output_tokens || 0,
    cache_read_input_tokens: final.usage?.cache_read_input_tokens || 0,
    cache_creation_input_tokens: final.usage?.cache_creation_input_tokens || 0,
  };
  if (final.stop_reason === 'refusal') { const e = refusal(final); e.model = final.model; e.usage = usage; throw e; }
  return { model: final.model, stop_reason: final.stop_reason, usage };
}

async function complete(auth, req) {
  const model = resolveModel(req.model);
  if (model.provider === 'gateway') {
    return gateway.complete({ upstream: model.upstream, system: req.system, messages: req.messages, maxTokens: req.maxTokens, format: req.format, signal: req.signal });
  }
  return anthropic.complete(auth.client, { ...req, model: model.id });
}

/** Safe, user-facing { status, message } for any provider's error. */
function describeError(err) {
  if (err && err.gateway) return { status: err.status || 502, message: err.message };
  return anthropic.describeError(err);
}

/** Display name for errors and notices: "Claude" or the gateway's name. */
const providerName = model => (model && model.provider === 'gateway' ? gateway.conf().name : 'Claude');

module.exports = { stream, complete, describeError, providerName };
