---
name: autoresearch-prompt-loop
description: Use to run an autonomous improvement loop on a prompt or system prompt against an eval suite. The agent edits prompts.yaml, runs the evals, keeps a change only if the score improves on train cases without regressing held-out cases, and logs everything.
metadata:
  title: "Autoresearch for prompts (eval-driven)"
  kind: skill
  domain: agents
  level: expert
  pack: autoresearch
  source: "PromptForge · Karpathy loop (karpathy/autoresearch, MIT) applied to prompt engineering with promptfoo-style evals"
  tags: [autoresearch, prompt-engineering, evals, optimization]
---

# Autoresearch Loop for Prompts

Prompt file (editable): {{prompt_file}}
Eval suite: {{eval_suite}} (cases with deterministic checks and/or rubrics)
Model under test: {{model}} · Budget: {{max_iterations}} iterations / {{max_spend}}

## Design
1. **Split the cases** 70/30 into train and held-out. The agent sees train failures; held-out results only gate keeps
2. **Metric**: train pass rate (or mean rubric score). Run each case {{repeats}}× when outputs vary, and use the mean
3. **One change per experiment**, of one of these types: clarify an instruction, add or replace an example, restructure with tags, add context or the "why", remove a rule. Record the type
4. **Keep rule**: train score improves beyond noise **and** the held-out score does not drop **and** the prompt doesn't grow more than 15% without a clear gain
5. **Never** edit the eval cases, rubrics or grader prompt; never paste eval answers into the prompt (that is overfitting to the test)
6. Log to results.tsv: commit, train_score, holdout_score, tokens, status, change_type, description

## Output
program.md for the loop, the eval runner command (e.g. `npx promptfoo eval -c evals.yaml -o out.json`) and how to parse the score, and a final report template: the best prompt, its diff from the original, and the score staircase. Re-run the best prompt on a fresh set of cases before shipping it.
