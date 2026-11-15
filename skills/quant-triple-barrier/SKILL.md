---
name: quant-triple-barrier
description: Use to label trading events with the triple-barrier method (profit-take, stop-loss and time barriers scaled by volatility) and optionally meta-labeling, producing ML targets that reflect how a trade would actually exit.
metadata:
  title: "Triple-Barrier Labeling & Meta-Labels"
  kind: skill
  domain: trading
  level: expert
  pack: quant-research
  source: "PromptForge · quant research series; topic coverage informed by ml4t/skills (Apache-2.0): triple-barrier, meta-labels; López de Prado (2018)"
  tags: [quant, machine-learning, labeling, meta-labeling]
---

# Triple-Barrier Labeling

Fixed-horizon labels ("return in 5 days > 0") ignore the path a real trade takes. The triple-barrier method labels each event by **which barrier is touched first**:
- upper (profit-take) at +pt × σ_t
- lower (stop-loss) at −sl × σ_t
- vertical (time) at t + h

## Inputs
Price series and event timestamps: {{data}}
Volatility estimate σ_t (e.g. EWMA of returns, span {{vol_span}}): {{vol_method}}
pt, sl multipliers: {{pt}}, {{sl}} · Max holding h: {{horizon}}
Primary signal side (for meta-labeling, optional): {{side}}

## Steps
1. Compute σ_t at each event with no look-ahead
2. Walk forward from each event to find the first barrier touched; record label (+1 / −1 / 0, or the sign of the return at the vertical barrier), touch time and return
3. **Meta-labeling** (if a side is given): label = 1 if the primary signal's trade hit profit-take, else 0. A secondary model then learns **when to act** and **how big**, not which direction
4. Compute sample uniqueness (labels overlap in time) and use it as a sample weight; purge overlapping labels in CV

## Output
Pseudo-code or Python for the labeler, a label-balance table, the average holding time per label, and guidance on choosing pt/sl/h (match the strategy's real exits; avoid tuning them on the test set).
