---
name: autoresearch-program-md
description: Use to write the program.md (or CLAUDE.md) that drives an autonomous experiment loop, defining the goal, single metric, editable vs. read-only files, the keep/discard rule, logging format, guards, budget and the "never stop, never ask" operating mode.
metadata:
  title: "Write program.md for an autoresearch loop"
  kind: prompt
  domain: agents
  level: expert
  pack: autoresearch
  source: "PromptForge · pattern from karpathy/autoresearch (MIT), where the human iterates on program.md instead of the code"
  tags: [autoresearch, agents, claude-md, instructions]
---

# program.md writer

In autoresearch, `program.md` is the human's lever: you improve the **instructions**, and the agent improves the code. Write one for:

- Project: {{project}}
- What to optimize: {{objective}}
- Metric command and direction: {{metric_command}} ({{direction}})
- Editable file(s): {{editable}}
- Read-only files: {{read_only}}
- Time budget per run: {{time_budget}}
- Guards that must pass: {{guards}}
- Budget: {{max_iterations}} iterations / {{max_spend}}

## Required sections (in this order)
1. **Goal**: one paragraph, including why this metric matters
2. **The metric**: the exact command, how to parse the number, direction, noise level and what counts as a real improvement (e.g. > 2× run-to-run noise)
3. **What you may change**: the editable scope, plus ideas worth exploring, ranked
4. **What you must not touch**: read-only files, no new dependencies, never edit the evaluation
5. **The loop**: commit → run → measure → keep or `git reset --hard HEAD~1` → log to results.tsv (exact columns)
6. **Guards**: tests and limits; a failure means discard
7. **Simplicity**: "all else equal, simpler is better; a tiny gain that adds hacky code isn't worth it, while a gain from deleting code is"
8. **Operating mode**: keep going without asking for permission until the budget is reached; on a crash, log it and move on
9. **Re-baseline**: every N runs, re-measure the best commit and the original baseline

Write it in calm, direct language with the reason behind each rule. No all-caps shouting: current models follow instructions closely, and explained rules generalize better.
