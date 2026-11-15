---
name: quant-pairs-cointegration
description: Use to find and validate pairs or baskets for statistical arbitrage with Engle-Granger or Johansen cointegration, hedge ratios, rolling stability and spread trading rules, while avoiding the multiple-comparisons trap of screening many pairs.
metadata:
  title: "Pairs Trading: cointegration"
  kind: skill
  domain: trading
  level: advanced
  pack: quant-research
  source: "PromptForge · quant research series; topic coverage informed by agiprolabs/claude-trading-skills (MIT): cointegration-analysis; PromptForge · quant research series; topic coverage informed by tradermonty/claude-trading-skills (MIT): pair-trade-screener"
  tags: [quant, pairs-trading, cointegration, stat-arb]
---

# Pairs Trading via Cointegration

Candidates: {{candidates}} · Data: {{price_data}} · Formation period: {{formation}} · Trading period: {{trading}}

## Steps
1. **Pre-filter on economics**: same sector, shared drivers, a substitute relationship. Correlation alone is not cointegration
2. **Engle–Granger**: regress log Pa on log Pb in the formation period for the hedge ratio β; ADF on the residual spread. For baskets, use **Johansen** (trace test; rank ≥ 1)
3. **Multiple testing**: if M pairs are screened, adjust p-values (Bonferroni or Benjamini–Hochberg) or expect about 5% × M false positives
4. **Stability**: rolling β and rolling ADF; half-life of the spread
5. **Out-of-sample**: trade only in the later trading period with a frozen β (or a Kalman-filtered β with no look-ahead)
6. **Rules**: z-score entry, exit, time stop and break stop (as in mean-reversion), dollar-neutral or β-neutral sizing, and costs on both legs including borrow

## Output
A ranked pairs table (adjusted p, β, half-life, OOS Sharpe, trades), the chosen pairs with rules, and the risks: relationship breaks (mergers, regulation), crowding, and short-squeeze risk on the short leg.
