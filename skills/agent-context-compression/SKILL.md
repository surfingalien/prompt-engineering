---
name: agent-context-compression
description: Use to compress a long agent session into a compact, lossless-where-it-matters handoff summary (goal, decisions, current state, open threads, key facts, next steps) so work continues in a fresh context without drift.
metadata:
  title: "Context compression & handoff summary"
  kind: prompt
  domain: agents
  level: intermediate
  pack: agent-engineering
  source: "PromptForge · agent engineering series; topic from muratcankoylan/Agent-Skills-for-Context-Engineering (MIT): context-compression, context-optimization"
  tags: [context-engineering, compaction, handoff, agents]
---

# Context Compression

<session>
{{session_transcript}}
</session>

Write a summary that lets a capable agent with **no access to the session** continue the work correctly. Compress aggressively, but never lose:
- the **goal** and the user's explicit constraints and preferences (quote them exactly)
- **decisions made**, and the reason for each (so they aren't relitigated)
- **current state**: what is done and verified, what is done but unverified, what is in progress
- **facts that were expensive to learn**: file paths, commands that work, error messages and their causes, API quirks
- **open threads** and blockers
- **next 3 steps**, concretely

Drop: exploration dead-ends (one line each, so they aren't retried), verbose tool output, pleasantries.

## Format
```
<handoff>
GOAL: ...
CONSTRAINTS (verbatim): ...
DECISIONS: ...
STATE: done ✓ / unverified ? / in progress …
KEY FACTS: ...
DEAD ENDS: ...
NEXT: 1. 2. 3.
</handoff>
```
Target ≤ {{max_words}} words. After writing it, list anything you were unsure whether to keep.
