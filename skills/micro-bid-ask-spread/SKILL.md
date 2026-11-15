---
name: micro-bid-ask-spread
description: Use to measure and explain trading cost from the bid-ask spread (quoted, effective and realized spread, and price impact in basis points) from quotes and trades. The spread is the cost of immediacy; market orders pay half of it.
metadata:
  title: "Bid-Ask Spread: the cost of immediacy"
  kind: skill
  domain: trading
  level: intermediate
  pack: microstructure
  source: "PromptForge · market microstructure series; standard spread decomposition (Huang & Stoll; Hasbrouck)"
  tags: [microstructure, spread, transaction-costs, execution]
---

# Bid-Ask Spread Analysis

Spread = ask − bid. It is the price of trading **now** instead of waiting: a market buy pays the ask, a market sell hits the bid, so a round trip costs a full spread and each side costs about half.

## Data
<quotes_and_trades>
{{quotes_and_trades}}
</quotes_and_trades>
Instrument: {{instrument}} · Horizon for realized spread: {{markout_horizon}} (e.g. 5 min)

## Compute (show formulas and units)
- **Mid** m = (bid + ask) / 2
- **Quoted spread** = ask − bid; **relative** = (ask − bid) / m × 10,000 bps
- **Effective spread** per trade = 2 · q · (p − m), q = +1 buy, −1 sell, m at trade time. This is what traders actually paid, including price improvement.
- **Realized spread** = 2 · q · (p − m₊Δ), with m₊Δ the mid after the horizon. This is what liquidity providers kept.
- **Price impact** = effective − realized. This is the part lost to informed flow (see adverse selection).
- Volume-weighted averages, and the time-of-day profile (open and close are usually wider)

## Report
1. A table: quoted / effective / realized / impact, in price and bps, mean and median
2. When the spread is widest and why (open, news, low depth)
3. Cost for an order of {{order_size}}: expected half-spread cost in $ and bps
4. Recommendation: cross the spread, post passively, or wait. Justify it with the numbers.

Flag data problems explicitly (locked or crossed quotes, stale quotes, trades outside the NBBO).
