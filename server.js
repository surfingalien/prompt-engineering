'use strict';
// PromptForge — prompt engineering studio for Claude.
// Entry point: builds the app (src/app.js) and starts listening.

const { createApp } = require('./src/app');

const PORT = process.env.PORT || 3000;
const app = createApp();

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`PromptForge running at http://localhost:${PORT}`);
    if (process.env.LLM_GATEWAY_URL) console.log(`Free models: gateway at ${process.env.LLM_GATEWAY_URL}${process.env.ANTHROPIC_API_KEY ? ' (Claude also enabled)' : ' (no ANTHROPIC_API_KEY needed)'}.`);
    else if (!process.env.ANTHROPIC_API_KEY) console.log('Note: neither ANTHROPIC_API_KEY nor LLM_GATEWAY_URL is set — the studio works offline, but runs, evals and Scout are disabled.');
  });
}

module.exports = app;
