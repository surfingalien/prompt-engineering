---
name: agent-long-horizon-brief
description: Use to write the task brief for a long-running or autonomous agent session (hours of work, many tool calls, maybe subagents), covering the outcome, context, constraints, definition of done, verification, checkpoints and when to stop or escalate, given up front in one message.
metadata:
  title: "Long-horizon agent task brief"
  kind: prompt
  domain: agents
  level: advanced
  pack: agent-engineering
  source: "PromptForge · agent engineering series; topic from muratcankoylan/Agent-Skills-for-Context-Engineering (MIT): long-horizon-prompting"
  tags: [agents, task-brief, autonomy, prompting]
---

# Long-Horizon Task Brief

Current models do their best long-running work when the **complete** task is specified up front, rather than revealed over many interactive turns. Write a brief for:

Task: {{task}}
Environment and tools: {{environment}}
Stakeholders and who reviews the result: {{reviewers}}

## Brief structure
1. **Outcome**: what exists when this is done, described as a deliverable
2. **Context**: why it matters, who uses it, relevant history and prior attempts
3. **Scope**: in scope, out of scope, and files or areas not to touch
4. **Constraints**: tech, style, budget (time and tokens), safety rules, actions that need human confirmation
5. **Definition of done**: checkable criteria, including tests that must pass
6. **Verification**: how the agent proves each criterion (commands, checks), and what to do if one can't be verified (say so; don't claim it)
7. **Working method**: plan first and save it to a file; checkpoint progress to a file every major step; prefer small verifiable increments
8. **Escalation**: stop and report when blocked by missing access, ambiguous requirements with high cost of error, or repeated failure (state N)
9. **Final report**: what changed, evidence, what is unverified, follow-ups

Keep it direct and calm, with the reason for each rule. Avoid prescribing every step: describe the goal and constraints, and let the agent plan.
