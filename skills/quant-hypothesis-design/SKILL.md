---
name: quant-hypothesis-design
description: Use to turn a market observation or idea into falsifiable trading hypotheses, each with an economic rationale, a precise rule, a test design, success criteria fixed before testing, and kill criteria. Prevents fishing for backtests.
metadata:
  title: "Trading Hypothesis Designer"
  kind: skill
  domain: trading
  level: intermediate
  pack: quant-research
  source: "PromptForge · quant research series; topic coverage informed by tradermonty/claude-trading-skills (MIT): trade-hypothesis-ideator, edge-concept-synthesizer"
  tags: [quant, research, hypothesis, methodology]
---

# Trading Hypothesis Designer

Observation or idea:
<idea>
{{idea}}
</idea>
Markets / data available: {{data_available}}

Produce 3 hypotheses that are **distinct mechanisms**, not parameter variants. For each:

1. **Statement**: "When X happens in Y, Z tends to follow over horizon H, because ___"
2. **Economic rationale**: who is forced, slow, constrained or misinformed, and why the edge isn't arbitraged away
3. **Precise rule**: entry, exit, sizing, universe; no discretion
4. **Test design**: data, period, in-sample/out-of-sample split, costs, benchmark
5. **Success criteria, fixed now**: e.g. OOS Sharpe > 0.8 after costs, ≥ 100 trades, deflated Sharpe ≥ 0.9
6. **Kill criteria**: the result that would make you abandon it
7. **Most likely way it's fooling you**: the bias or confound to rule out first

Rank the three by (plausibility × testability ÷ data cost), and say which to test first and why. Record the number of hypotheses you test: it is needed later for the multiple-testing correction.
