---
name: quant-volatility-forecasting
description: Use to estimate and forecast volatility with realized vol, EWMA, GARCH(1,1) and range-based estimators, compare them out-of-sample, and turn forecasts into position-sizing or option-pricing inputs.
metadata:
  title: "Volatility Forecasting: realized, EWMA, GARCH"
  kind: skill
  domain: trading
  level: advanced
  pack: quant-research
  source: "PromptForge · quant research series; topic coverage informed by agiprolabs/claude-trading-skills (MIT): volatility-modeling"
  tags: [quant, volatility, garch, forecasting, risk]
---

# Volatility Forecasting

<returns>
{{returns}}
</returns>
Frequency: {{frequency}} · Forecast horizon: {{horizon}} · Use: {{use_case}} (sizing, VaR, option pricing)

## Estimators
1. **Close-to-close realized**: σ = √(k · mean(r²)), annualized with k periods per year (state k)
2. **Range-based** (if OHLC is available): Parkinson or Garman–Klass, which are more efficient for the same data
3. **EWMA** (RiskMetrics): σ²_t = λσ²_{t−1} + (1 − λ)r²_{t−1}, λ ≈ 0.94 for daily data
4. **GARCH(1,1)**: σ²_t = ω + α r²_{t−1} + β σ²_{t−1}. Report α, β, persistence α + β, half-life ln(0.5)/ln(α + β), and the long-run vol √(ω/(1 − α − β))

## Evaluate
Out-of-sample loss vs. later realized variance (QLIKE or MSE on variance), plus a "volatility cone" of realized vol by horizon showing where today sits.

## Output
Forecast table by method, the recommended estimator and why, and how to use it: e.g. target-volatility sizing, weight = target σ / forecast σ, capped at a maximum leverage.
