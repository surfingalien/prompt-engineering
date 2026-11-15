---
name: quant-prediction-market-edge
description: Use to evaluate a prediction-market contract (Kalshi, Polymarket and similar) by converting your forecast into a probability, comparing it with the fee-adjusted price, sizing with fractional Kelly, and checking settlement rules and liquidity before trading.
metadata:
  title: "Prediction Market Edge (fee-aware)"
  kind: skill
  domain: trading
  level: intermediate
  pack: quant-research
  source: "PromptForge · quant research series; topic coverage informed by agiprolabs/claude-trading-skills (MIT): prediction-market-strategy"
  tags: [prediction-markets, probability, kelly, forecasting]
---

# Prediction Market Edge

Contract: {{contract}} · Settlement rules: {{settlement_rules}}
Order book (yes/no bids and asks): {{order_book}}
Fees: {{fees}} · Bankroll: {{bankroll}}
Evidence for my forecast: {{evidence}}

## Steps
1. **Read the settlement rules** carefully: source, timestamp and edge cases. Many "mispricings" are rule ambiguity
2. **Your probability** p: build it from base rates first, then adjust with evidence. State the 80% interval of your own uncertainty
3. **Market probability**: the yes ask (to buy yes) or 1 − the no ask (to buy no). This is the price you'd actually pay, not the last trade
4. **Fee-adjusted edge**: expected value per contract = p·(1 − price) − (1 − p)·price − fees. Require edge > fees + your uncertainty margin
5. **Sizing**: Kelly for a binary contract f* = (p − price)/(1 − price) for a yes buy. Use ¼ Kelly or less, and cap per-event exposure
6. **Liquidity**: depth at your price, and whether you could exit before settlement
7. **Correlation**: other positions resolving on the same underlying event

## Output
A decision (BUY YES / BUY NO / PASS), edge in cents and %, size, the strongest argument against your view, and a note to log for calibration tracking (forecast vs. outcome).
