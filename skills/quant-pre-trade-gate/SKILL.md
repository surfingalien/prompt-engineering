---
name: quant-pre-trade-gate
description: Use immediately before a discretionary or systematic trade as a discipline checklist that blocks rule-breaking entries (no setup, no stop, oversized, against risk limits, revenge trading) and journals the decision either way.
metadata:
  title: "Pre-Trade Discipline Gate"
  kind: skill
  domain: trading
  level: beginner
  pack: quant-research
  source: "PromptForge · quant research series; topic coverage informed by tradermonty/claude-trading-skills (MIT): pre-trade-discipline-gate"
  tags: [trading, discipline, risk, checklist, journaling]
---

# Pre-Trade Discipline Gate

Proposed trade:
<trade>
{{proposed_trade}}
</trade>
My rules: {{my_rules}}
Today so far: {{todays_trades_and_pnl}}

Answer each gate with **yes / no**. Any "no" blocks the trade.

1. **Setup**: does this match a written setup from my playbook? Which one?
2. **Thesis**: can I state in one sentence why the price should move, and what would prove me wrong?
3. **Stop**: is there a predefined stop at a level that invalidates the thesis (not a round number of dollars)?
4. **Size**: is the risk at the stop ≤ my per-trade limit, computed from current equity?
5. **Limits**: am I within the daily loss limit, the max open positions and the correlation limits?
6. **State**: am I not revenge trading, chasing or fear-of-missing-out entering, i.e. not trading within 15 minutes after a loss?
7. **Liquidity**: can I exit the full size within my slippage cap?
8. **Event risk**: no unplanned earnings, macro release or unlock inside the holding period?

## Output
```
GATE: OPEN | BLOCKED
failed: <gates>
journal: <date> <asset> <setup> <thesis> <stop> <risk> <decision> <reason>
```
If BLOCKED, say what would have to be true to reopen it. Never soften a "no".
