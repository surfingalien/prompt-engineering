---
name: vol-variance-swap
description: Use to price, replicate and analyze variance swaps (payoff N_var·(σ²_realized − K_var), replicated by a 1/K²-weighted strip of OTM options). Covers fair strike, vega-notional conversion and long/short P&L vs. realized volatility.
metadata:
  title: "Variance Swap: a pure bet on realized variance"
  kind: skill
  domain: trading
  level: expert
  pack: vol-surface
  source: "PromptForge · volatility surface series; Demeterfi, Derman, Kamal & Zou (1999)"
  tags: [options, volatility, variance-swap, replication]
---

# Variance Swap Analysis

Payoff at expiry: **N_var · (σ²_R − K_var)**, where σ²_R is annualized realized variance. It is a pure bet on realized variance, with no path-dependent delta hedging needed. Demeterfi et al. (1999) showed that a variance swap can be replicated by a static strip of OTM options weighted by **1/K²**, which is why it is priced from the whole skew.

## Inputs
<option_chain>
{{option_chain}}
</option_chain>
Forward F: {{forward}} · Rate r: {{rate}} · Maturity T (years): {{maturity}}
Realized prices (optional, for mark-to-market): {{price_history}}
Vega notional: {{vega_notional}}

## Compute
1. **Fair strike**: K_var ≈ (2e^{rT}/T) · Σ_i (ΔK_i / K_i²) · Q(K_i) − (1/T)(F/K₀ − 1)², using OTM puts below K₀ and calls above it (the CBOE VIX-style discretization). Report √K_var as "variance strike in vol points"
2. Compare √K_var with ATM vol: the gap reflects skew (puts weigh more through 1/K²)
3. **Notional conversion**: N_var = N_vega / (2·K_vol)
4. **Realized variance** = (252/n) · Σ ln(S_i/S_{i−1})² (state the convention: zero mean, 252 days)
5. Mark-to-market for a seasoned swap: blend realized-to-date with implied for the remaining period, weighted by elapsed time

## Report
Fair strike, the replication weights table (largest contributions), P&L scenarios for realized vol at −5, 0 and +5 vols vs. strike, and the risks: convexity (short variance loses quadratically in crashes), strike truncation, and liquidity in far wings. Educational use; not financial advice.
