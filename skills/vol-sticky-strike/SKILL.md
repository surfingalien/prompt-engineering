---
name: vol-sticky-strike
description: Use to model how the vol surface reacts to spot moves under the sticky-strike assumption (σ(K) fixed, so ATM vol slides along the skew as spot moves), to predict new vols after a move, compute smile-adjusted P&L and deltas, and test whether the market behaved sticky-strike.
metadata:
  title: "Sticky Strike: σ(K) fixed"
  kind: skill
  domain: trading
  level: expert
  pack: vol-surface
  source: "PromptForge · volatility surface series; Derman (1999) volatility regimes"
  tags: [options, volatility, dynamics, hedging]
---

# Sticky-Strike Dynamics

Under **sticky strike**, each strike keeps its implied vol when spot moves: σ(K) is fixed. With negative skew, a spot rally moves ATM to a higher strike with **lower** vol, so ATM vol slides down along the skew. Derman (1999) described it as one of several regimes markets switch between, alongside sticky delta and sticky implied tree.

## Inputs
<surface_before>
{{surface_before}}
</surface_before>
Spot before → after: {{spot_before}} → {{spot_after}}
<surface_after>
{{surface_after}}
</surface_after> (optional: to test which regime held)

## Do
1. Predict the post-move surface under sticky strike: same σ at each K
2. New ATM vol = σ(K = new spot). Compare it with sticky-delta's prediction (ATM vol unchanged)
3. **Delta**: under sticky strike the Black–Scholes delta is the right hedge (vol at the strike doesn't change with spot)
4. If the actual after-surface is given: regress observed vol changes on the predictions of each regime and report which fits better, and by how much

## Report
A small table of strikes (σ before, σ predicted sticky-strike, σ predicted sticky-delta, σ actual), the regime verdict, and what it means for hedging error and vega P&L on {{position}}. Educational use; not financial advice.
