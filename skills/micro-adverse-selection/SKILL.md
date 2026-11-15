---
name: micro-adverse-selection
description: Use to measure adverse selection, where the fill you get is the one you didn't want, using markouts, the Glosten-Milgrom intuition and order-flow toxicity, and to decide when passive quoting is losing to informed traders.
metadata:
  title: "Adverse Selection: Glosten–Milgrom"
  kind: skill
  domain: trading
  level: advanced
  pack: microstructure
  source: "PromptForge · market microstructure series; Glosten & Milgrom (1985), Easley et al. VPIN (2012)"
  tags: [microstructure, adverse-selection, market-making, toxicity]
---

# Adverse Selection Analysis

Market makers widen spreads to survive informed flow. In the Glosten–Milgrom model, the spread rises with the probability that the counterparty is informed: the more informed traders, the wider the spread a market maker needs to break even. For a passive trader the symptom is simple: **your fills are followed by the price moving against you**.

## Data
<fills>
{{fills}}
</fills>
<mid_prices>
{{mid_prices}}
</mid_prices>
Markout horizons: {{horizons}} (e.g. 1s, 10s, 1m, 5m)

## Compute
1. **Markout** per fill at each horizon: q · (m₊h − p) / p in bps (q = +1 buy, −1 sell). Negative means adverse selection.
2. Average markout curve by horizon, overall and split by: passive vs. aggressive fills, order size bucket, time of day, counterparty or venue (if known)
3. **Spread capture vs. markout**: realized edge = half-spread earned + markout. Is passive quoting net positive?
4. A toxicity proxy: order-flow imbalance in volume buckets (VPIN-style) before your worst fills

## Report
- A markout table and a short description of the curve's shape (fast decay = latency-driven; slow drift = information)
- Which fills are toxic, and the pattern behind them
- Actions: widen or skew quotes, cancel faster around news, avoid specific venues or times, or shrink size when imbalance is high
State clearly when the sample is too small for the conclusions.
