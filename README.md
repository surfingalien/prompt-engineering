# ⚡ PromptForge v2 — AI Prompt Engineering Studio

A comprehensive prompt engineering tool synthesized from **9 community repositories**.

## Features

### 🆕 New in v2
- **⚔ LLM Council** — Karpathy-style 5-advisor decision engine (from tenfoldmarc/llm-council-skill)
  - The Contrarian · First Principles · Expansionist · Outsider · Executor
  - Peer review + Chairman synthesis verdict
- **🎨 Design System Generator** — 161 reasoning rules, 67 UI styles (from nextlevelbuilder/ui-ux-pro-max-skill)
  - Three-layer token architecture (Primitive → Semantic → Component)
  - Color palette, typography scale, brand voice framework
- **🧠 COG Second Brain** — 12 skills, 6 worker agents (from huytieu/COG-second-brain)
  - Braindump capture, Knowledge consolidation, Daily brief
  - Role-filtered view: Founder, PM, Engineer, Designer, Marketer
  - Auto-research, PRD generation, Meeting transcript processor

### Core (v1)
- **Editor** — Live stats (chars/words/tokens/variables)
- **Variable System** — `{{variable}}` syntax with live preview
- **AI Optimizer** — 6 modes: Clarity, CoT, Few-Shot, System Prompt, Concise, Structured
- **Prompt Scoring** — 5 dimensions in real-time
- **12 Technique Cards** — DAIR.AI guide (CoT, ToT, ReAct, RAG...)
- **System Prompt Gallery** — 8 curated prompts
- **Quick Insert Snippets** — Council Frame, Brand Voice, Braindump, Design Tokens
- **localStorage History** — Save and reload 50 prompts
- **Model Selector** — Claude, GPT-4o, Gemini, Grok

## Source Repositories (9 total)

| Repo | Contribution |
|------|-------------|
| [f/prompts.chat](https://github.com/f/prompts.chat) | Role & persona prompts |
| [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide) | Techniques (CoT, ToT, ReAct, RAG...) — 75k★ |
| [microsoft/generative-ai-for-beginners](https://github.com/microsoft/generative-ai-for-beginners) | Learning structure |
| [linshenkx/prompt-optimizer](https://github.com/linshenkx/prompt-optimizer) | Optimization mode design |
| [asgeirtj/system_prompts_leaks](https://github.com/asgeirtj/system_prompts_leaks) | System prompt gallery — 41k★ |
| [elder-plinius/CL4R1T4S](https://github.com/elder-plinius/CL4R1T4S) | Claude/Cursor/Perplexity system prompts — 26k★ |
| [tenfoldmarc/llm-council-skill](https://github.com/tenfoldmarc/llm-council-skill) | LLM Council methodology (Karpathy-inspired) |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Design system generator (161 rules, 67 styles) |
| [huytieu/COG-second-brain](https://github.com/huytieu/COG-second-brain) | Self-evolving second brain (17 skills, 6 agents) |

## Quick Start

```bash
npm install
npm start
# Open http://localhost:3000
```

## Deploy on Railway

1. Push to GitHub: `git push origin main`
2. Connect repo in Railway
3. Deploy (auto-detects `npm start`)

## Views

| View | Description |
|------|-------------|
| **Editor** | Main 3-column editor with stats, variables, optimizer, council, design system |
| **⚔ Council** | LLM Council mode cards — 6 advisor configurations |
| **Techniques** | 12 prompting techniques with interactive cards |
| **Design System** | 8 design token/UI system prompt generators |
| **COG Brain** | 12 second-brain skills filtered by role |
| **Sys Prompts** | 8 curated system prompts from leaks/public sources |
| **Library** | 23 full prompts across all categories |

## Structure

```
prompt-engineering/
├── public/
│   └── index.html    # Full SPA — 7 views, 23 prompts, Council, Design System, COG Brain
├── server.js         # Express static server
├── package.json      # npm start → Railway ready
└── README.md
```
