#!/usr/bin/env python3
"""Square-root market impact estimator: dP/P ~= Y * sigma_daily * sqrt(Q / V).

Example:
  python3 impact.py --size 50000 --adv 2000000 --vol 0.025 --price 41.2 --y 0.8 --days 3
Standard library only. Output is an estimate of average meta-order impact, not a guarantee.
"""
import argparse
import math


def impact_fraction(size, adv, vol, y):
    if size <= 0 or adv <= 0 or vol < 0 or y < 0:
        raise ValueError("size and adv must be > 0; vol and y must be >= 0")
    return y * vol * math.sqrt(size / adv)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--size", type=float, required=True, help="order size Q (shares/units)")
    ap.add_argument("--adv", type=float, required=True, help="average daily volume V (same units)")
    ap.add_argument("--vol", type=float, required=True, help="daily volatility as a fraction, e.g. 0.02")
    ap.add_argument("--y", type=float, default=0.8, help="impact constant Y (default 0.8)")
    ap.add_argument("--price", type=float, default=None, help="price, to report $ cost")
    ap.add_argument("--days", type=int, default=1, help="spread execution evenly over this many days")
    a = ap.parse_args()

    print(f"participation Q/V = {a.size / a.adv:.4%}")
    print(f"{'multiple':>8} {'size':>14} {'impact bps':>11} {'cost $':>14}")
    for mult in (0.25, 0.5, 1, 2, 4):
        q = a.size * mult
        f = impact_fraction(q, a.adv, a.vol, a.y)
        cost = f * q * a.price if a.price else float("nan")
        print(f"{mult:>7}x {q:>14,.0f} {f * 1e4:>11.1f} {cost:>14,.0f}")

    if a.days > 1:
        per_day = a.size / a.days
        f_day = impact_fraction(per_day, a.adv, a.vol, a.y)
        risk = a.vol * math.sqrt(a.days)
        print(f"\nsliced over {a.days} days: impact per slice {f_day * 1e4:.1f} bps "
              f"(vs {impact_fraction(a.size, a.adv, a.vol, a.y) * 1e4:.1f} bps at once); "
              f"price-risk exposure grows to ~{risk:.2%} (1 sigma over the period)")


if __name__ == "__main__":
    main()
