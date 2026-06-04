# About PromptForge

## What It Is

PromptForge is an AI Prompt Engineering Studio — a web application that helps you write better instructions for AI systems like Claude, ChatGPT, and Gemini.

Think of it as a professional writing desk for talking to AI. Instead of typing a random message and hoping for the best, PromptForge gives you templates, techniques, agents, and tools to craft precise, effective prompts every time.

## Why It Exists

Most people write AI prompts the same way they send a text message — short, vague, and full of assumptions. Then they wonder why the AI gave them something useless.

Prompt engineering is the skill of writing clear, structured instructions that produce reliable, high-quality AI outputs. It's the difference between asking "write me an email" and getting something generic, versus using a structured template and getting something you can actually send.

PromptForge was built to democratize that skill. Everything you need — from beginner-friendly templates to production-grade agent workflows — is in one place, free, and open source.

## Who Built It

Built by [@surfingalien](https://github.com/surfingalien), synthesizing work from 15+ open-source repositories and community contributors across the AI/ML ecosystem.

The application stands on the shoulders of contributors to:
- DAIR.AI's Prompt Engineering Guide (75k+ stars)
- affaan-m/ECC — real AI engineering patterns
- rohitg00's AI Engineering from Scratch curriculum
- awesome-claude-code-toolkit agent library
- tenfoldmarc's LLM Council methodology
- huytieu's COG Second Brain system
- And many more (see README for full list)

## What Makes It Different

**It's not just a prompt library.** Every other prompt collection is a static list you scroll through. PromptForge is a studio — you write, optimize, test with AI, score, and iterate. The prompts are starting points, not endpoints.

**It's opinionated about quality.** Every skill and template in the library comes from engineers who ran these patterns in production. Nothing is aspirational fluff.

**It's the whole stack.** Single editor for writing. Skills library for patterns. Agents library for system prompts. Council for decisions. Optimizer for refinement. Design system generator. Second brain. All in one page, no signup required.

## Technology

- **Frontend:** Vanilla JS + HTML/CSS — no framework, loads instantly
- **Backend:** Node.js + Express — minimal server with one job: proxy AI API calls safely
- **AI:** Anthropic Claude API (via server-side proxy — API key never reaches the browser)
- **Deployment:** Railway (Docker, auto-deploy on push to `main`)
- **Data:** All prompts, skills, and agents are embedded directly in `index.html` — works offline after first load

## Numbers

| Metric | Count |
|--------|-------|
| Prompt skills | 300+ |
| Specialist agents | 190+ |
| Source repositories synthesized | 15+ |
| Views / modes | 9 |
| Lines of source | ~2,300 |
| External dependencies | 1 (Express) |

## Roadmap Ideas

- Prompt version history with diff view
- Team sharing and collaboration
- Eval harness — test prompts against a suite of cases
- Custom agent builder — compose agents from skill blocks
- Export to CLAUDE.md / system prompt files

## License

MIT — use it, fork it, build on it.
