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
| **Learning** | Static technique cards | A 4-level, 17-lesson path with before/after examples, checklists and runnable exercises |
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
| **4 · Harness** | Build and verify the scaffolding around an agent | What is a harness? · CLAUDE.md · Skills and subagents · Evals · Autonomous experiment loops |

Every lesson pairs a principle with a scored before/after example, a checklist, and an exercise that opens in the Workbench. The guidance reflects current Claude models: adaptive thinking controlled by **effort** rather than "think step by step", structured outputs instead of assistant prefill, and calm instructions instead of ALL-CAPS emphasis.

---

## Features

| Area | What it does |
|---|---|
| **Home** | Your path, progress, recent prompts and a live before/after demo |
| **Learning path** | 17 lessons across 4 levels; progress is saved locally |
| **Library** | 570 items: 514 curated skills, prompts, agents, techniques and reference system prompts, plus 56 installable skills in 6 collections. Faceted by collection, type, domain and level, with instant search and favorites |
| **Prompt builder** | 8 blueprints (write, analyze, code, extract, summarize, classify, brainstorm, agent). Guided and Pro modes compose a best-practice prompt live, with a quality score |
| **Workbench** | Prompt workspace with system + user fields, **Deep review** (Claude critiques the prompt like an expert editor), **graded exercises** (Check my answer against the lesson checklist), **share links**, `{{variables}}`, streaming runs, reasoning summaries, A/B compare (model vs model or version vs version), follow-up turns, version history with diffs, and **Improve with Claude** (six rewrite modes, reviewed as a diff before applying) |
| **Analyzer** | Deterministic prompt linter: clarity, context, structure, specificity, output and robustness, plus findings like "wrap untrusted input in tags", each with a fix |
| **Harness studio** | Five templates (code review, support, research, log-first trading desk, autoresearch loop). Design mission, guardrails, project memory, tools, skills, subagents and evals, with a readiness checklist. Exports `CLAUDE.md`, `.claude/agents/*.md`, `.claude/skills/*/SKILL.md`, strict `tools.json`, a runnable SDK `agent.ts`, and `evals.yaml` as a .zip |
| **Evals** | Suites of cases with checks (contains, regex, word limits, JSON, JSON keys, Claude-graded rubric). **Compare the current prompt with any saved version** on the same suite, and **generate typical, edge and adversarial cases with Claude**. Run history with pass rates; export to promptfoo for CI |
| **Council** | Five advisors run as independent parallel calls, then a chairman synthesizes. A working example of the parallel-agents pattern |
| **📡 Scout** | Generates new skills and agents through a governance pipeline (below) |
| **Sharing** | Share a prompt or harness as a link. The content is compressed into the URL itself, with nothing stored on a server, and opens as a preview the recipient chooses to save. Variable values are never included |
| **Everywhere** | ⌘K command palette, WCAG 2.1 AA (axe-audited in light and dark), mobile-friendly Workbench, light/dark theme, local-first storage with export/import, a usage and cost meter with a spend alert, offline mode |

---

## Skill collections

