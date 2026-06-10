# ⚡ PromptForge v4 — AI Prompt Engineering Studio

> **The most complete open-source AI prompt engineering platform.** Write, optimize, score, and deploy prompts — powered by 350+ skills, 200+ specialist agents, and a live AI Intelligence Scout that discovers new skills and agents autonomously.

**Live at:** [prompt-engineering-production-67f2.up.railway.app](https://prompt-engineering-production-67f2.up.railway.app)

**Built by:** [@surfingalien](https://github.com/surfingalien)

---

## ⚠️ Attribution Required

> **The AI Intelligence Scout feature and this platform are original works by [@surfingalien](https://github.com/surfingalien).**
>
> You are free to use, fork, and build upon this project under the terms below — **but you must provide clear, visible credit** in any derivative work, deployment, integration, or product that incorporates the Scout engine, the skill/agent discovery system, or the overall PromptForge platform.
>
> **Required attribution format:**
> ```
> Powered by PromptForge — AI Intelligence Scout
> Original work by @surfingalien · github.com/surfingalien/prompt-engineering
> ```
>
> Failure to provide attribution is a violation of the license terms. See [License](#license) section for full terms.

---

## What is PromptForge?

PromptForge is a single-page AI studio that turns anyone into a skilled prompt engineer. It is the only open-source tool that combines:

- A live **prompt editor** with real-time scoring, variable fill-in, and AI optimization
- A **350+ skill library** covering every major AI engineering domain
- A **200+ agent library** of production-grade system prompts
- A **5-advisor Council** for AI-assisted decision making
- A live **AI Intelligence Scout** that autonomously discovers and adds new skills and agents from the internet

No sign-up. No account. No API key in the browser. Open source.

---

## 📡 AI Intelligence Scout — Flagship Feature

> *Original invention by [@surfingalien](https://github.com/surfingalien). Attribution required for any use or derivative.*

The **AI Intelligence Scout** is PromptForge's most powerful and unique feature — an autonomous AI agent that discovers, evaluates, and injects new skills and agents directly into your running instance of PromptForge.

### How It Works

```
Topic Input → /api/scout → Claude generates JSON skills + agents → Live injection → localStorage persistence
```

1. **Open the `📡 Scout` tab** in the navigation
2. **Enter a topic** (e.g. `"multi-agent orchestration"`, `"RAG systems"`, `"browser automation"`)
3. **Choose type**: Skills + Agents / Skills only / Agents only
4. **Click `Run Scout`** — Claude analyzes the latest AI ecosystem and generates production-quality prompts
5. **Save discoveries** — one click adds them to your live Skills and Agents libraries, persisted across sessions

### What It Generates

| Output | Description |
|--------|-------------|
| **Skills** | Full prompt templates with `{{variables}}`, categorized, ready to load into editor |
| **Agents** | Complete system prompts with identity, capabilities, operating procedures |
| **Live injection** | Saved items appear immediately in Skills Library and Agents view — no reload |
| **Persistent storage** | Saved discoveries survive page refresh via `localStorage` |

### Quick Topics
Multi-agent orchestration · Browser automation · RAG systems · LLM code generation ·
Agent memory · Prompt compression · MCP servers · AI safety · Multimodal workflows · Data + AI pipelines

### Technical Implementation
- **Server**: `POST /api/scout` endpoint in `server.js` — calls `claude-sonnet-4-6` with a structured JSON schema prompt
- **Validation**: Server validates and sanitizes all generated JSON before returning
- **Security**: API key stays server-side; Scout results are AI-generated, not scraped
- **Frontend**: Results injected into `SCOUT_SKILLS` and `SYSTEM_PROMPTS_DATA` live arrays; `loadPersistedScoutDiscoveries()` runs on boot

---

## Features at a Glance

| View | What It Does |
|------|-------------|
| **Editor** | Write prompts with live stats, `{{variable}}` fill-in, scoring, history, keyboard shortcuts |
| **⚔ Council** | 5-advisor AI decision engine — Contrarian, First Principles, Expansionist, Outsider, Executor |
| **Techniques** | 12 interactive cards — CoT, ToT, ReAct, RAG, few-shot, meta-prompting |
| **Design System** | Generate design tokens, UI styles, brand voice, color systems |
| **COG Brain** | Second-brain skills — braindump, daily brief, PRD generator, deep research |
| **Sys Prompts** | 30+ real system prompts from Claude, ChatGPT, Cursor, Copilot, Lovable |
| **Library** | 600+ full prompts across all categories |
| **⚡ Skills** | 350+ production workflow skills across 13 categories |
| **🤖 Agents** | 200+ specialist agent system prompts across 12 source collections |
| **📡 Scout** | **Live AI discovery engine** — generates and injects new skills + agents autonomously |

---

## Optimizer Modes

| Mode | What It Does |
|------|-------------|
| **Clarity** | Removes ambiguity, tightens language |
| **Chain-of-Thought** | Adds step-by-step reasoning structure |
| **Few-Shot** | Generates examples for the prompt |
| **System Prompt** | Converts to professional system prompt format |
| **Concise** | Cuts to essentials without losing meaning |
| **Structured XML** | Adds `<task>`, `<context>`, `<constraints>`, `<output_format>` tags |

Results include **Copy** and **Apply to Editor** buttons.

---

## Skills Library (480+)

| Source | Skills | Categories |
|--------|--------|-----------|
| [f/prompts.chat](https://github.com/f/prompts.chat) | 70 | Role personas, interview prep, domain experts, creative writing |
| [phuryn/pm-skills](https://github.com/phuryn/pm-skills) | 68 | Discovery, Strategy, Execution, Market Research, Data Analytics, GTM, Marketing, AI Shipping |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | 36 | Security, Testing, Code, Frontend, Backend, Agent, DevOps, ML, Research, Product, Writing |
| [rohitg00/ai-engineering-from-scratch](https://github.com/rohitg00/ai-engineering-from-scratch) | 14 | RAG, Chain-of-Thought, LangGraph, Multi-Agent, LLM Infra, Safety |
| [rohitg00/agentmemory](https://github.com/rohitg00/agentmemory) | 8 | Agent memory workflows |
| [rohitg00/skillkit](https://github.com/rohitg00/skillkit) | 3 | SOUL Philosophy, Skill Discovery, Composition |
| [VRSEN/OpenSwarm](https://github.com/VRSEN/OpenSwarm) | 8 | Orchestrator, Research, Data Analyst, Document, Presentation, Portfolio |
| [Shubhamsaboo/awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps) | 14 | Strategy, UX, Planning, Research, Debugging, Content |
| [safishamsi/graphify](https://github.com/safishamsi/graphify) | 6 | Codebase graphs, architecture, multi-file context, AGENTS.md |
| [tobi/qmd](https://github.com/tobi/qmd) | 6 | Hybrid RAG, query expansion, chunking, re-ranking, search eval |
| [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | 4 | Trend research, competitive intel, community consensus, GitHub velocity |
| [danielmiessler/PAI](https://github.com/danielmiessler/Personal_AI_Infrastructure) | 6 | 7-phase solver, ISA, red team, systems thinking, root cause, daily brief |
| [obra/superpowers](https://github.com/obra/superpowers) | 5 | TDD, systematic debugging, code review, feature planning, spec refiner |
| [lfnovo/open-notebook](https://github.com/lfnovo/open-notebook) | 4 | Research notebook, podcast script, multi-source synthesis, study guide |
| [vercel-labs/skills](https://github.com/vercel-labs/skills) | 2 | Agent skill discovery, AI skill recommendation engine |
| [ruvnet/ruflo](https://github.com/ruvnet/ruflo) | 8 | Swarm coordination, SPARC coder, GOAP planner, TDD London, code review swarm, performance analyzer |
| [LeoYeAI/openclaw-master-skills](https://github.com/LeoYeAI/openclaw-master-skills) | 6 | Prompt engineering expert, deep research pro, 3-pass code review, OWASP security audit, memory manager, parallel agent dispatcher |
| [LearningCircuit/local-deep-research](https://github.com/LearningCircuit/local-deep-research) | 2 | ReAct deep research agent, structured report generator |
| [bytedance/deer-flow](https://github.com/bytedance/deer-flow) | 4 | Deep research coordinator, structured report builder, slide deck creator, sub-agent driven development |
| [diegosouzapw/OmniRoute](https://github.com/diegosouzapw/OmniRoute) | 2 | AI provider router design, token compression strategist |
| **📡 Scout (live-generated)** | ∞ | Any topic — generated on demand and saved to your library |

---

## Agent Library (200+)

| Source | Agents | Domains |
|--------|--------|---------|
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | 7 | Architect, Code Reviewer, Security, TDD, Planner, Performance, Simplifier |
| [rohitg00/awesome-claude-code-toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit) | 136 | Business, Core Dev, Data/AI, Infrastructure, Language Experts, Orchestration, QA, Research |
| [rohitg00/agentmemory](https://github.com/rohitg00/agentmemory) | 8 | Memory management workflows |
| [VRSEN/OpenSwarm](https://github.com/VRSEN/OpenSwarm) | 8 | Orchestrator, Research, Data, Slides, Portfolio, Investment |
| [Shubhamsaboo/awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps) | 4 | Strategy, UX, Planning, Research |
| [safishamsi/graphify](https://github.com/safishamsi/graphify) | 1 | Codebase Graph Analyst |
| [tobi/qmd](https://github.com/tobi/qmd) | 2 | RAG Architect, Query Expansion Specialist |
| [danielmiessler/PAI](https://github.com/danielmiessler/Personal_AI_Infrastructure) | 1 | Life OS Digital Assistant |
| [obra/superpowers](https://github.com/obra/superpowers) | 1 | Superpowers Dev Agent |
| [lfnovo/open-notebook](https://github.com/lfnovo/open-notebook) | 1 | Research Notebook Curator |
| [ruvnet/ruflo](https://github.com/ruvnet/ruflo) | 5 | Swarm Orchestrator, SPARC Agent, Code Review Swarm, GOAP Planner, TDD London School |
| [LeoYeAI/openclaw-master-skills](https://github.com/LeoYeAI/openclaw-master-skills) | 2 | Prompt Engineering Expert, OpenClaw Security Auditor |
| [LearningCircuit/local-deep-research](https://github.com/LearningCircuit/local-deep-research) | 1 | Local Deep Research Agent |
| [bytedance/deer-flow](https://github.com/bytedance/deer-flow) | 2 | DeerFlow Research Orchestrator, Sub-Agent Development Controller |
| **📡 Scout (surfingalien — original)** | ∞ | Any domain — generated and saved on demand |

---

## Architecture

```
prompt-engineering/
├── public/
│   └── index.html        # Full SPA — 10 views, 350+ skills, 200+ agents, Scout engine
├── server.js             # Express — /api/chat proxy + /api/scout discovery endpoint
├── Dockerfile            # Node 22 Alpine — Railway-ready
├── docker-compose.yml    # PromptForge (3000) + Open Design (7456)
├── package.json
└── open-design/          # Git submodule — local design agent (Node 24)
```

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chat` | POST | Proxies all AI calls (optimizer, council) — API key never reaches browser |
| `/api/scout` | POST | **Scout engine** — generates new skills + agents as validated JSON |

### API Key Security

The Anthropic API key **never reaches the browser**. All AI calls go through the server-side proxy. Set `ANTHROPIC_API_KEY` as a Railway environment variable — never in code, never in the client.

---

## Quick Start

```bash
# Clone and run locally
git clone https://github.com/surfingalien/prompt-engineering.git
cd prompt-engineering
npm install
npm start
# Open http://localhost:3000
```

**Deploy on Railway** (recommended):
1. Fork this repo on GitHub
2. Connect your fork in the [Railway dashboard](https://railway.app)
3. Add environment variable: `ANTHROPIC_API_KEY=your_key_here`
4. Deploy — auto-detected via `Dockerfile`

> If you fork and deploy publicly, attribution to `@surfingalien` is required (see [Attribution](#️-attribution-required)).

---

## Theme System

PromptForge ships with two themes, toggled via the `☀ Tan / 🌙 Dark` button in the header:

| Theme | Background | Feel |
|-------|-----------|------|
| **Dark** | `#0a0a0f` warm near-black | Default — professional dark studio |
| **Tan** | `#f5f0e8` warm parchment | Light mode — warm, editorial |

Theme preference is saved to `localStorage` and restored on next visit.

---

## Source Repositories

| Repo | Stars | Contribution |
|------|-------|-------------|
| [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide) | 75k★ | Techniques library |
| [asgeirtj/system_prompts_leaks](https://github.com/asgeirtj/system_prompts_leaks) | 41k★ | System prompt gallery |
| [elder-plinius/CL4R1T4S](https://github.com/elder-plinius/CL4R1T4S) | 26k★ | Leaked system prompts |
| [f/prompts.chat](https://github.com/f/prompts.chat) | — | Role & persona library |
| [tenfoldmarc/llm-council-skill](https://github.com/tenfoldmarc/llm-council-skill) | — | LLM Council methodology |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | — | Design system generator |
| [huytieu/COG-second-brain](https://github.com/huytieu/COG-second-brain) | — | COG Brain skills |
| [Leonxlnx/prompt-library](https://github.com/Leonxlnx/prompt-library) | — | UI patterns |
| [phuryn/pm-skills](https://github.com/phuryn/pm-skills) | — | 68 PM skills across discovery, strategy, execution, GTM, analytics, AI shipping |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | — | 251 production skills + 7 agents |
| [rohitg00/awesome-claude-code-toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit) | — | 136 specialist agents |
| [rohitg00/ai-engineering-from-scratch](https://github.com/rohitg00/ai-engineering-from-scratch) | — | AI engineering curriculum |
| [rohitg00/agentmemory](https://github.com/rohitg00/agentmemory) | — | Agent memory skills |
| [rohitg00/skillkit](https://github.com/rohitg00/skillkit) | — | Skill composition |
| [VRSEN/OpenSwarm](https://github.com/VRSEN/OpenSwarm) | — | OpenSwarm agents + skills |
| [Shubhamsaboo/awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps) | — | LLM app patterns |
| [safishamsi/graphify](https://github.com/safishamsi/graphify) | — | Codebase graph skills |
| [tobi/qmd](https://github.com/tobi/qmd) | — | Semantic search skills |
| [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | — | Trend research skills |
| [danielmiessler/Personal_AI_Infrastructure](https://github.com/danielmiessler/Personal_AI_Infrastructure) | — | PAI life OS skills |
| [obra/superpowers](https://github.com/obra/superpowers) | — | Dev methodology skills |
| [lfnovo/open-notebook](https://github.com/lfnovo/open-notebook) | — | Research notebook skills |
| [nexu-io/open-design](https://github.com/nexu-io/open-design) | — | Design agent integration |
| [vercel-labs/skills](https://github.com/vercel-labs/skills) | — | Agent skill discovery + recommendation engine skills |
| [ruvnet/ruflo](https://github.com/ruvnet/ruflo) | 58k★ | Swarm orchestration skills + agents (SPARC, GOAP, TDD, consensus) |
| [LeoYeAI/openclaw-master-skills](https://github.com/LeoYeAI/openclaw-master-skills) | — | Prompt engineering, deep research, code review, OWASP security, memory, parallel agents |
| [LearningCircuit/local-deep-research](https://github.com/LearningCircuit/local-deep-research) | — | ReAct research agent, structured report generator |
| [bytedance/deer-flow](https://github.com/bytedance/deer-flow) | 70k★ | Research orchestration, report builder, slide creator, sub-agent development |

---

## Contributing

PRs welcome. To add content:

- **Skills** → add entries to the appropriate `*_SKILLS` array in `public/index.html`
- **Agents** → add entries to `SYSTEM_PROMPTS_DATA` with `source`, `cat`, `tags`, `text`
- **Techniques** → add to the `TECHNIQUES` array
- **Scout topics** → suggest new quick-topic chips or Scout evaluation criteria

Please open an issue before large changes.

---

## License

MIT

---

<div align="center">
  <strong>Built by <a href="https://github.com/surfingalien">@surfingalien</a></strong><br>
  <sub>PromptForge v4 · AI Intelligence Scout · Open source with attribution</sub>
</div>
