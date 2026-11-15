---
name: autoresearch-loop
description: Use to set up a Karpathy-style autonomous experiment loop that runs while you sleep. The agent edits one file, runs a fixed-time experiment, measures one metric, keeps improvements, discards regressions with git, and logs every run to results.tsv. Works for ML training, performance, bundle size, prompts and strategies.
metadata:
  title: "The Karpathy Loop: autonomous experiments"
  kind: skill
  domain: agents
  level: expert
  pack: autoresearch
  source: "PromptForge · pattern from karpathy/autoresearch (MIT): program.md, a single editable train.py, fixed 5-minute runs, val_bpb, keep/discard"
  tags: [autoresearch, agents, experimentation, optimization, git]
---

# The Karpathy Loop

Andrej Karpathy's **autoresearch** lets an agent run experiments on its own: edit the code, train for a fixed 5 minutes, check whether the metric improved, keep or discard, repeat. That is roughly 12 experiments per hour, about 100 overnight. The human's job shifts from editing code to writing `program.md`.

## The loop
```
LOOP until stopped or budget spent:
  1. Read current state (program.md, the editable file, results.tsv)
  2. Make ONE targeted change to the editable file
  3. git commit -m "<what and why>"
  4. Run the experiment with a fixed time budget, output to run.log
  5. Parse the single metric
  6. Better than best → KEEP (branch advances)
     Worse or crashed → DISCARD (git reset --hard HEAD~1)
  7. Append a row to results.tsv: commit, metric, resources, status, description
```

## Set it up for this project
Project: {{project}}
Goal: {{goal}}

Design and write out:
1. **Metric**: one scriptable number and its direction (e.g. `val_bpb` lower, `req/s` higher, `bundle_kb` lower, eval score higher), and the exact command that prints it
2. **Editable scope**: the ONE file (or tiny set) the agent may change. Everything else is read-only, especially the evaluation code
3. **Time budget** per experiment (fixed wall-clock, so results are comparable), and how to kill a run that overruns
4. **Guards** that must still pass (tests, memory ceiling, correctness checks); a failing guard means discard, whatever the metric says
5. **Simplicity criterion**: a tiny gain that adds complexity is not worth keeping; the same gain from deleting code is
6. **Budget**: max iterations and max spend, with the loop stopping when either is hit
7. **Anti-gaming**: re-run the best commit against the original baseline every N iterations; keep a held-out check the agent never sees

## Output
- `program.md` (ready to use), including the rules above
- `results.tsv` header: `commit	metric	resource	status	description`
- A runner script (bash or Python) for the loop, or instructions for running it inside Claude Code with the loop rules in CLAUDE.md
- A "morning checklist" for the human (see the results-review skill)

## Pitfalls to design against
Local optima (run several loops from different starting points), metric gaming, compounding noise (repeat promising runs), and runaway cost (hard caps). Never let the agent edit the evaluation.
