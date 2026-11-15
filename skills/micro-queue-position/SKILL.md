---
name: micro-queue-position
description: Use to reason about queue position under price-time priority (FIFO at each level), estimating when a passive limit order will fill, whether to join, improve or cross, and how cancellations and trade-throughs change the odds.
metadata:
  title: "Queue Position: price-time priority"
  kind: skill
  domain: trading
  level: advanced
  pack: microstructure
  source: "PromptForge · market microstructure series"
  tags: [microstructure, limit-orders, queue, execution]
---

# Queue Position Analysis

Most lit venues match **price first, then time**: at the same price, earlier orders fill first. Your fill probability depends on how much size is ahead of you, how fast it trades away, and how fast it cancels.

## Situation
- Instrument: {{instrument}} · Side: {{side}} · Limit price: {{limit_price}}
- Size ahead of you at your level: {{queue_ahead}}
- Your size: {{order_size}}
- Recent rate of trades hitting this level: {{trade_rate}} per minute
- Recent cancellation rate at this level: {{cancel_rate}} per minute
- Spread and depth: {{book_summary}}

## Compute
1. **Expected time to fill** ≈ queue ahead ÷ (trade rate + share of cancels ahead of you). Give a range, because cancels ahead help you but are uncertain
2. **Fill probability** within {{time_budget}}
3. Risk of **not** filling: the price may move away (opportunity cost), or you get filled exactly when the price is about to move through you (adverse selection)
4. Options: stay in queue, join a fresh level one tick better (back of a new queue, but first in line), or cross the spread (pay half-spread, fill now). Estimate the cost of each

## Output
A decision table (option · expected cost bps · fill probability · risk), a recommendation, and the conditions that should trigger a change (e.g. "if queue ahead drops below 20% and imbalance turns against you, cross").
Note venue specifics: pro-rata matching (some futures), size-priority or random queues make FIFO reasoning wrong.
