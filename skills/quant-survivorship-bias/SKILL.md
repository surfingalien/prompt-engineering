---
name: quant-survivorship-bias
description: Use to detect and correct survivorship bias, where only assets that still exist (today's index members, live tokens, current funds) are in the backtest universe and delisted, bankrupt or rugged assets are missing. Estimates how much it inflates returns.
metadata:
  title: "Survivorship Bias Check"
  kind: skill
  domain: trading
  level: intermediate
  pack: quant-research
  source: "PromptForge · quant research series; topic coverage informed by ml4t/skills (Apache-2.0)"
  tags: [quant, backtesting, bias, universe]
---

# Survivorship Bias Check

If the backtest universe only contains survivors, every loser that disappeared is silently excluded, and returns look better than any real trader could have achieved.

Strategy and universe description:
<setup>
{{setup}}
</setup>

## Investigate
1. How was the universe built: current constituents, or point-in-time membership including delistings?
2. Does the data vendor include dead tickers, delisting returns, bankrupt companies, and rugged or abandoned tokens?
3. How are delistings handled: is the last price carried forward, does the position drop to zero, or is a delisting return applied?
4. Rough magnitude: for crypto, the share of tokens from the start year still trading today; for equities, the annual delisting rate in the segment (small caps are much higher)

## Output
- Verdict: no bias / likely bias / confirmed bias, with evidence
- An estimate of the inflation (e.g. "excluding the ~X% of tokens that went to zero likely overstates CAGR by Y pts"), with your assumptions stated
- Concrete fix: data source, universe rebuild steps, delisting-return treatment
- How results should be re-reported after the fix
