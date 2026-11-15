---
name: micro-maker-taker-fees
description: Use to include exchange maker rebates and taker fees in trading-cost and routing decisions. Compute all-in cost per share or bps for passive vs. aggressive orders across venues and fee tiers; add liquidity, get paid.
metadata:
  title: "Maker–Taker Fees: add liquidity, get paid"
  kind: skill
  domain: trading
  level: intermediate
  pack: microstructure
  source: "PromptForge · market microstructure series; US equity access-fee cap under Reg NMS Rule 610"
  tags: [microstructure, fees, routing, transaction-costs]
---

# Maker–Taker Fee Analysis

Many exchanges pay a **rebate** to orders that add liquidity (makers) and charge a **fee** to orders that remove it (takers). In US equities, access fees were long capped at 30 mils ($0.0030/share) under Reg NMS Rule 610, and the SEC adopted amendments in 2024 that lower the cap for most stocks. Check the rule in force for your venue and dates. Crypto venues quote fees in bps, often by volume tier, sometimes with negative maker fees.

## Inputs
- Venues and fee schedules: {{fee_schedules}}
- Your monthly volume / tier: {{volume_tier}}
- Typical order: {{order_profile}} (price, size, urgency)
- Spread and fill statistics per venue: {{venue_stats}}

## Compute
1. All-in cost per share and in bps for: taking (half-spread + taker fee), making (− rebate + adverse selection markout from fills), and midpoint/dark if available
2. **Break-even**: how much adverse selection a passive fill can absorb before the rebate stops paying
3. Venue ranking for this order profile, including fill probability (high-rebate venues often have longer queues and more toxic fills)
4. The effect of moving up a fee tier

## Report
A cost table per venue and order type, a routing recommendation, and the caveat that rebates can create conflicts in broker routing. Judge routing by total execution quality (price + fees + fill rate), not by rebates alone.
