# ⚡ PromptForge v3 — AI Prompt Engineering Studio

> The most complete open-source prompt engineering workbench. Write, optimize, test, and deploy AI prompts — powered by 300+ skills and 190+ specialist agents synthesized from 15+ community repositories.

**Live at:** [prompt-engineering-production-67f2.up.railway.app](https://prompt-engineering-production-67f2.up.railway.app)

---

## What is PromptForge?

PromptForge is a single-page web application that turns anyone into a skilled AI prompt engineer. It combines the best ideas from the open-source community into one polished studio — giving you templates, techniques, agents, and an optimizer in one place.

You don't need to know how to code. You just need to know what you want the AI to do.

---

## Quick Start

```bash
# Install and run locally
npm install
npm start
# Open http://localhost:3000
```

**Deploy on Railway** (recommended):
1. Push to GitHub: `git push origin main`
2. Connect repo in Railway dashboard
3. Add environment variable: `ANTHROPIC_API_KEY=your_key_here`
4. Deploy — auto-detected via `Dockerfile`

---

## Features at a Glance

| View | What It Does |
|------|-------------|
| **Editor** | Write prompts with live stats, variable fill-in `{{like_this}}`, scoring, and history |
| **⚔ Council** | 5-advisor AI decision engine — get a synthesized verdict on any choice |
| **Techniques** | 12 interactive cards teaching CoT, ToT, ReAct, RAG, and more |
| **Design System** | Generate complete design tokens, UI styles, and brand voice frameworks |
| **COG Brain** | 12 second-brain skills — braindump, daily brief, PRD, research |
| **Sys Prompts** | 30+ curated system prompts (Claude, ChatGPT, Cursor, Lovable, GitHub Copilot…) |
| **Library** | 600+ full prompts across all categories |
| **⚡ Skills** | 300+ production workflow skills — security, testing, code, ML, agents, memory |
| **🤖 Agents** | 190+ specialist agent system prompts across 10 professional domains |

---

## The Skills Library (300+)

Skills are ready-to-use prompt templates for real engineering workflows. Fill in the `{{variables}}` and go.

| Source | Skills | Categories |
|--------|--------|-----------|
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | 36 | Security, Testing, Code, Frontend, Backend, Agent, DevOps, ML, Research, Product, Writing |
| [rohitg00/ai-engineering-from-scratch](https://github.com/rohitg00/ai-engineering-from-scratch) | 14 | RAG, Chain-of-Thought, LangGraph, Multi-Agent, LLM Infra, Safety |
| [rohitg00/agentmemory](https://github.com/rohitg00/agentmemory) | 8 | Remember, Recall, Handoff, Recap, Commit Context, Forget, Session History |
| [rohitg00/skillkit](https://github.com/rohitg00/skillkit) | 3 | SOUL Philosophy, Skill Discovery, Skill Composition |

---

## The Agent Library (190+)

Agent system prompts you can load directly into the editor and deploy.

| Source | Agents | Domains |
|--------|--------|---------|
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | 7 | Architect, Code Reviewer, Security, TDD, Planner, Performance, Simplifier |
| [rohitg00/awesome-claude-code-toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit) | 36 | Business, Core Dev, Data/AI, Infrastructure, Language Experts, Orchestration, QA, Research, Specialized |
| [rohitg00/agentmemory](https://github.com/rohitg00/agentmemory) | 8 | Memory management workflows |

---

## Source Repositories (15+)

| Repo | Contribution |
|------|-------------|
| [f/prompts.chat](https://github.com/f/prompts.chat) | Role & persona prompt library |
| [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide) | Techniques — 75k★ |
| [tenfoldmarc/llm-council-skill](https://github.com/tenfoldmarc/llm-council-skill) | LLM Council 5-advisor methodology |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Design system generator (161 rules, 67 styles) |
| [huytieu/COG-second-brain](https://github.com/huytieu/COG-second-brain) | COG Brain skills (17 skills, 6 agents) |
| [elder-plinius/CL4R1T4S](https://github.com/elder-plinius/CL4R1T4S) | Leaked system prompts — 26k★ |
| [asgeirtj/system_prompts_leaks](https://github.com/asgeirtj/system_prompts_leaks) | Community system prompts — 41k★ |
| [Leonxlnx/prompt-library](https://github.com/Leonxlnx/prompt-library) | Glassmorphism UI patterns |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | 251 production skills + 7 agents |
| [rohitg00/awesome-claude-code-toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit) | 136 specialist agents |
| [rohitg00/ai-engineering-from-scratch](https://github.com/rohitg00/ai-engineering-from-scratch) | 503-lesson AI engineering curriculum |
| [rohitg00/agentmemory](https://github.com/rohitg00/agentmemory) | Agent memory skills |
| [rohitg00/skillkit](https://github.com/rohitg00/skillkit) | Skill composition philosophy |
| [nexu-io/open-design](https://github.com/nexu-io/open-design) | Design agent (137 skills, 150 design systems) |
| microsoft/generative-ai-for-beginners | Learning structure |

---

## Architecture

```
prompt-engineering/
├── public/
│   └── index.html      # Full SPA — 9 views, 300+ skills, 190+ agents
├── server.js           # Express server + /api/chat proxy (keeps API key server-side)
├── Dockerfile          # Node 22 Alpine — Railway-ready
├── docker-compose.yml  # PromptForge (3000) + Open Design (7456)
├── package.json
└── open-design/        # Git submodule — local design agent (requires Node 24)
```

### API Key Security

The Anthropic API key **never reaches the browser**. All AI calls go through the server-side `/api/chat` proxy. Set `ANTHROPIC_API_KEY` as a Railway environment variable — never in code.

---

## Open Design Integration

[Open Design](https://github.com/nexu-io/open-design) runs alongside PromptForge as a separate service — a local-first design agent with 137 skills and 150 design systems.

```bash
# Full stack with Docker
cp .env.example .env   # set OD_API_TOKEN
docker compose up -d
# PromptForge → http://localhost:3000
# Open Design → http://localhost:7456
```

Open Design requires Node 24. After cloning, run `git submodule update --init --recursive`.

---

## Contributing

PRs welcome. Add skills to `ECC_SKILLS`, agents to `SYSTEM_PROMPTS_DATA`, or techniques to the existing data arrays in `public/index.html`.

---

## License

MIT
