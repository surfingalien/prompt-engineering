---
name: vol-risk-reversal
description: Use to compute and interpret the 25-delta risk reversal (RR25 = σ25ΔC − σ25ΔP), the market's gauge of skew direction. Negative RR means the market fears the downside. Includes history percentiles and cross-asset comparison.
metadata:
  title: "Risk Reversal: 25Δ RR"
  kind: skill
  domain: trading
  level: advanced
  pack: vol-surface
  source: "PromptForge · volatility surface series"
  tags: [options, volatility, risk-reversal, skew, fx]
---

# 25Δ Risk Reversal

**RR25 = σ(25Δ call) − σ(25Δ put)**

- Negative: puts richer, so the market fears the downside (typical for equity indices)
- Positive: calls richer, so the market pays for upside (e.g. some FX pairs, commodities in supply shocks, squeezed stocks)
It measures the **direction** of the skew; the butterfly measures its curvature.

## Data
<vol_quotes>
{{vol_quotes}}
</vol_quotes>
Underlying: {{underlying}} · Tenors: {{tenors}} · History (optional): {{history}}

## Compute
1. RR25 (and RR10 if available) per tenor; normalize by ATM vol
2. The term structure of RR: is the fear concentrated in the front end?
3. Percentile vs. history, and day-over-day change
4. If several assets are given: rank them by RR to show where downside fear is most and least priced

## Interpret
Translate the number into a market narrative ("1M RR −5.5 vols, 92nd percentile of downside demand"), name the likely drivers, and give trade expressions (buy or sell the risk reversal, collars), with the skew and gap risk of each. Educational use; not financial advice.
