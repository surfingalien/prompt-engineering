# About PromptForge

## What it is

PromptForge is a prompt engineering studio for Claude. It takes you from your very first prompt to designing the harness around a production agent: learn the principles, build prompts with guidance, test them against Claude, measure them with evals, and export the files an agent needs.

## Why it exists

Most people write prompts like text messages (short, vague, full of assumptions) and then wonder why the answer is generic. Prompt engineering is the skill of giving a model the context, structure and success criteria it needs. As work moves from single prompts to agents, the skill grows into *harness engineering*: the system prompt, project memory, tools, skills, subagents, guardrails and evals that make an agent dependable.

PromptForge teaches both in one place, for free and open source, with every lesson connected to a tool you can use right away.

## The path

1. **Foundations.** Clear and direct, context and why, output format, examples.
2. **Structure.** XML tags, system prompts, long documents, thinking and effort.
3. **Systems.** Prompt chaining, structured output, tool design, prompt-injection defense.
4. **Harness.** What a harness is, CLAUDE.md, skills and subagents, evals.

## What makes it different

- **It teaches, then hands you the tool.** Each lesson ends with an exercise that opens in the Workbench.
- **It's opinionated about quality.** The analyzer explains *why* something is weak and how to fix it, grounded in current Claude guidance.
- **It goes past prompts.** The Harness studio and Evals cover what separates a demo from an agent you can trust.
- **It's yours.** Everything is stored in your browser; export it any time. No account required.

## Technology

- **Front end:** framework-free ES modules with no build step, an editorial design system, light and dark themes
- **Back end:** Node.js + Express 5 using the official Anthropic SDK (streaming, effort control, structured outputs, refusal fallbacks)
- **Models:** Claude Opus 5.5, Sonnet 5.5, Haiku 5.5 and Fable 5.2, or free models through a self-hosted OpenAI-compatible gateway (OmniRoute, FreeLLMAPI) with no Claude key
- **Deployment:** Docker (Railway-ready), with an opt-in OmniRoute service; offline mode when no model provider is set

## Numbers

| | |
|---|---|
| Lessons | 17 across 4 levels |
| Library items | 570 (514 curated + 56 installable skills in 6 collections) |
| Builder blueprints | 8 |
| Harness templates | 5 |
| Automated tests | 104 (plus a live smoke test and CI) |
| Runtime dependencies | 4 |

## Who built it

Built by [@surfingalien](https://github.com/surfingalien), synthesizing work from 30+ open-source repositories (see the README for the full list). The AI Intelligence Scout is an original feature; attribution is required for derivative works.

## License

MIT, with attribution required. See the README.
