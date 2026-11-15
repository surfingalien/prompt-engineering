---
name: micro-order-book-depth
description: Use to analyze limit order book depth and liquidity (size at each price level, cumulative depth within N bps, book imbalance, and the cost of walking the book for a given order size). A thin book means big price moves.
metadata:
  title: "Order Book Depth: how much size rests at every level"
  kind: skill
  domain: trading
  level: intermediate
  pack: microstructure
  source: "PromptForge · market microstructure series"
  tags: [microstructure, liquidity, order-book, execution]
---

# Order Book Depth Analysis

Depth = Σ size at each price level. It tells you how much you can trade before the price moves against you.

## Book snapshot(s)
<order_book>
{{order_book}}
</order_book>
Order to evaluate: {{side}} {{order_size}} of {{instrument}}

## Compute
1. **Depth ladder**: bid and ask size per level, and cumulative depth within 5, 10, 25 and 50 bps of mid
2. **Imbalance** = (bid depth − ask depth) / (bid depth + ask depth) within 10 bps; values near ±1 often precede short-term moves toward the thin side
3. **Walk the book** for the order: consume levels until filled; report average fill price, worst price, and slippage vs. mid in bps
4. **Depth-to-size ratio**: order size ÷ depth within 10 bps (> 0.2 means the order will move the market noticeably)
5. **Resilience** (if several snapshots): how fast depth refills after a large trade

## Report
- ASCII depth chart (bids left, asks right)
- Table of slippage for 0.25×, 0.5×, 1×, 2× the order size, showing the convex cost curve
- Whether the visible book is credible: flag spoofing signs such as large orders far from mid that vanish as price approaches, or many one-lot levels
- Recommendation: single order, slicing schedule, or a different venue

Remember that hidden and iceberg orders mean the visible book understates real depth, while fleeting quotes mean it can overstate it.
