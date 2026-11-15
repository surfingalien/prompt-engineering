---
name: quant-lookahead-audit
description: Use to audit a backtest or ML pipeline for look-ahead bias and point-in-time violations (future data in features, labels, universe selection, fundamentals used before their release date, or same-bar fills) before trusting any result.
metadata:
  title: "Look-Ahead & Point-in-Time Audit"
  kind: skill
  domain: trading
  level: advanced
  pack: quant-research
  source: "PromptForge · quant research series; topic coverage informed by ml4t/skills (Apache-2.0)"
  tags: [quant, backtesting, bias, point-in-time, validation]
---

# Look-Ahead & Point-in-Time Audit

A backtest is only as honest as its timestamps. Audit the code and data below for any way the strategy could know something before it was knowable.

<pipeline>
{{pipeline_code_or_description}}
</pipeline>
Data sources and their timestamps: {{data_sources}}

## Check each item and cite the line or field
1. **Signal timing**: is the signal computed on bar t and traded at t's close (look-ahead), or traded at t+1 open (correct)?
2. **Rolling windows**: do rolling stats, normalizations or z-scores include the current or future rows (centered windows, full-sample mean or scaling)?
3. **Fundamentals and alt data**: are they keyed by **availability date** (filing or release), not period-end date? Restatements must use the vintage known at the time
4. **Universe**: is the universe built from today's constituents (look-ahead and survivorship) or point-in-time membership?
5. **Labels**: do labels overlap the next sample's features without purging?
6. **Corporate actions**: are splits and dividends applied with knowledge of future adjustments in a way that leaks?
7. **Fills**: are trades filled at prices that include the signal bar's high/low or close you couldn't have traded?
8. **Hyperparameters**: were they tuned on the test period?

## Output
A table (check · status ok/violation/unclear · evidence · fix), then the expected direction and rough size of the bias each violation introduces, then a corrected pseudo-code snippet for the worst issue. Results with any unresolved violation should be reported as **invalid**, not "slightly optimistic".