56 original, installable [Agent Skills](https://github.com/anthropics/skills) live in `skills/<name>/SKILL.md`. Each one appears in the Library (filter by collection) and can be opened in the Workbench, added to a harness, or downloaded. To install one in Claude Code, copy its folder into your project's `.claude/skills/`.

| Collection | Skills | What's inside |
|---|---|---|
| **Log-first trading desk** | 7 | Scanner (flags only) → Rug Check (nothing executes before a PASS) → Position Sizer (from equity, never a fixed ticket) → Executor (slippage cap) → Trade Logger (no trade without a reason) → Equity Guard (circuit breakers), plus a Morning Log Review |
| **Market microstructure** | 8 | Bid-ask spread, order book depth, market impact (square-root law), adverse selection (Glosten–Milgrom), queue position, latency arbitrage (Budish et al. 2015), maker–taker fees, slippage / implementation shortfall |
| **Volatility surface** | 8 | Skew, smile, term structure, sticky strike, sticky delta, 25Δ risk reversal, 25Δ butterfly, variance swaps |
| **Quant research rigor** | 17 | Look-ahead and survivorship audits, leakage audit, walk-forward/CPCV, deflated Sharpe, overfitting reviewer, cost model, triple-barrier labels, regimes, vol forecasting, mean reversion, pairs, tearsheet, hypothesis design, pre-trade gate, prediction markets, LP math |
| **Autoresearch loops** | 5 | The Karpathy loop, a program.md writer, the morning results.tsv review, an overfit-safe loop for trading strategies, and an eval-driven loop for prompts |
| **Agent & context engineering** | 11 | Context degradation, compression, long-horizon briefs, memory design, filesystem context, harness engineering, LLM-as-judge, multi-agent patterns, skill creator, tool contracts, Socratic tutor |

Five skills ship **calculators** (`scripts/*.py`, standard-library Python) that Claude runs instead of doing arithmetic by hand: market impact (`micro-market-impact`), deflated Sharpe (`quant-deflated-sharpe`), impermanent loss (`quant-lp-impermanent-loss`), variance-swap strike (`vol-variance-swap`) and position size (`desk-position-sizer`). Each is regression-tested against values you can derive by hand. In the Library, these skills download as a .zip with their scripts.

The Harness studio's **Log-first trading desk** and **Autoresearch loop** templates assemble these skills into complete, exportable harnesses. The trading desk runs in paper mode with confirmation gates and circuit breakers.

> Trading and research skills are for education and research. They are not financial advice. Paper-trade any automated strategy before risking capital.

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
  guard.js                    spend protection: daily budget, access password, bring-your-own-key
  governance.js               Scout policy engine, trust scoring, hash-chained audit
  routes/chat.js              GET /api/config · POST /api/chat (SSE) · /api/grade · /api/review · /api/cases
  routes/scout.js             POST /api/scout · /api/scout/maintain · GET /api/scout/audit[/verify]
public/
  index.html                  app shell (no inline scripts)
  css/tokens.css              design tokens: color, type, space, light + dark
  css/app.css · views.css     components and views
  data/catalog.json           570-item library, built by scripts/build-catalog.js (lazy-loaded, ~265 KB gzipped)
  js/app.js                   router, sidebar, command palette, settings
  js/core/                    store (localStorage), API client (SSE), catalog, templating, UI primitives
  js/lib/                     pure, unit-tested modules: analyze, compose, harness, evals, zip, diff, markdown, search
  js/data/                    curriculum, builder blueprints, harness templates
  js/views/                   home, learn, library, build, workbench, harness, evals, council, scout
prompts/scout-system.txt      Scout system prompt (single source for server + promptfoo evals)
scripts/build-catalog.js      validates skills/ and merges them into catalog.json
scripts/smoke-live.js         live smoke test against the real API (npm run smoke:live)
scripts/extract-legacy-data.js  one-time migration of v4 content into catalog.json
skills/                       56 installable Agent Skills (SKILL.md + optional scripts/)
docs/archive/                 reference material from earlier versions (not loaded by the app)
.github/workflows/ci.yml      tests on every PR; optional live smoke test
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
| `POST /api/review` | `mode: "deep"` critiques a prompt (score, strengths, issues with fixes); `mode: "lesson"` grades an exercise against a lesson checklist. Structured output; the prompt is fenced as data |
| `POST /api/cases` | Drafts typical, edge and adversarial eval cases for a prompt template (structured output) |
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

- The API key lives only on the server. Without it, the app runs in **offline mode**, and visitors can still run prompts with their own key.
- **Spend protection** for public deployments (`src/guard.js`):
  - `DAILY_BUDGET_USD` (default **$10**, `0` = no cap): a hard daily cap on shared-key spend, computed from each response's token usage and the model price table. It persists across restarts (`SPEND_STATE_PATH`) and resets at 00:00 UTC.
  - `ACCESS_PASSWORD` (optional): visitors must enter it in Settings to use the shared key.
  - **Bring your own key:** a visitor can add their own Anthropic key in Settings. It is sent with each request in the `x-user-api-key` header, used for that request only, never stored or logged on the server, excluded from workspace exports, and not counted against the shared budget.
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

This runs 82 tests with no API key and no extra dependencies (Node's built-in test runner):
- **Server integration:** a local mock of the Anthropic API checks the exact request the SDK sends (effort, cache control, fallbacks, no sampling params, token caps), SSE streaming, refusal and error mapping, validation, Scout governance and the audit chain.
- **Library units:** analyzer (including "every lesson's after beats its before"), composer, harness exports, eval assertions, promptfoo export, zip (verified with `unzip`), diff, markdown sanitization, search, catalog integrity.
- **Governance:** policy, trust scoring, hash chain, plus the no-inline-handler invariant.

**Calculators:** each skill script is run against hand-derivable values (skipped automatically if `python3` is missing).

```bash
ANTHROPIC_API_KEY=sk-ant-... npm run smoke:live
```

The **live smoke test** boots the app and exercises every endpoint against the real API on every enabled model: streaming, reasoning summaries, prompt caching, grading, deep review, lesson grading, case generation, and with `--scout` also Scout. It costs roughly $0.05–0.20 per run and is capped by a $2 budget.

**CI** (`.github/workflows/ci.yml`) runs `npm test` on Node 20 and 22 for every pull request. On pushes to `main`, or on demand, it also runs the live smoke test when the repository has an `ANTHROPIC_API_KEY` secret.

```bash
npm run eval
```

This runs the promptfoo regression suite for the Scout system prompt against the live API (needs a key).

---

## Contributing content

**Skills** are the preferred way to add content. Create `skills/<name>/SKILL.md`:

```markdown
---
name: my-skill                      # lowercase-hyphenated, matches the folder
description: Use when … (what it does and when to use it, ≤ 1024 chars)
metadata:
  title: "Human-readable title"
  kind: skill                       # skill | prompt | agent | technique
  domain: trading                   # see the domain list below
  level: advanced                   # beginner | intermediate | advanced | expert
  pack: quant-research              # a collection id from public/js/data/packs.js
  source: "Who or what inspired it"
  tags: [one, two]
---

# Title
Instructions with {{variables}} …
```

Then run `npm run build:catalog`. `npm test` fails if a skill violates the format or the catalog is stale.

Legacy library items live in `public/data/catalog.json`. Each item:

```json
{
  "id": "skill-unique-slug",
  "kind": "skill | prompt | agent | technique | reference",
  "title": "Code Review",
  "summary": "One sentence shown on cards.",
  "domain": "coding | agents | research | product | writing | data-ml | thinking | design | testing | security | devops | business | trading | specialized | system-prompts",
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

The skill collections were written for PromptForge. Their topics and structure were informed by these MIT/Apache-licensed projects, credited in each skill's `source` field: [karpathy/autoresearch](https://github.com/karpathy/autoresearch) · [anthropics/skills](https://github.com/anthropics/skills) · [agiprolabs/claude-trading-skills](https://github.com/agiprolabs/claude-trading-skills) · [tradermonty/claude-trading-skills](https://github.com/tradermonty/claude-trading-skills) · [ml4t/skills](https://github.com/ml4t/skills) · [muratcankoylan/Agent-Skills-for-Context-Engineering](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering) · [janestreet/agent_skills](https://github.com/janestreet/agent_skills). The trading-desk layout was inspired by a community "Grok Bot Terminal" overnight dashboard.

Items of kind `reference` are community-collected product system prompts kept for study. Their authenticity is not verified, and the UI says so.

---

## License

MIT, with the attribution requirement above for the Scout engine and the PromptForge platform.

---

<div align="center">
  <strong>Built by <a href="https://github.com/surfingalien">@surfingalien</a></strong><br>
  <sub>PromptForge v5 · AI Intelligence Scout · Open source with attribution</sub>
</div>
