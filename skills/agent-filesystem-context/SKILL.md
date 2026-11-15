---
name: agent-filesystem-context
description: Use to give an agent durable working memory on the filesystem (plan files, progress logs, notes and offloaded tool output) so long tasks survive context limits and compaction, and the agent can rediscover context on demand instead of holding it all in the prompt.
metadata:
  title: "Filesystem as agent context"
  kind: skill
  domain: agents
  level: intermediate
  pack: agent-engineering
  source: "PromptForge · agent engineering series; topic from muratcankoylan/Agent-Skills-for-Context-Engineering (MIT): filesystem-context"
  tags: [agents, context-engineering, files, planning]
---

# Filesystem Context Pattern

Task: {{task}} · Workspace: {{workspace}}

Set up and follow this file protocol:

| File | Purpose | Rule |
|---|---|---|
| `PLAN.md` | goal, steps, status of each | write before starting; update after each step |
| `PROGRESS.log` | append-only log of actions and results | one line per meaningful action, with time |
| `NOTES.md` | facts learned (paths, commands, gotchas) | add when something was expensive to learn |
| `scratch/` | large tool outputs, data dumps | save there and keep only a short summary in context |
| `DECISIONS.md` | choices and the reason for each | prevents re-deciding after compaction |

## Operating rules
- At the start (or after compaction), read PLAN.md, the last 20 lines of PROGRESS.log, and NOTES.md before acting
- Never paste outputs over ~200 lines into context; write them to `scratch/` and grep or summarize
- Mark each plan step `[ ]`, `[~]` in progress, `[x]` done and verified, or `[!]` blocked (with the reason)
- Keep files concise. They are re-read often, so they cost context

## Output
The initial PLAN.md for this task, and a short CLAUDE.md snippet that tells the agent to follow this protocol.
