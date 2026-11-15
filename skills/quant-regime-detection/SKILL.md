---
name: quant-regime-detection
description: Use to identify market regimes (trend vs. mean-reversion, low vs. high volatility, risk-on vs. risk-off) with volatility clustering, hidden Markov models or change-point detection, and to use regimes as conditioning context rather than timing signals.
metadata:
  title: "Regime Detection"
  kind: skill
  domain: trading
  level: advanced
  pack: quant-research
  source: "PromptForge · quant research series; topic coverage informed by agiprolabs/claude-trading-skills (MIT): regime-detection; PromptForge · quant research series; topic coverage informed by ml4t/skills (Apache-2.0): regime-awareness"
  tags: [quant, regimes, hmm, volatility, statistics]
---

# Regime Detection

<data>
{{price_or_returns}}
</data>
Question: {{question}} (e.g. "does my strategy only work in low-vol regimes?")

## Approach (pick what fits the data; explain the choice)
1. **Rule-based** (transparent): realized vol percentile buckets; trend filter (price vs. 200-day MA); drawdown state
2. **Hidden Markov model**: 2–3 states on returns (and volatility). Report each state's mean, volatility, persistence (expected duration = 1/(1 − pᵢᵢ)) and transition matrix
3. **Change-point detection** (e.g. CUSUM, Bayesian online change points) for structural breaks
Use only past data at each date (filtered probabilities, not smoothed ones) when results feed a trading decision.

## Report
- Regime timeline and summary table
- Strategy performance **conditioned** on regime (Sharpe, hit rate, drawdown per regime)
- Stability: how often regimes flip, and the lag of detection
- Recommendation: use regimes to scale risk or pick strategies, not as a standalone timing signal, unless out-of-sample tests show the switching itself adds value
