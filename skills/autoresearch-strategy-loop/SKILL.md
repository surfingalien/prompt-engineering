---
name: autoresearch-strategy-loop
description: Use to run an autonomous experiment loop on a trading strategy without building an overfitting machine. Optimize on walk-forward folds, accept changes only when out-of-sample and deflated-Sharpe gates pass, and keep a locked final hold-out the agent never sees.
metadata:
  title: "Autoresearch for trading strategies (overfit-safe)"
  kind: skill
  domain: trading
  level: expert
  pack: autoresearch
  source: "PromptForge · Karpathy loop (karpathy/autoresearch, MIT) combined with leakage-safe validation practice (ml4t/skills, Apache-2.0)"
  tags: [autoresearch, trading, backtesting, overfitting, validation]
---

# Autoresearch Loop for Trading Strategies

Pointing a hill-climbing agent at a backtest Sharpe ratio is the fastest way to overfit ever invented: hundreds of variants against one history guarantees a "great" result that means nothing. Use this design instead.

Strategy file (the only editable file): {{strategy_file}}
Data span: {{data_span}} · Costs model: {{cost_model}}

## Rules for program.md
1. **Three data zones**: research folds (walk-forward, used every run), validation period (checked only when a change is kept), and a **locked hold-out**. The agent never sees its path or results; the human runs it once at the end
2. **Metric**: the median out-of-sample Sharpe across walk-forward folds, **after costs**, not the full-period Sharpe
3. **Keep rule**: keep only if (a) the median OOS Sharpe improves by more than the noise band, (b) no fold gets much worse, (c) the trade count stays ≥ {{min_trades}}, and (d) parameter count does not grow without a large gain
4. **Count every trial** in results.tsv; compute the deflated Sharpe at review time with N = number of experiments
5. **Forbidden**: editing data loading, costs, fold boundaries or the evaluation script; reading the hold-out; adding look-ahead
6. **Re-baseline** every 20 runs against the original strategy on the validation period
7. **Budget**: max iterations and wall-clock; stop early if 30 consecutive discards occur

## Output
program.md for this strategy, the evaluate.py contract (inputs, outputs, fixed seeds), the results.tsv columns (commit, median_oos_sharpe, worst_fold_sharpe, trades, n_params, status, description), and the morning acceptance test: hold-out Sharpe, deflated Sharpe ≥ 0.9, and paper trading before any capital.
