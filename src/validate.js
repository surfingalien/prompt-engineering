'use strict';
// ─── Request validation ──────────────────────────────────────────────────────
// The API key lives on the server, so every field the browser sends is
// untrusted: bound sizes, whitelist shapes, and never forward arbitrary keys.

const { EFFORTS } = require('./models');

const LIMITS = {
  systemChars: 100_000,
  messageChars: 200_000,
  totalChars: 400_000,
  messages: 60,
};

function maxOutputTokens() {
  const n = parseInt(process.env.MAX_OUTPUT_TOKENS, 10);
  return Number.isFinite(n) && n > 0 ? Math.min(n, 64_000) : 16_000;
}

function fail(error) { return { error }; }

function validateChat(body) {
  if (!body || typeof body !== 'object') return fail('Body must be a JSON object.');
  const { model, system, messages, effort, maxTokens, showThinking } = body;

  if (model !== undefined && typeof model !== 'string') return fail('model must be a string.');
  if (system !== undefined && typeof system !== 'string') return fail('system must be a string.');
  if (system && system.length > LIMITS.systemChars) return fail(`system prompt exceeds ${LIMITS.systemChars} characters.`);

  if (!Array.isArray(messages) || !messages.length) return fail('messages must be a non-empty array.');
  if (messages.length > LIMITS.messages) return fail(`At most ${LIMITS.messages} messages per request.`);
  let total = (system || '').length;
  const clean = [];
  for (const [i, m] of messages.entries()) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) return fail(`messages[${i}].role must be "user" or "assistant".`);
    if (typeof m.content !== 'string' || !m.content.trim()) return fail(`messages[${i}].content must be a non-empty string.`);
    if (m.content.length > LIMITS.messageChars) return fail(`messages[${i}] exceeds ${LIMITS.messageChars} characters.`);
    total += m.content.length;
    clean.push({ role: m.role, content: m.content });
  }
  if (total > LIMITS.totalChars) return fail(`Request exceeds ${LIMITS.totalChars} characters in total.`);
  if (clean[0].role !== 'user') return fail('The first message must be from the user.');
  // Current Claude models reject assistant prefill; catch it here with a clear message.
  if (clean[clean.length - 1].role !== 'user') return fail('The last message must be from the user (assistant prefill is not supported on current models).');

  if (effort !== undefined && !EFFORTS.includes(effort)) return fail(`effort must be one of: ${EFFORTS.join(', ')}.`);
  const cap = maxOutputTokens();
  let max = maxTokens === undefined ? Math.min(4096, cap) : maxTokens;
  if (!Number.isInteger(max) || max < 1) return fail('maxTokens must be a positive integer.');
  max = Math.min(max, cap);

  return {
    value: { model, system: system || undefined, messages: clean, effort: effort || 'medium', maxTokens: max, showThinking: showThinking === true },
  };
}

function validateGrade(body) {
  if (!body || typeof body !== 'object') return fail('Body must be a JSON object.');
  const { output, rubric, input, model } = body;
  if (typeof output !== 'string') return fail('output must be a string.');
  if (typeof rubric !== 'string' || !rubric.trim()) return fail('rubric must be a non-empty string.');
  if (output.length > 100_000 || rubric.length > 10_000) return fail('output or rubric too long.');
  if (input !== undefined && (typeof input !== 'string' || input.length > 100_000)) return fail('input must be a string under 100k characters.');
  if (model !== undefined && typeof model !== 'string') return fail('model must be a string.');
  return { value: { output, rubric, input: input || '', model } };
}

function promptPair(body) {
  const { system = '', user = '' } = body;
  if (typeof system !== 'string' || typeof user !== 'string') return fail('system and user must be strings.');
  if (!system.trim() && !user.trim()) return fail('The prompt is empty.');
  if (system.length + user.length > 150_000) return fail('Prompt is too long to review (150k characters max).');
  return { value: { system, user } };
}

function validateReview(body) {
  if (!body || typeof body !== 'object') return fail('Body must be a JSON object.');
  const p = promptPair(body);
  if (p.error) return p;
  const mode = body.mode === 'lesson' ? 'lesson' : 'deep';
  let lesson = null;
  if (mode === 'lesson') {
    const l = body.lesson || {};
    const checklist = Array.isArray(l.checklist) ? l.checklist.filter(c => typeof c === 'string' && c.trim()).map(c => c.slice(0, 300)).slice(0, 10) : [];
    if (typeof l.title !== 'string' || !l.title.trim() || !checklist.length) return fail('lesson mode needs lesson.title and a non-empty lesson.checklist.');
    lesson = { title: l.title.slice(0, 200), task: String(l.task || '').slice(0, 2000), checklist };
  }
  if (body.model !== undefined && typeof body.model !== 'string') return fail('model must be a string.');
  return { value: { ...p.value, mode, lesson, model: body.model } };
}

function validateCases(body) {
  if (!body || typeof body !== 'object') return fail('Body must be a JSON object.');
  const p = promptPair(body);
  if (p.error) return p;
  const vars = Array.isArray(body.vars) ? body.vars.filter(v => typeof v === 'string' && /^[\w\- ]{1,60}$/.test(v)).slice(0, 20) : [];
  const count = Math.max(1, Math.min(12, parseInt(body.count, 10) || 6));
  const focus = typeof body.focus === 'string' ? body.focus.slice(0, 500) : '';
  if (body.model !== undefined && typeof body.model !== 'string') return fail('model must be a string.');
  return { value: { ...p.value, vars, count, focus, model: body.model } };
}

module.exports = { validateChat, validateGrade, validateReview, validateCases, maxOutputTokens, LIMITS };
