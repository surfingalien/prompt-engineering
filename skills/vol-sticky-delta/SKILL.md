---
name: vol-sticky-delta
description: Use to model the vol surface under the sticky-delta (sticky-moneyness) assumption, σ(K/S) fixed so the smile travels with spot. Computes skew-adjusted deltas and hedging differences versus sticky strike.
metadata:
  title: "Sticky Delta: σ(K/S) fixed"
  kind: skill
  domain: trading
  level: expert
  pack: vol-surface
  source: "PromptForge · volatility surface series; Derman (1999) volatility regimes"
  tags: [options, volatility, dynamics, hedging, delta]
---

# Sticky-Delta Dynamics

Under **sticky delta** (or sticky moneyness), implied vol depends on moneyness K/S (or on delta), so the whole smile **travels with spot**: ATM vol stays the same, and a fixed strike's vol changes as spot moves. This is common in FX and in trending equity markets.

## Inputs
<surface>
{{surface}}
</surface>
Spot: {{spot}} · Position: {{position}} · Move scenarios: {{scenarios}} (e.g. ±2%, ±5%)

## Do
1. For each scenario, re-price the surface by shifting the smile so σ(K/S) is unchanged
2. Each strike's new vol, and the vega P&L of the position
3. **Skew-adjusted delta**: Δ_adj = Δ_BS + Vega · ∂σ/∂S. Under sticky delta with negative skew, ∂σ_K/∂S > 0 for a fixed strike, so puts' deltas shrink in magnitude and calls' deltas grow
4. Hedge-ratio difference vs. sticky strike, and the cost of hedging with the wrong model over the scenarios

## Report
A scenario table (spot, σ at key strikes, position P&L under sticky delta vs. sticky strike), the recommended hedge ratio, and which regime recent data supports (if history is given). Educational use; not financial advice.
