---
name: quant-leakage-audit
description: Use to find data leakage in a trading ML pipeline (train/test contamination through scaling, feature selection, target encoding, overlapping labels, or cross-asset information at the same timestamp) and to prescribe a leakage-safe pipeline order.
metadata:
  title: "ML Data Leakage Audit"
  kind: skill
  domain: trading
  level: advanced
  pack: quant-research
  source: "PromptForge · quant research series; topic coverage informed by ml4t/skills (Apache-2.0)"
  tags: [quant, machine-learning, leakage, validation]
---

# Data Leakage Audit (Trading ML)

<pipeline>
{{pipeline}}
</pipeline>

Leakage makes models look predictive in research and fail live. Check, in order:

1. **Split before anything is fit**: scalers, imputers, PCA, feature selection and target encoders must be fit inside each training fold only
2. **Temporal split**: no random K-fold on time series; use walk-forward or purged CV
3. **Overlapping labels**: if labels span h bars, purge training samples whose label window overlaps the test window, and embargo a buffer after it
4. **Cross-sectional leakage**: features that use same-timestamp information from other assets that wasn't available at decision time (e.g. a cross-sectional rank computed after the close)
5. **Target leakage**: features derived from the target or its future (e.g. the next bar's volume)
6. **Duplicate or near-duplicate rows** across train and test (resampled bars, multiple tickers for the same asset)
7. **Selection leakage**: features chosen by looking at full-sample IC

## Output
A findings table (issue · location · severity · fix), a corrected pipeline order as pseudo-code, and a quick sanity test to run after fixing: shuffle the labels in train and confirm out-of-sample skill drops to zero.
