---
name: micro-latency-arbitrage
description: Use to analyze stale-quote risk (latency arbitrage), where fast traders pick off resting quotes before they can update. Measure exposure across venues, quantify losses on sniped fills, and evaluate defenses such as faster cancels, speed bumps and batch auctions.
metadata:
  title: "Latency Arbitrage: stale quote → sniped"
  kind: skill
  domain: trading
  level: expert
  pack: microstructure
  source: "PromptForge · market microstructure series; Budish, Cramton & Shim (2015) on continuous-market sniping and frequent batch auctions"
  tags: [microstructure, latency, market-making, fragmentation]
---

# Stale-Quote (Latency Arbitrage) Risk Analysis

In continuous markets, when public information moves the fair price, a resting quote that hasn't updated yet is **stale**. The fastest trader takes it at the old price. Budish, Cramton and Shim (2015) argue this "sniping" is a structural cost of continuous trading, paid by liquidity providers and passed on as wider spreads. They proposed frequent batch auctions as a fix.

This skill is for **defending** quotes and studying market design. It is not for building sniping systems.

## Data
<quotes_and_fills>
{{quotes_and_fills}}
</quotes_and_fills>
Reference prices (other venues, futures, index): {{reference_prices}}
Your quote update latency: {{update_latency}}

## Analyze
1. **Stale window**: for each reference-price jump, the time until your quote updated, and the gap between your quote and the new fair price
2. **Sniped fills**: fills inside the stale window where the reference had already moved through your price. Count them, plus their loss in bps and $
3. **Share of total adverse selection** explained by stale-quote fills vs. slower informed flow
4. **Sensitivity**: loss as a function of update latency (what does 1 ms faster save?)

## Defenses to evaluate
Faster cancel-on-reference-move, wider quotes around known event times, reduced size on venues where you are consistently picked off, venues with speed bumps or batch auctions, and last-look where permitted (note its fairness concerns).

Report the expected annual cost of sniping at current size, and the cheapest effective defense.
