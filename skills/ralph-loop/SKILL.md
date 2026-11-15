---
name: ralph-loop
description: Use to set up a fresh-context build loop (the "Ralph" technique) that feeds the same PROMPT.md to a coding agent again and again, one task per iteration, with specs, a fix plan and tests as back-pressure. For long builds that outgrow a single context window.
metadata:
  title: "Ralph loop: fresh-context build loops"
  kind: skill
  domain: coding
  level: expert
  pack: autoresearch
  source: "PromptForge · technique popularized by Geoffrey Huntley (\"Ralph Wiggum as a software engineer\", 2025): while :; do cat PROMPT.md | agent; done"
  tags: [loops, agents, claude-code, coding, automation, context-engineering]
---

# Ralph loop: fresh-context build loops

The whole technique is one line of shell: run the agent on the same prompt, forever.

```bash
while :; do cat PROMPT.md | claude -p; done
```

Each iteration starts with an **empty context window**. Nothing carries over except what is on disk: the specs, a fix plan, the code, the tests and the git history. That is the point. Long tasks no longer degrade as one context fills up, and every iteration sees the project as it really is.

## The files
- **`PROMPT.md`**: the loop prompt, identical every iteration.
- **`specs/`**: what to build, one file per area. The source of truth.
- **`fix_plan.md`**: a prioritized checklist the agent maintains: pick the top item, do it, update the list, add anything new it found.
- **`AGENT.md`** (or `CLAUDE.md`): how to build, run and test the project; the agent adds what it learns.
- **Tests and type checks**: the back-pressure that tells each iteration whether it broke something.

## Write the setup for this project
Project: {{project}}
What to build: {{goal}}
Build and test commands: {{commands}}

Produce:
1. **`PROMPT.md`**, following the template below, adapted to the project.
2. A first **`fix_plan.md`**: the work broken into items small enough for one iteration each, in dependency order.
3. **`specs/`** outlines for each area named in the goal.
4. The **runner** (see below) with an iteration cap and a stop file.
5. A **review routine** for the human: what to read each morning, and when to stop the loop and fix the prompt instead.

## PROMPT.md template
```
<orient>
Study specs/ and fix_plan.md. Study AGENT.md for how to build and test.
Before changing code, search the codebase: do not assume something is missing.
</orient>

<task>
Choose the single most important unchecked item in fix_plan.md. Do only that item.
Implement it completely: no placeholders, stubs or TODOs.
</task>

<verify>
Run the tests and type checks for the code you changed. If they fail, fix them before anything else.
</verify>

<record>
Update fix_plan.md: check off the item, add anything new you discovered (bugs, missing pieces) in priority order.
If you learned how to build or test something, add it to AGENT.md.
Commit with a message saying what you did and why.
</record>

<rules>
- One item per iteration.
- Never delete or weaken a test to make it pass.
- If an item is blocked, write why under it in fix_plan.md and move to the next one.
- If every item is checked and the specs are met, create the file DONE and stop.
</rules>
```

## A safe runner
```bash
#!/usr/bin/env bash
# Stop by creating the file STOP; the agent creates DONE when the plan is finished.
max=${MAX_ITERATIONS:-50}
for i in $(seq 1 "$max"); do
  [ -f STOP ] || [ -f DONE ] && break
  echo "=== iteration $i $(date -Is)" | tee -a ralph.log
  cat PROMPT.md | claude -p --max-turns 60 2>&1 | tee -a ralph.log
done
```
Run it in a container or a disposable branch, with only the permissions the build needs. Allow edits and the project's own build and test commands; do not hand it production credentials. Check `git log` regularly; every iteration should leave one clear commit.

## Tuning the prompt
Ralph's mistakes are signals about the prompt, not reasons to give up:
- **Re-implements something that exists** → strengthen "search before changing code".
- **Leaves stubs** → restate "implement completely" and add a test that catches it.
- **Goes in circles on one item** → split the item, or write a spec for it.
- **Breaks earlier work** → add the missing tests; tests are the only memory of what used to work.

## When not to use it
Small tasks that fit one session, work that needs judgement calls at every step, or anything touching production. A Ralph loop is for building, in an environment where a bad iteration costs only a `git revert`.
