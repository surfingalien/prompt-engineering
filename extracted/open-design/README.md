# Open Design — Extracted Prompts

This directory is a full extraction of every LLM prompt, prompt-composition module, and prompt-adjacent instructional document found in the [nexu-io/open-design](https://github.com/nexu-io/open-design) repository (Open Design — an open-source, agent-driven design/prototyping/slide-deck/media-generation tool).

- **Source repo:** `https://github.com/nexu-io/open-design.git`
- **Commit extracted from:** `83d67d5a62ea7f5951719f3bbadb57eb3e70ebf4`
- **Extraction date:** 2026-07-13
- **Method:** pure read-only text extraction/transcription — no code from the source repo was executed, and the cloned repo itself was not modified.

Open Design's prompt surface splits into three tiers:

1. **Core agent system prompts** (`system-prompts/`) — the literal instruction text composed and sent to the LLM on every agent turn (identity charter, discovery/planning rules, deck framework, media-generation contract, design-direction library, critique protocol, research contract, and the top-level composer that stacks them all together).
2. **Smaller feature-specific prompts** (`app-prompts/`) — one-off prompt strings embedded in the web app and daemon for specific UI features (design-system auto-creation, preset seed detection, "share to community", "continue in CLI" clipboard handoff, onboarding).
3. **Media-generation prompt catalogs** (`media-templates/`, `imagegen-prompts.md`) — large libraries of image/video generation prompt text used by Open Design's built-in template gallery and its own marketing-site skill.
4. **Claude Code skill/command definitions** (`skills/`) — the repo's own Claude Code skills for contributing to and using Open Design.

## Directory guide

```
system-prompts/            Core agent/LLM system prompts (apps/daemon/src/prompts + packages/contracts/src/prompts)
  official-system.md         Base "expert designer" identity charter (+ BYOK/API variant)
  discovery.md                Turn-1 clarification form, brand-spec extraction, design philosophy (+ variant)
  directions.md                Built-in 5-school visual direction library (identical in both packages)
  deck-framework.md            Fixed 1920x1080 slide-deck HTML/JS scaffold + directive (+ variant)
  media-contract.md            Image/video/audio generation CLI dispatch contract (+ variant)
  panel.md                      "Critique Theater" 5-panelist design jury protocol (daemon-only)
  research-contract.md          Web research (Tavily) command contract (daemon-only)
  system.md                     Top-level composeSystemPrompt() — assembly order + every inline literal block (+ variant)
  atom-block.md                 Per-pipeline-stage prompt fragment renderer (contracts-only, structural)
  plugin-block.md               "Active plugin" prompt block renderer (contracts-only, structural)

app-prompts/                Smaller feature-specific prompts (apps/web/src, apps/daemon/src/media)
  design-system-auto-prompt.md  Prefix string for design-system workspace auto-creation
  preset-seed-prompt.md         Meta-instruction/attribution/placeholder-pattern detector strings
  share-to-community-prompt.md  Full kickoff prompt for the "Share to Open Design" button
  build-clipboard-prompt.md     "Continue in CLI" clipboard handoff Markdown template
  first-prompt.md               Flagged: no literal prompt content (pure analytics plumbing)
  media-prompt-templates.md     Flagged: no literal prompt content (pure types/loader plumbing)

media-templates/            Consolidated catalogs of the prompt-templates/ media-generation library
  image-prompts.md              All 48 image generation prompt templates, full text
  video-prompts.md              All 58 video generation prompt templates, full text

skills/                     Claude Code skill/command definitions shipped in the repo
  enhance-prompt.md             skills/enhance-prompt SKILL.md, full transcription
  od-contribute.md              .claude/skills/od-contribute SKILL.md, full transcription + bundled references summary
  commands.md                   .claude/commands/od-contribute.md slash-command definition

imagegen-prompts.md         Atelier Zero image-gen prompt pack for the open-design-landing marketing skill
                             (design-templates/open-design-landing/assets/imagegen-prompts.md, byte-identical
                             to the plugins/_official/examples copy — reproduced once here)
```

## Counts

- **Markdown files in this extraction:** 23 (including this README)
- **Core system-prompt modules documented:** 10 (8 with a `packages/contracts` variant noted inline: `official-system`, `discovery`, `deck-framework`, `media-contract`, `system`; 1 byte-identical across both packages: `directions`; 2 daemon-only: `panel`, `research-contract`; 2 contracts-only structural renderers: `atom-block`, `plugin-block`)
- **App-specific prompts documented:** 6 (4 with real literal prompt content, 2 flagged as pure plumbing with no prompt text)
- **Media-generation templates transcribed:** 106 total — 48 image + 58 video, every single template's full `prompt` field transcribed verbatim (not summarized), from `prompt-templates/image/*.json` and `prompt-templates/video/*.json`
- **Claude Code skill/command files transcribed:** 3

## Notable findings

### Duplication across `apps/daemon` and `packages/contracts`

The repo maintains **two parallel prompt-composer implementations**:
- `apps/daemon/src/prompts/` — the canonical, actively-developed composer used by the daemon-backed desktop/web app. Supports both filesystem execution (writes real project files) and text-artifact execution (BYOK/plain-API, emits `<artifact>` blocks) via a runtime `executionProfile` switch.
- `packages/contracts/src/prompts/` — an earlier/lighter snapshot used by a separate BYOK/plain-API composer path, fixed permanently to artifact-emission behavior (no `executionProfile` concept at all).

Confirmed via `diff`:
- `directions.ts` is **byte-identical** between the two packages — the 5-direction visual library is shared verbatim.
- `official-system.ts`, `discovery.ts`, `deck-framework.ts`, `media-contract.ts`, and `system.ts` all **diverge**, ranging from cosmetic wording differences (`discovery.ts`) to substantially different composer logic and injected blocks (`system.ts`, `media-contract.ts` — the daemon's `media-contract.ts` is 502 lines vs. the contracts package's 74 lines, missing the generate→wait polling loop, the `hyperframes-html` init-scaffold walkthrough, dynamic model-ID catalogues, and the provider-error-signal taxonomy).
- `atom-block.ts` and `plugin-block.ts` exist **only** in `packages/contracts` and are consumed by the daemon composer, not duplicated there.
- `panel.ts` (Critique Theater) and `research-contract.ts` (web research) exist **only** in `apps/daemon` — no contracts-package equivalent.

Each `system-prompts/*.md` file documents the canonical (daemon) version in full and summarizes the contracts-package divergence inline rather than duplicating near-identical multi-thousand-word content twice.

### Duplication in the media-template catalog

`prompt-templates/image/*.json` and `prompt-templates/video/*.json` (106 files total) are **byte-identical in content** to `plugins/_official/image-templates/<slug>/template.json` and `plugins/_official/video-templates/<slug>/template.json` respectively — the plugin directories repackage the same templates as installable plugins, each adding an `open-design.json` manifest with per-locale i18n title/description translations (not transcribed, since it's translation metadata rather than prompt content). Only the `prompt-templates/` copies were transcribed into `media-templates/`.

`design-templates/open-design-landing/assets/imagegen-prompts.md` and `plugins/_official/examples/open-design-landing/assets/imagegen-prompts.md` are also **byte-identical** (confirmed via `diff`, zero output) — reproduced once as `imagegen-prompts.md` at this directory's root.

### Notably large / small prompts

- Largest single system-prompt file: `apps/daemon/src/prompts/system.ts` (1,688 lines) — the top-level composer, documented in `system-prompts/system.md`.
- Largest single media-generation contract: `apps/daemon/src/prompts/media-contract.ts` (502 lines) vs. its contracts-package counterpart at 74 lines.
- Largest individual media-template prompt found: `social-media-post-fashion-editorial-collage.json` at 6,378 characters (transcribed in full in `media-templates/image-prompts.md`).
- Smallest system-prompt module: `packages/contracts/src/prompts/atom-block.ts` (59 lines) and `plugin-block.ts` (62 lines) — both pure structural renderers with no fixed prompt text of their own.
- The design-direction library (`directions.ts`) and the deck framework skeleton (`deck-framework.ts`'s `DECK_SKELETON_HTML`) are both examples of "prompt as literal deliverable" — complete CSS/HTML/JS documents the agent is instructed to copy verbatim rather than generate.

### Nothing resembling secrets or API keys was found

All 106 media-template JSON files, all system-prompt TypeScript source files, and all skill/app-prompt files were checked for API-key-shaped strings (OpenAI/AWS/Google/GitHub/Slack key formats, PEM private key headers, Bearer tokens) — zero findings. The prompts do reference environment variable *names* used for credential injection (`OD_NODE_BIN`, `OD_BIN`, `OPENAI_API_KEY`, etc.) but never contain actual secret values — this is expected, since the daemon is explicitly designed to never pass API keys through the agent's shell (see the "Never ask the user for an API key" rule in `system-prompts/system.md`'s media-dispatch-hint section).

### Files flagged as containing no real prompt content

Two files in `app-prompts/` were checked per the task brief and found to contain no literal LLM instruction text (pure plumbing/types), and are documented as such rather than fabricated:
- `apps/web/src/onboarding/first-prompt.ts` → `app-prompts/first-prompt.md`
- `apps/daemon/src/media/prompt-templates.ts` → `app-prompts/media-prompt-templates.md` (the actual prompt text this file's types describe lives in `prompt-templates/*.json`, already transcribed in `media-templates/`)

`apps/web/src/runtime/useBrandReadyPrompt.ts` and `apps/web/src/components/BrandReadyPrompt.tsx` were also checked and found to be UI/state logic using i18n `t()` keys rather than literal LLM instruction text — no files were created for them.
