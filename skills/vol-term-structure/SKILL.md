---
name: vol-term-structure
description: Use to analyze the ATM implied volatility term structure σ_ATM(T): upward-sloping in calm markets, inverted in stress. Computes forward volatilities between expiries, isolates event vol, and reads the regime.
metadata:
  title: "Term Structure: ATM vol vs. expiry"
  kind: skill
  domain: trading
  level: advanced
  pack: vol-surface
  source: "PromptForge · volatility surface series"
  tags: [options, volatility, term-structure, events]
---

# Volatility Term Structure

How ATM implied vol changes across maturities:
- **Calm**: upward-sloping (contango), because longer horizons carry more uncertainty and risk premium
- **Stress**: **inverted**, because near-term fear dominates (front vol > back vol)

## Data
<term_structure>
{{term_structure}}
</term_structure>
Underlying: {{underlying}} · Known events (earnings, CPI, FOMC, elections): {{events}}

## Compute
1. The σ_ATM(T) curve and its slope (e.g. 3M − 1M, 12M − 3M)
2. **Forward vol** between expiries T₁ < T₂, using total variance: σ_fwd = √[(σ₂²T₂ − σ₁²T₁)/(T₂ − T₁)]. Flag negative forward variance (an arbitrage or data error)
3. **Event vol**: for an expiry spanning an event, back out the event-day move with σ²_total·T = σ²_base·(T − 1/252) + σ²_event/252, and convert it to an implied ±% move
4. Compare with realized vol over matching windows (the vol risk premium)

## Interpret
Name the regime (contango / flat / inverted) and what it signals, where the event premia sit, and calendar-spread ideas, each with its risk. Use calendar days vs. trading days consistently and state which. Educational use; not financial advice.
