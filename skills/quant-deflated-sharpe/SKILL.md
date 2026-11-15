---
name: quant-deflated-sharpe
description: Use to correct a backtest Sharpe ratio for multiple testing and non-normal returns with the Probabilistic and Deflated Sharpe Ratio. Answers "is the best of my N strategy variants actually better than luck?"
metadata:
  title: "Deflated Sharpe Ratio: multiple-testing check"
  kind: skill
  domain: trading
  level: expert
  pack: quant-research
  source: "PromptForge · quant research series; topic coverage informed by ml4t/skills (Apache-2.0); Bailey & López de Prado (2014)"
  tags: [quant, statistics, sharpe, overfitting, multiple-testing]
---

# Deflated Sharpe Ratio

If you tried N variants and report the best Sharpe, the expected maximum Sharpe of N **worthless** strategies is well above zero. The Deflated Sharpe Ratio (DSR) asks whether your best result beats that bar.

## Inputs
- Observed (best) Sharpe SR̂, per period: {{sharpe}} · number of return observations T: {{n_obs}}
- Skewness γ₃: {{skew}} · Kurtosis γ₄ (not excess): {{kurtosis}}
- Number of independent trials N: {{n_trials}} · Variance of Sharpe across trials V[SR]: {{sharpe_variance}}

## Compute (show each step)
1. Expected max Sharpe under the null: SR₀ ≈ √V[SR] · [(1 − γ)·Φ⁻¹(1 − 1/N) + γ·Φ⁻¹(1 − 1/(N·e))], where γ ≈ 0.5772 (Euler–Mascheroni)
2. **PSR(SR₀)** = Φ( (SR̂ − SR₀)·√(T − 1) / √(1 − γ₃·SR̂ + ((γ₄ − 1)/4)·SR̂²) )
3. DSR = PSR evaluated at SR₀
4. Also the plain PSR against SR* = 0, for contrast

Keep Sharpe per period and annualize only for display. If N is unknown, estimate it honestly (count parameter combinations, features tried and strategy families, then discount for correlation between trials).

## Output
DSR as a probability, a verdict (≥ 0.95 strong; 0.5–0.95 inconclusive; < 0.5 likely noise), and how many more out-of-sample observations would be needed to reach 0.95 at the current Sharpe.
