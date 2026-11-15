---
name: vol-butterfly
description: Use to compute and interpret the 25-delta butterfly (BF25 = ½(σ25ΔC + σ25ΔP) − σATM), which measures smile curvature (how much extra the market pays for both tails), and to decide whether the wings are rich or cheap.
metadata:
  title: "Butterfly: 25Δ BF"
  kind: skill
  domain: trading
  level: advanced
  pack: vol-surface
  source: "PromptForge · volatility surface series"
  tags: [options, volatility, butterfly, smile, tails]
---

# 25Δ Butterfly

**BF25 = ½ (σ25ΔC + σ25ΔP) − σ_ATM**

It measures the **curvature** of the smile: how much extra the market pays for both tails relative to ATM. With the risk reversal (direction) and ATM vol (level), it pins down the smile: σ25ΔC ≈ σ_ATM + BF + ½RR and σ25ΔP ≈ σ_ATM + BF − ½RR.

## Data
<vol_quotes>
{{vol_quotes}}
</vol_quotes>
Underlying: {{underlying}} · Tenors: {{tenors}} · Realized return history (optional): {{returns}}

## Compute
1. BF25 (and BF10) per tenor, absolute and relative to ATM
2. Reconstruct the 25Δ call and put vols from ATM, RR and BF, and check consistency with the quotes
3. Note the FX quoting convention: market "broker" (strangle) butterflies differ from the "smile" butterfly; state which one the data uses
4. Compare implied tail pricing with realized kurtosis and the frequency of large moves

## Interpret
Say whether the wings are rich or cheap and why (events, positioning, liquidity), and give the structures that express each view (long or short strangle vs. straddle, butterflies), including the unlimited-loss risk of short wings. Educational use; not financial advice.
