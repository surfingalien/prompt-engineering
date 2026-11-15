#!/usr/bin/env python3
"""Position size from equity and risk at the stop, capped by Kelly, liquidity and portfolio heat.

Example:
  python3 size.py --equity 1294.29 --entry 0.3915 --stop 0.3563 --risk-pct 1 \\
      --slippage-pct 1 --liquidity 50000 --max-liq-share 2 --open-risk 25 --max-heat 6 \\
      --win-rate 0.55 --payoff 1.8 --n-trades 120
Standard library only. Educational and research use; not financial advice.
"""
import argparse


def size_position(equity, entry, stop, risk_pct=1.0, slippage_pct=0.0, liquidity=None, max_liq_share=2.0,
                  open_risk=0.0, max_heat=6.0, win_rate=None, payoff=None, n_trades=0, min_order=0.0):
    if equity <= 0 or entry <= 0 or stop <= 0 or stop == entry:
        raise ValueError("equity, entry and stop must be positive and stop != entry")
    budget = equity * risk_pct / 100
    stop_dist = abs(entry - stop) / entry + 2 * slippage_pct / 100
    caps = {"base": budget / stop_dist}
    if win_rate is not None and payoff and n_trades >= 50:
        kelly = win_rate - (1 - win_rate) / payoff
        if kelly <= 0:
            return {"decision": "SKIP", "reason": f"Kelly fraction {kelly:.3f} <= 0: no proven edge", "caps": caps}
        caps["kelly"] = equity * kelly / 4
    if liquidity:
        caps["liquidity"] = liquidity * max_liq_share / 100
    heat_left = equity * max_heat / 100 - open_risk
    if heat_left <= 0:
        return {"decision": "SKIP", "reason": "portfolio heat limit reached", "caps": caps}
    caps["heat"] = heat_left / stop_dist
    binding = min(caps, key=caps.get)
    size = caps[binding]
    if size < min_order:
        return {"decision": "SKIP", "reason": f"size {size:.2f} below venue minimum {min_order}", "caps": caps}
    return {"decision": "SIZE", "size": size, "pct_equity": size / equity * 100, "risk": size * stop_dist,
            "risk_pct": size * stop_dist / equity * 100, "binding": binding, "caps": caps, "stop_dist": stop_dist}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    for name, kw in [("--equity", dict(type=float, required=True)), ("--entry", dict(type=float, required=True)),
                     ("--stop", dict(type=float, required=True)), ("--risk-pct", dict(type=float, default=1.0)),
                     ("--slippage-pct", dict(type=float, default=0.0)), ("--liquidity", dict(type=float)),
                     ("--max-liq-share", dict(type=float, default=2.0)), ("--open-risk", dict(type=float, default=0.0)),
                     ("--max-heat", dict(type=float, default=6.0)), ("--win-rate", dict(type=float)),
                     ("--payoff", dict(type=float)), ("--n-trades", dict(type=int, default=0)),
                     ("--min-order", dict(type=float, default=0.0))]:
        ap.add_argument(name, **kw)
    a = ap.parse_args()
    r = size_position(a.equity, a.entry, a.stop, a.risk_pct, a.slippage_pct, a.liquidity, a.max_liq_share,
                      a.open_risk, a.max_heat, a.win_rate, a.payoff, a.n_trades, a.min_order)
    for k, v in r["caps"].items():
        print(f"cap {k:<10} {v:>12,.2f}")
    if r["decision"] == "SKIP":
        print(f"DECISION: SKIP  reason: {r['reason']}")
        return
    print(f"stop distance incl. slippage {r['stop_dist']:.2%}")
    print(f"DECISION: SIZE  {r['size']:,.2f} ({r['pct_equity']:.1f}% of equity)  "
          f"risk at stop {r['risk']:,.2f} ({r['risk_pct']:.2f}%)  binding: {r['binding']}")


if __name__ == "__main__":
    main()
