'use strict';
// PromptForge — prompt engineering studio for Claude.
// Entry point: builds the app (src/app.js) and starts listening.

const { createApp } = require('./src/app');

const PORT = process.env.PORT || 3000;
const app = createApp();

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`PromptForge running at http://localhost:${PORT}`);
    if (!process.env.ANTHROPIC_API_KEY) console.log('Note: ANTHROPIC_API_KEY is not set — the studio works offline, but runs, evals and Scout are disabled.');
  });
}

module.exports = app;
