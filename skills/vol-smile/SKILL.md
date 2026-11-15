---
name: vol-smile
description: Use to analyze a volatility smile (both OTM wings priced above ATM, typical in FX and single names around events) and to quantify wing richness, infer what tail risk the market prices, and compare it with realized tail behavior.
metadata:
  title: "Smile: fat tails"
  kind: skill
  domain: trading
  level: advanced
  pack: vol-surface
  source: "PromptForge · volatility surface series"
  tags: [options, volatility, smile, tails, fx]
---

# Volatility Smile Analysis

A **smile** is a U-shaped implied vol curve: OTM wings > ATM on both sides. It says the market prices **fatter tails than a lognormal** (Black–Scholes) distribution: large moves in either direction are more likely than the model assumes. It is common in FX, and around binary events such as earnings or elections.

## Data
<smile>
{{smile}}
</smile>
Underlying: {{underlying}} · Expiry: {{expiry}} · Realized return history (optional): {{returns}}

## Compute
1. ATM vol; vol at 10Δ and 25Δ on both sides
2. Wing premium: σ(25Δ) − σ_ATM for each side, and its symmetry
3. Curvature, e.g. a quadratic fit σ(k) = a + b·k + c·k², where k = ln(K/F); c > 0 is the smile
4. Implied risk-neutral distribution features if strikes are dense (Breeden–Litzenberger: the density is proportional to ∂²C/∂K²)
5. If returns are given: realized kurtosis and the frequency of > 2σ moves, compared with what the wings imply

## Interpret
Say whether the tails look rich or cheap versus realized behavior and upcoming events, and which structures express each view (strangles, butterflies, ratio spreads), with their tail risks stated plainly. Educational use; not financial advice.
