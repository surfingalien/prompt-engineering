---
name: quant-cost-model
description: Use to build a realistic transaction cost model for a backtest (commissions, spread, slippage, market impact, borrow and funding costs) and to test whether a strategy's edge survives them at the intended size.
metadata:
  title: "Transaction Cost Model"
  kind: skill
  domain: trading
  level: advanced
  pack: quant-research
  source: "PromptForge · quant research series; topic coverage informed by ml4t/skills (Apache-2.0): cost-model, transaction-costs"
  tags: [quant, transaction-costs, backtesting, capacity]
---

# Transaction Cost Model

Strategy: {{strategy}} · Instruments: {{instruments}}
Turnover / trade frequency: {{turnover}} · Intended capital: {{capital}}
Market data available: {{market_data}} (spreads, ADV, volatility, borrow rates)

## Build the model (cost per trade, in bps)
1. **Fees**: commissions, exchange/taker fees (minus maker rebates if passive), on-chain gas or priority fees
2. **Spread**: half the effective spread for aggressive fills; for passive fills, model fill probability and adverse selection instead
3. **Impact**: square-root law, Y·σ·√(Q/ADV), using position size at the intended capital
4. **Financing**: short borrow fees, funding rates on perps, margin interest
5. **Delay**: decision-to-execution drift for signals that need time to act on

## Test
- Net vs. gross Sharpe and CAGR
- **Break-even cost**: the cost in bps at which the edge disappears
- **Capacity curve**: net Sharpe at 1×, 3×, 10× capital (impact grows with size)
- Cost share of gross P&L

Return the model as a small function (pseudo-code or Python) with every parameter documented, plus the results table. If the break-even cost is below 2× the modeled cost, call the edge fragile.
