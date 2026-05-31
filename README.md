# ⚡ PromptForge — AI Prompt Engineering Studio

A comprehensive prompt engineering tool built from the best community resources.

## Features

- **Editor** — Write prompts with live stats (chars, words, tokens, variables)
- **Variable System** — Use `{{variable}}` syntax with live preview
- **AI Optimizer** — 6 optimization modes powered by Claude API:
  - Clarity, Chain-of-Thought, Few-Shot, System Prompt, Concise, Structured
- **Prompt Scoring** — Real-time scoring across 5 dimensions
- **Techniques Library** — 12 prompting techniques from DAIR.AI
- **System Prompt Gallery** — Curated from CL4R1T4S & system_prompts_leaks
- **Prompt Library** — 20+ role, technique, code, tool prompts from prompts.chat
- **History** — Save and reload prompts (localStorage)
- **Model Selector** — Target Claude, GPT-4o, Gemini, Grok

## Source Repositories

| Repo | Contribution |
|------|-------------|
| [f/prompts.chat](https://github.com/f/prompts.chat) | Role & persona prompts |
| [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide) | Techniques (CoT, ToT, ReAct, RAG...) |
| [microsoft/generative-ai-for-beginners](https://github.com/microsoft/generative-ai-for-beginners) | Learning structure |
| [linshenkx/prompt-optimizer](https://github.com/linshenkx/prompt-optimizer) | Optimization mode design |
| [asgeirtj/system_prompts_leaks](https://github.com/asgeirtj/system_prompts_leaks) | System prompt gallery |
| [elder-plinius/CL4R1T4S](https://github.com/elder-plinius/CL4R1T4S) | Claude/Cursor/Perplexity system prompts |

## Quick Start

```bash
npm install
npm start
# Open http://localhost:3000
```

## Deploy on Railway

1. Push to GitHub
2. Connect repo to Railway
3. Set `PORT` env var (optional, defaults to 3000)
4. Deploy

## Structure

```
prompt-engineering/
├── public/
│   └── index.html        # Full SPA — editor, library, techniques, system prompts
├── server.js             # Express static server
├── package.json
└── README.md
```
