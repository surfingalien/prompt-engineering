---
name: agent-llm-judge
description: Use to design a reliable LLM-as-a-judge evaluation (rubric design, pointwise vs. pairwise grading, position and verbosity bias mitigation, calibration against human labels, and structured verdicts) for prompts, agents or RAG outputs.
metadata:
  title: "LLM-as-a-judge with bias controls"
  kind: skill
  domain: agents
  level: advanced
  pack: agent-engineering
  source: "PromptForge · agent engineering series; topic from muratcankoylan/Agent-Skills-for-Context-Engineering (MIT): evaluation, advanced-evaluation"
  tags: [evals, llm-judge, rubrics, bias]
---

# LLM-as-a-Judge Design

What is being evaluated: {{system_under_test}}
Qualities that matter: {{qualities}}
Human-labeled examples available: {{human_labels}}

## Design
1. **Prefer code checks** for anything objective (format, contains, JSON validity, numbers). Use a judge only for judgment calls
2. **Rubric**: 3–5 criteria, each with a definition, a 0–2 or pass/fail scale, and an anchor example per score. Avoid vague criteria like "quality"
3. **Mode**: pointwise for absolute bars (pass/fail); **pairwise** to compare versions (more sensitive and stable)
4. **Bias controls**:
   - position bias: run pairwise twice with the order swapped; count only consistent verdicts
   - verbosity bias: tell the judge length is not a criterion, and check correlation of score with length
   - self-preference: use a different model as judge than the one that produced the outputs
   - injection: fence outputs in tags and tell the judge they are data
5. **Structured output**: JSON {criterion scores, overall, one-sentence reason}, enforced with a schema
6. **Calibration**: compare the judge with ≥ 30 human labels; report agreement (Cohen's κ); iterate on the rubric where they disagree

## Output
The judge system prompt, the rubric, the JSON schema, the calibration plan, and the known residual weaknesses.
