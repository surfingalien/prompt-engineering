---
name: agent-context-degradation
description: Use when an agent gets worse as a session grows. Diagnose context failure modes (lost-in-the-middle, context poisoning, distraction, clashing instructions, stale state) from a transcript, and prescribe fixes such as compaction, isolation, restructuring or a fresh start.
metadata:
  title: "Diagnose context degradation"
  kind: skill
  domain: agents
  level: advanced
  pack: agent-engineering
  source: "PromptForge · agent engineering series; topic from muratcankoylan/Agent-Skills-for-Context-Engineering (MIT): context-degradation"
  tags: [context-engineering, agents, debugging, long-context]
---

# Context Degradation Diagnosis

<transcript_or_symptoms>
{{transcript_or_symptoms}}
</transcript_or_symptoms>

Agents often degrade not because the model is weak, but because the context has gone bad. Classify what you see:

| Failure mode | Symptom | Typical fix |
|---|---|---|
| **Lost in the middle** | ignores instructions or facts buried mid-context | move key facts to the start or end; restate them in a short "current state" block |
| **Poisoning** | an early hallucination or wrong fact gets treated as true and repeated | correct it explicitly, or restart from a clean summary that excludes it |
| **Distraction** | huge tool outputs crowd out the task | truncate or summarize tool results; store raw output in files |
| **Clash** | contradictory instructions from different turns or files | consolidate rules into one authoritative block; delete stale ones |
| **Stale state** | acts on an outdated plan or file version | keep plan and state in a file the agent re-reads |
| **Confusion** | too many tools or near-duplicate tools | prune the tool set; sharpen descriptions |

## Output
1. The failure modes present, with quoted evidence (turn numbers)
2. The root cause in one sentence
3. Immediate fix for this session (e.g. a compaction summary you write now)
4. Structural fix for the harness (e.g. tool output limits, a plan file, subagents for noisy work)
5. How to detect it automatically next time
