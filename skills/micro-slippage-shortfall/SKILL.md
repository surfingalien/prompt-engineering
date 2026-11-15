---
name: micro-slippage-shortfall
description: Use to measure execution quality as implementation shortfall (fill price vs. decision price, Perold 1988), breaking slippage into delay, spread, impact, fees and opportunity cost for unfilled shares. Use it for transaction cost analysis (TCA) of any trading log.
metadata:
  title: "Slippage: implementation shortfall"
  kind: skill
  domain: trading
  level: intermediate
  pack: microstructure
  source: "PromptForge · market microstructure series; Perold (1988) implementation shortfall"
  tags: [microstructure, slippage, tca, execution]
---

# Slippage & Implementation Shortfall (TCA)

Slippage is the hidden cost of execution: every basis point between the **decision price** (when you decided to trade) and the **fill price**. Perold's implementation shortfall measures the whole gap between a paper portfolio and the real one.

## Data
<orders_and_fills>
{{orders_and_fills}}
</orders_and_fills>
Benchmark(s): {{benchmarks}} (decision price; also arrival, VWAP, close if available)

## Per order (side sign s = +1 buy, −1 sell)
- **Total shortfall (bps)** = s · (avg fill − decision price) / decision price × 10,000, plus fees, plus opportunity cost on unfilled quantity (s · (final price − decision price) × unfilled)
- Decompose:
  - **Delay**: decision → order arrival price
  - **Spread / execution**: arrival → average fill
  - **Fees**: commissions and exchange fees
  - **Opportunity**: unfilled shares × subsequent move

## Aggregate
- Notional-weighted mean and median shortfall; distribution and the worst 5%
- Breakdown by order size bucket (Q/ADV), urgency, venue, time of day and algorithm
- Compare against the cap the desk uses (e.g. 2.0%) and list breaches

## Report
- A TCA summary table and the three biggest cost drivers with evidence
- A plot description: shortfall vs. participation rate (expect a square-root-like curve)
- Specific fixes: start sooner (delay), post passively (spread), slice (impact), or don't trade (opportunity cost is lower than impact)
