---
name: quant-tearsheet
description: Use to produce an honest performance tearsheet from strategy returns or a trade log (CAGR, volatility, Sharpe, Sortino, Calmar, max drawdown and duration, win rate, expectancy, exposure, monthly table, and benchmark-relative stats) with the caveats a reader needs.
metadata:
  title: "Performance Tearsheet"
  kind: skill
  domain: trading
  level: intermediate
  pack: quant-research
  source: "PromptForge · quant research series; topic coverage informed by agiprolabs/claude-trading-skills (MIT): portfolio-analytics; PromptForge · quant research series; topic coverage informed by ml4t/skills (Apache-2.0): tearsheet"
  tags: [quant, performance, metrics, reporting]
---

# Performance Tearsheet

<returns_or_trades>
{{returns_or_trades}}
</returns_or_trades>
Benchmark: {{benchmark}} · Risk-free rate: {{risk_free}} · Periods per year: {{periods_per_year}}

## Metrics (state formulas and conventions)
- Return: total, CAGR; volatility (annualized)
- **Sharpe** = mean excess return / std × √periods; **Sortino** (downside deviation); **Calmar** = CAGR / |max DD|
- **Max drawdown** and its **duration** (peak to recovery); time under water
- Trade stats: count, win rate, average win/loss, payoff ratio, **expectancy** (in R if available), largest win and loss, longest losing streak
- Exposure (% of time invested), turnover, average holding period
- vs. benchmark: beta, correlation, alpha (annualized), information ratio, up/down capture
- A monthly returns table (year × month) and the best and worst months

## Honesty section (always include)
- Sample size and whether it supports the conclusions (e.g. a Sharpe 95% CI ≈ SR ± 1.96·√((1 + SR²/2)/T))
- Whether results are backtest, paper or live, and the cost assumptions used
- Concentration: share of P&L from the top 5 trades or best month

Output in markdown, with one sentence of plain-English interpretation per section.
