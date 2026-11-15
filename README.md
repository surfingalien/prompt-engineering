# PromptForge v5 — Prompt engineering studio for Claude

> **From your first prompt to a production agent harness.** Learn the principles, build prompts with guidance, test them against Claude, measure them with evals, and ship the scaffolding that makes agents dependable, all in one calm workspace.

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

## What's new in v5

v5 is a ground-up rebuild. The 10,500-line single HTML file is now a modular, dependency-free front end on a hardened server that uses the official Anthropic SDK.

| | v4 | v5 |
|---|---|---|
| **Structure** | One 814 KB `index.html` (data + code + styles) | ES modules, three stylesheets, content in lazily loaded JSON |
| **Learning** | Static technique cards | A 4-level, 16-lesson path with before/after examples, checklists and runnable exercises |
| **Creating** | Free-text editor + regex score | Guided prompt builder plus a Workbench with streaming runs, A/B compare, multi-turn follow-ups, versions and diffs |
| **Quality** | Keyword-count score | A teaching analyzer: 6 dimensions, findings with concrete fixes, grounded in current Claude guidance |
| **Shipping** | — | Harness studio (CLAUDE.md, skills, subagents, tools, guardrails, evals → .zip) and an Evals runner with Claude-graded rubrics and promptfoo export |
| **Claude API** | Raw `fetch`, any model and body forwarded | Official SDK, Claude 5 models, SSE streaming, effort control, structured outputs, refusal fallbacks, strict validation |
| **Security** | Inline `onclick` handlers, no CSP | No inline handlers or scripts, strict CSP, escaped templating, capped tokens, rate limits |
| **Design** | Dark "glass" theme | Warm editorial design system, light + dark, responsive, keyboard-first (⌘K) |

Everything you saved in v4 carries over: Workbench imports your v4 prompt history on first load, and the Scout library keeps its storage key.

---

## The learning path: entry to expert

| Level | Theme | Lessons |
|---|---|---|
| **1 · Foundations** | Write prompts Claude understands the first time | Be clear and direct · Give context and say why · Specify the output · Examples |
| **2 · Structure** | Organize complex prompts so nothing gets lost | XML tags · Roles and system prompts · Long documents · Thinking and effort |
| **3 · Systems** | Chain prompts, use tools, get reliable outputs | Prompt chaining · Structured output · Designing tools · Prompt-injection defense |
| **4 · Harness** | Build and verify the scaffolding around an agent | What is a harness? · CLAUDE.md · Skills and subagents · Evals |

Every lesson pairs a principle with a scored before/after example, a checklist, and an exercise that opens in the Workbench. The guidance reflects current Claude models: adaptive thinking controlled by **effort** rather than "think step by step", structured outputs instead of assistant prefill, and calm instructions instead of ALL-CAPS emphasis.

---

## Features

| Area | What it does |
|---|---|
| **Home** | Your path, progress, recent prompts and a live before/after demo |
| **Learning path** | 16 lessons across 4 levels; progress is saved locally |
| **Library** | 514 unique skills, prompts, agents, techniques and reference system prompts. Faceted by type, domain and level, with instant search and favorites |
| **Prompt builder** | 8 blueprints (write, analyze, code, extract, summarize, classify, brainstorm, agent). Guided and Pro modes compose a best-practice prompt live, with a quality score |
| **Workbench** | Prompt workspace with system + user fields, `{{variables}}`, streaming runs, reasoning summaries, A/B compare (model vs model or version vs version), follow-up turns, version history with diffs, and **Improve with Claude** (six rewrite modes, reviewed as a diff before applying) |
| **Analyzer** | Deterministic prompt linter: clarity, context, structure, specificity, output and robustness, plus findings like "wrap untrusted input in tags", each with a fix |
| **Harness studio** | Design mission, guardrails, project memory, tools, skills, subagents and evals, with a readiness checklist. Exports `CLAUDE.md`, `.claude/agents/*.md`, `.claude/skills/*/SKILL.md`, strict `tools.json`, a runnable SDK `agent.ts`, and `evals.yaml` as a .zip |
| **Evals** | Suites of cases with checks (contains, regex, word limits, JSON, JSON keys, Claude-graded rubric). Run history with pass rates; export to promptfoo for CI |
| **Council** | Five advisors run as independent parallel calls, then a chairman synthesizes. A working example of the parallel-agents pattern |
| **📡 Scout** | Generates new skills and agents through a governance pipeline (below) |
| **Everywhere** | ⌘K command palette, light/dark theme, local-first storage with export/import, a usage and cost meter with a spend alert, offline mode |

