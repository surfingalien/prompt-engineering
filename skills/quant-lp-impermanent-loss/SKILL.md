---
name: quant-lp-impermanent-loss
description: Use to analyze an AMM liquidity position (constant-product or concentrated liquidity): impermanent loss vs. holding, fee income needed to break even, range-out risk, and real vs. emission-inflated APY.
metadata:
  title: "LP Math & Impermanent Loss"
  kind: skill
  domain: trading
  level: advanced
  pack: quant-research
  source: "PromptForge · quant research series; topic coverage informed by agiprolabs/claude-trading-skills (MIT): lp-math, impermanent-loss, yield-analysis"
  tags: [defi, amm, liquidity, impermanent-loss, yield]
---

# LP Position & Impermanent Loss Analysis

Pool: {{pool}} · Type: {{amm_type}} (constant product x·y = k, or concentrated range [Pa, Pb])
Deposit: {{deposit}} · Entry price P₀: {{entry_price}} · Fee tier: {{fee_tier}}
Expected volume / TVL: {{volume_tvl}} · Reward emissions: {{emissions}}

## Compute
1. **Constant product IL** for price ratio r = P/P₀: IL(r) = 2√r/(1 + r) − 1. Table for r = 0.25, 0.5, 0.8, 1.25, 2, 4
2. **Concentrated liquidity**: IL is amplified inside the range, and the position becomes 100% of the weaker asset outside it. Show value vs. holding across prices, and where it goes out of range
3. **Fee APR** ≈ fee tier × (volume / TVL) × 365, adjusted for in-range time
4. **Break-even**: the fee income needed to offset IL at each r, and the days to break even
5. **Real yield**: separate fees (real) from token emissions (dilutive). Value emissions at a haircut and note unlock schedules
6. Risks: smart-contract risk, depeg (stable pairs), toxic flow and arbitrage against LPs (loss-versus-rebalancing)

## Output
Scenario table (price move · value LP · value hold · IL · fees · net), a verdict on whether the pool pays for its risk, and the price range or exit rule that keeps the position sensible.

## Calculator
When you can run code, use the bundled script instead of doing the arithmetic by hand, and quote its output:

```bash
python3 scripts/il.py --p0 {{entry_price}} --lower <range low> --upper <range high> --fee-apr <estimated fee APR> --days 30
```

It prints the constant-product IL table and, for a range, LP value vs. holding with fees. It uses only the Python standard library. Without code execution, do the calculation step by step and show your working.

