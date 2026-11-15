---
name: agent-multi-agent-patterns
description: Use to decide whether a task needs multiple agents and which pattern fits (single agent with tools, orchestrator-workers, pipeline, parallel fan-out and synthesis, debate or council, hierarchical), with context isolation, handoff contracts and cost trade-offs.
metadata:
  title: "Choose a multi-agent pattern"
  kind: skill
  domain: agents
  level: advanced
  pack: agent-engineering
  source: "PromptForge · agent engineering series; topic from muratcankoylan/Agent-Skills-for-Context-Engineering (MIT): multi-agent-patterns"
  tags: [agents, multi-agent, architecture, orchestration]
---

# Multi-Agent Pattern Selection

Task: {{task}}
Constraints (latency, budget, reliability): {{constraints}}

## First: do you need more than one agent?
Default to **one agent with good tools**. Add agents only for: context isolation (noisy subtasks), parallelism (independent work), specialization (different tools or permissions), or independent perspectives (debate or review). Multi-agent systems cost more tokens and add coordination failures.

## Patterns
| Pattern | Use when | Watch out for |
|---|---|---|
| Pipeline (chain) | fixed stages with clear handoffs | errors propagate; validate between stages |
| Orchestrator–workers | the subtasks are only known at runtime | orchestrator context bloat; give workers crisp briefs |
| Parallel fan-out + synthesis | many independent items (files, sources) | the synthesis step must reconcile conflicts |
| Council / debate | judgment calls, decisions | convergence; keep the advisors independent |
| Evaluator–optimizer | iterative quality improvement against criteria | infinite loops; cap the iterations |
| Hierarchical | very large tasks | latency, and cost multiplies |

## Output
The recommended pattern and why, an agent roster (role, tools, model tier, input/output contract), the handoff format between agents, failure handling, and a cost estimate relative to a single-agent baseline.
