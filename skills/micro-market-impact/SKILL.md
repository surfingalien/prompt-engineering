---
name: micro-market-impact
description: Use to estimate how much your own order will move the price using the square-root impact law (ΔP ≈ Y·σ·√(Q/V)), choose a participation rate, and compare single-shot vs. sliced execution. 4× the size means only about 2× the impact.
metadata:
  title: "Market Impact: the square-root law"
  kind: skill
  domain: trading
  level: advanced
  pack: microstructure
  source: "PromptForge · market microstructure series; square-root impact law (Torre/BARRA; Almgren et al. 2005; Tóth et al. 2011)"
  tags: [microstructure, market-impact, execution, transaction-costs]
---

# Market Impact Estimator

Your own order moves the price against you. Empirically, the impact of a meta-order grows with the **square root** of its size relative to daily volume:

**ΔP / P ≈ Y · σ_daily · √(Q / V)**

- Q = order size (shares or units), V = average daily volume
- σ_daily = daily volatility (as a fraction)
- Y = a constant of order 1 (typically ≈ 0.5–1; calibrate to your own fills when you can)

So 4× the size gives only about 2× the impact, but impact still grows without limit.

## Inputs
- Instrument: {{instrument}} · Order: {{side}} {{order_size}}
- ADV V: {{adv}} · Daily volatility σ: {{daily_vol}}
- Y (default 0.8): {{impact_constant}}
- Price: {{price}} · Urgency / deadline: {{deadline}}

## Compute
1. Participation Q/V and expected impact in bps and $ (show the arithmetic)
2. A sensitivity table for Q = 0.25×, 0.5×, 1×, 2×, 4× the order
3. Execution over k days: each day Q/k with impact ≈ Y·σ·√(Q/(kV)) per slice. Compare total impact cost to the extra **risk** from waiting (σ·√(k) exposure), in the spirit of Almgren–Chriss
4. A participation-rate recommendation (e.g. ≤ 10% of volume) and expected duration

## Caveats to state
- The law describes **average** impact of meta-orders. Single trades in thin books (crypto, small caps) can be far worse; check book depth too
- Part of the impact decays after the order finishes; temporary vs. permanent impact differ
- For DEX/AMM pools, use pool math instead: for constant product x·y = k, price impact ≈ 2·Δx/x for small trades

End with: expected cost in bps, recommended schedule, and the confidence level of the estimate.

## Calculator
When you can run code, use the bundled script instead of doing the arithmetic by hand, and quote its output:

```bash
python3 scripts/impact.py --size {{order_size}} --adv {{adv}} --vol {{daily_vol}} --y {{impact_constant}} --price {{price}} --days 3
```

It prints the sensitivity table (0.25×–4×) and the sliced-execution comparison. It uses only the Python standard library. Without code execution, do the calculation step by step and show your working.

