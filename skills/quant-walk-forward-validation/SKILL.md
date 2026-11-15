---
name: quant-walk-forward-validation
description: Use to design time-series validation for a trading strategy or model (walk-forward with rolling or expanding windows, purging and embargo for overlapping labels, combinatorial purged CV (CPCV)), and to report out-of-sample results honestly.
metadata:
  title: "Walk-Forward & Purged Cross-Validation"
  kind: skill
  domain: trading
  level: advanced
  pack: quant-research
  source: "PromptForge · quant research series; topic coverage informed by ml4t/skills (Apache-2.0); methods from López de Prado (2018)"
  tags: [quant, validation, walk-forward, cpcv, overfitting]
---

# Walk-Forward & Purged CV Design

Strategy / model: {{strategy}}
Data span and frequency: {{data_span}}
Label horizon (bars): {{label_horizon}} · Parameters to tune: {{parameters}}

## Design
1. **Window scheme**: rolling (adapts to regimes) vs. expanding (more data). Recommend one, with train length, test length and step size
2. **Purging**: drop training samples whose label window overlaps any test sample
3. **Embargo**: drop ≈ 1–2% of samples (or ≥ label horizon) after each test fold
4. **Tuning** happens only inside training windows (nested), never on test folds
5. **CPCV** (if the data allows): split into N groups, test on every combination of k groups. This gives a distribution of out-of-sample paths instead of one lucky path
6. A final **untouched hold-out** period, run once at the end

## Report template
- Fold table: train dates · test dates · chosen params · OOS Sharpe · OOS max DD · trades
- Distribution of OOS Sharpe across folds/paths (median, 5th percentile)
- Parameter stability: do the chosen params jump around between folds? Instability means overfitting
- Degradation ratio: OOS Sharpe ÷ in-sample Sharpe (< 0.5 is a warning)
Return pseudo-code for the split generator.
