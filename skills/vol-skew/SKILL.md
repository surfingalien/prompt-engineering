---
name: vol-skew
description: Use to measure and interpret implied-volatility skew (∂σ/∂K < 0 in equity indices, where puts trade richer than calls), quantify its steepness, compare it to history, and explain what it says about demand for downside protection.
metadata:
  title: "Skew: puts > calls"
  kind: skill
  domain: trading
  level: advanced
  pack: vol-surface
  source: "PromptForge · volatility surface series"
  tags: [options, volatility, skew, derivatives]
---

# Volatility Skew Analysis

In equity indices, implied vol **rises as strikes fall** (∂σ/∂K < 0): downside protection costs more, because crashes are faster than rallies, investors structurally buy puts, and spot and vol are negatively correlated.

## Data
<vol_surface>
{{vol_surface}}
</vol_surface>
Underlying: {{underlying}} · Spot: {{spot}} · Expiries to analyze: {{expiries}}

## Compute for each expiry
1. ATM vol (at-the-forward, or 50Δ)
2. **Skew slope**: σ(90% moneyness) − σ(110% moneyness), and per 10% moneyness
3. **25Δ put − ATM** (downside premium) and **ATM − 25Δ call** (upside discount)
4. Skew normalized by ATM vol (skew / σ_ATM), to compare across volatility regimes
5. If history is provided: the percentile of today's skew over the lookback window

## Interpret
- Steep skew: heavy hedging demand or crash fear. Cheap calls versus expensive puts favor put spreads or call overwrites
- Flat or inverted skew (e.g. some commodities or meme stocks): demand for upside (squeeze risk)
- Skew changes across expiries: front-end skew spikes around events

Output a table per expiry, a two-line conclusion, and trade expressions that monetize the view (e.g. put spread vs. outright put), each with its risk. Educational use; not financial advice.