---

## 📡 AI Intelligence Scout

> *Original invention by [@surfingalien](https://github.com/surfingalien). Attribution required for any use or derivative.*

Scout asks Claude to generate new, production-grade skill templates and agent system prompts on any topic, then gates every item before it can enter your library.

```
Topic → /api/scout → Claude (structured JSON output) → policy gate → cross-model verification → trust score → audit chain → your library
```

### Governance, trust & audit (`src/governance.js`)

| Gate | What it does |
|------|-------------|
| **Structured output** | The generator's response is constrained to a JSON schema (`output_config.format`), so it always parses. No more regex-scraping JSON out of prose |
| **Policy engine** | Deterministic allow / review / deny rules: prompt-injection markers, secret-exfiltration instructions and user-deception patterns are **denied** and never reach the browser; destructive commands, unknown categories and size violations are flagged **review** and need an explicit confirm before saving |
| **Cross-model verification** | A *different* Claude model (the generator never grades itself) judges each item pass/fail for coherence and safety; failures are dropped. Disable with `SCOUT_VERIFY=0` |
| **Trust scoring** | Each surviving item gets a 0–100 score and a **gold / silver / bronze / quarantined** tier |

Every run is appended to a SHA-256 **hash-chained audit log** (`scout-audit.jsonl`): each entry's hash covers its content plus the previous entry's hash, so any tampering with history is detectable.

- `GET /api/scout/audit` returns recent runs with accepted/rejected items and hash linkage
- `GET /api/scout/audit/verify` recomputes the whole chain and pinpoints the first broken link

### Library maintainer and editable memory

**Maintain library** re-scores every saved item against today's policy plus a fresh cross-model verification and returns **keep / flag / prune** per item (`POST /api/scout/maintain`). Saved items can be annotated or deleted, so the library stays curated rather than append-only. Saved Scout items appear in the main Library.

---

## Architecture

```
server.js                     entry point
src/
  app.js                      Express app factory: security headers (CSP), compression, rate limits, static
  anthropic.js                official SDK client, request builder (effort, caching, fallbacks), error mapping
  models.js                   model registry: ids, labels, prices; ALLOWED_MODELS / DEFAULT_MODEL
  validate.js                 strict request validation (roles, sizes, no prefill, token caps)
  governance.js               Scout policy engine, trust scoring, hash-chained audit
  routes/chat.js              GET /api/config · POST /api/chat (SSE) · POST /api/grade
  routes/scout.js             POST /api/scout · /api/scout/maintain · GET /api/scout/audit[/verify]
public/
  index.html                  app shell (no inline scripts)
  css/tokens.css              design tokens: color, type, space, light + dark
  css/app.css · views.css     components and views
  data/catalog.json           514-item library (lazy-loaded, ~225 KB gzipped)
  js/app.js                   router, sidebar, command palette, settings
  js/core/                    store (localStorage), API client (SSE), catalog, templating, UI primitives
  js/lib/                     pure, unit-tested modules: analyze, compose, harness, evals, zip, diff, markdown, search
  js/data/                    curriculum, builder blueprints, harness templates
  js/views/                   home, learn, library, build, workbench, harness, evals, council, scout
prompts/scout-system.txt      Scout system prompt (single source for server + promptfoo evals)
scripts/extract-legacy-data.js  one-time migration of v4 content into catalog.json
tests/                        server integration (mock Anthropic API), library units, governance, Scout prompt
```

**Front end:** framework-free ES modules with no build step. Views are lazy-loaded; every interpolation goes through an escaping `html` template tag; events are delegated (no inline handlers). The heavy library JSON loads only when needed.

**Back end:** Node 20+ and Express 5 with the official `@anthropic-ai/sdk`. The browser never chooses arbitrary request bodies: the server whitelists fields, resolves models against a registry, caps `max_tokens`, and streams results as Server-Sent Events.

### API

| Endpoint | Purpose |
|---|---|
| `GET /api/config` | Models (with prices), efforts, limits, whether a key is configured |
| `POST /api/chat` | `{model, system, messages, effort, maxTokens, showThinking}` → SSE events `delta`, `thinking`, `notice`, `done`, `error` |
| `POST /api/grade` | LLM-as-judge for eval rubrics. Structured output `{pass, score, reason}` from a cheaper model than the one under test |
| `POST /api/scout` · `/api/scout/maintain` | Scout generation and library maintenance |
| `GET /api/scout/audit` · `/api/scout/audit/verify` | Audit log and chain verification |
| `GET /api/health` | Liveness |

### Claude API usage

- **Models:** Claude Opus 5.5 (default), Sonnet 5.5, Haiku 5.5 and Fable 5.2. Restrict with `ALLOWED_MODELS`.
- **Effort, not temperature:** depth is set with `output_config.effort` (low → max). Sampling parameters are never sent.
- **Adaptive thinking:** on by default on current models; the UI can request a readable reasoning summary.
- **Prompt caching:** system prompts are sent with `cache_control`, so repeated runs of the same prompt are cheaper and faster. Cached tokens appear in run stats.
- **Refusal fallbacks:** Opus, Sonnet and Fable requests opt into server-side fallbacks (`fallbacks: "default"`), so a false-positive safety decline is retried on another model instead of failing. Refusals that remain are reported clearly.
- **Structured outputs:** Scout and grading use JSON schemas, so responses always parse.

### Security

- The API key lives only on the server. Without it, the app runs in **offline mode**.
- Strict Content Security Policy: `script-src 'self'`, no inline scripts or handlers (enforced by a test).
- Request validation: roles, sizes and message order are checked, unknown fields dropped, `max_tokens` capped (`MAX_OUTPUT_TOKENS`).
- Per-IP rate limits on chat (60 / 15 min) and Scout (10 / 15 min), configurable. `TRUST_PROXY` controls client-IP detection.
- Upstream errors are mapped to safe messages; raw API error bodies never reach the browser.
- Prompts the app sends on your behalf (improver, grader, council, Scout) fence user content in tags and tell Claude to treat it as data.

---

## Quick start

```bash
git clone https://github.com/surfingalien/prompt-engineering.git
```

```bash
cd prompt-engineering && npm install
```

```bash
ANTHROPIC_API_KEY=sk-ant-... npm start
```

Open http://localhost:3000. Without a key the studio still runs in offline mode.

**Docker:**

```bash
ANTHROPIC_API_KEY=sk-ant-... docker compose up --build promptforge
```

**Deploy on Railway:** connect your fork in the [Railway dashboard](https://railway.app), set `ANTHROPIC_API_KEY` as a service variable, and deploy. The Dockerfile is production-ready (non-root user, `npm ci`, health check). See `.env.example` for every option.

### Tests

```bash
npm test
```

This runs 60 tests with no API key and no extra dependencies (Node's built-in test runner):
- **Server integration:** a local mock of the Anthropic API checks the exact request the SDK sends (effort, cache control, fallbacks, no sampling params, token caps), SSE streaming, refusal and error mapping, validation, Scout governance and the audit chain.
- **Library units:** analyzer (including "every lesson's after beats its before"), composer, harness exports, eval assertions, promptfoo export, zip (verified with `unzip`), diff, markdown sanitization, search, catalog integrity.
- **Governance:** policy, trust scoring, hash chain, plus the no-inline-handler invariant.

```bash
npm run eval
```

This runs the promptfoo regression suite for the Scout system prompt against the live API (needs a key).

---

## Contributing content

Library items live in `public/data/catalog.json`. Each item:

```json
{
  "id": "skill-unique-slug",
  "kind": "skill | prompt | agent | technique | reference",
  "title": "Code Review",
  "summary": "One sentence shown on cards.",
  "domain": "coding | agents | research | product | writing | data-ml | thinking | design | testing | security | devops | business | specialized | system-prompts",
  "level": "beginner | intermediate | advanced | expert",
  "source": "where it came from",
  "body": "The prompt text, with {{variables}}",
  "vars": ["variables"]
}
```

`npm test` validates the catalog (unique ids, required fields, valid levels). Lessons live in `public/js/data/curriculum.js` and builder blueprints in `public/js/data/blueprints.js`. Please open an issue before large changes.

---

## Source repositories

The library synthesizes work from the open-source prompt-engineering community. Thank you to the authors of:

[dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide) · [f/prompts.chat](https://github.com/f/prompts.chat) · [asgeirtj/system_prompts_leaks](https://github.com/asgeirtj/system_prompts_leaks) · [elder-plinius/CL4R1T4S](https://github.com/elder-plinius/CL4R1T4S) · [x1xhlol/system-prompts-and-models-of-ai-tools](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools) · [tenfoldmarc/llm-council-skill](https://github.com/tenfoldmarc/llm-council-skill) · [phuryn/pm-skills](https://github.com/phuryn/pm-skills) · [affaan-m/ECC](https://github.com/affaan-m/ECC) · [rohitg00/awesome-claude-code-toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit) · [rohitg00/ai-engineering-from-scratch](https://github.com/rohitg00/ai-engineering-from-scratch) · [rohitg00/agentmemory](https://github.com/rohitg00/agentmemory) · [rohitg00/skillkit](https://github.com/rohitg00/skillkit) · [VRSEN/OpenSwarm](https://github.com/VRSEN/OpenSwarm) · [Shubhamsaboo/awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps) · [safishamsi/graphify](https://github.com/safishamsi/graphify) · [tobi/qmd](https://github.com/tobi/qmd) · [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) · [danielmiessler/Personal_AI_Infrastructure](https://github.com/danielmiessler/Personal_AI_Infrastructure) · [obra/superpowers](https://github.com/obra/superpowers) · [lfnovo/open-notebook](https://github.com/lfnovo/open-notebook) · [nexu-io/open-design](https://github.com/nexu-io/open-design) · [vercel-labs/skills](https://github.com/vercel-labs/skills) · [mattpocock/skills](https://github.com/mattpocock/skills) · [ruvnet/ruflo](https://github.com/ruvnet/ruflo) · [LeoYeAI/openclaw-master-skills](https://github.com/LeoYeAI/openclaw-master-skills) · [LearningCircuit/local-deep-research](https://github.com/LearningCircuit/local-deep-research) · [bytedance/deer-flow](https://github.com/bytedance/deer-flow) · [nidhinjs/prompt-master](https://github.com/nidhinjs/prompt-master) · [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) · [huytieu/COG-second-brain](https://github.com/huytieu/COG-second-brain)

Items of kind `reference` are community-collected product system prompts kept for study. Their authenticity is not verified, and the UI says so.

---

## License

MIT, with the attribution requirement above for the Scout engine and the PromptForge platform.

---

<div align="center">
  <strong>Built by <a href="https://github.com/surfingalien">@surfingalien</a></strong><br>
  <sub>PromptForge v5 · AI Intelligence Scout · Open source with attribution</sub>
</div>
