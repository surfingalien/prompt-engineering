---
name: quant-mean-reversion
description: Use to test whether a price series or spread mean-reverts (ADF test, Hurst exponent, Ornstein-Uhlenbeck half-life) and to design z-score entry and exit rules with sensible stops and holding limits.
metadata:
  title: "Mean Reversion: ADF, Hurst, half-life"
  kind: skill
  domain: trading
  level: advanced
  pack: quant-research
  source: "PromptForge · quant research series; topic coverage informed by agiprolabs/claude-trading-skills (MIT): mean-reversion"
  tags: [quant, mean-reversion, statistics, stat-arb]
---

# Mean Reversion Analysis

<series>
{{series}}
</series>
Context: {{context}} (single asset, spread, basis, funding rate…)

## Tests
1. **ADF** (and KPSS as a cross-check): stationarity at 5%. Report the statistic, p-value and lag choice
2. **Hurst exponent**: H < 0.5 mean-reverting, ≈ 0.5 random walk, > 0.5 trending. Report the estimation method and its noise
3. **Half-life**: regress Δx_t on x_{t−1}: Δx = a + b·x_{t−1} + ε, half-life = −ln(2)/b (b < 0 needed)
4. Rolling versions of each, to check the property is stable rather than a single-period artifact

## Rules (only if the tests pass)
- z = (x − rolling mean) / rolling std, with lookback ≈ the half-life
- Enter at |z| > {{entry_z}}, exit at |z| < {{exit_z}}
- Stops: time stop ≈ 2–3 half-lives; structural stop if |z| > 4 (the relationship may have broken)
- Account for costs: expected profit per round trip vs. spread and fees

Output: a test results table, a verdict, and rules as pseudo-code, plus the main way this fails (regime change or structural break).
