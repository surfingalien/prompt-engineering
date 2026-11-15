#!/usr/bin/env python3
"""Impermanent loss for constant-product (x*y=k) and concentrated-liquidity positions.

Examples:
  python3 il.py                                  # constant-product IL table
  python3 il.py --p0 2000 --lower 1600 --upper 2500 --fee-apr 0.35 --days 30
Prices are token1 per token0 (e.g. USDC per ETH). Standard library only.
"""
import argparse
import math


def il_constant_product(r):
    """Value of an LP position vs holding, minus 1, for price ratio r = P/P0."""
    if r <= 0:
        raise ValueError("price ratio must be > 0")
    return 2 * math.sqrt(r) / (1 + r) - 1


def clmm_amounts(liquidity, p, pa, pb):
    """Token amounts (x, y) of a Uniswap v3-style position with liquidity L in [pa, pb] at price p."""
    sp, sa, sb = math.sqrt(p), math.sqrt(pa), math.sqrt(pb)
    if p <= pa:
        return liquidity * (sb - sa) / (sa * sb), 0.0
    if p >= pb:
        return 0.0, liquidity * (sb - sa)
    return liquidity * (sb - sp) / (sp * sb), liquidity * (sp - sa)


def clmm_vs_hold(p0, p, pa, pb, deposit_value=1.0):
    """Return (lp_value, hold_value) for a position worth deposit_value at p0."""
    if not pa < p0 < pb:
        raise ValueError("entry price must be inside the range")
    x1, y1 = clmm_amounts(1.0, p0, pa, pb)
    scale = deposit_value / (x1 * p0 + y1)
    x0, y0 = x1 * scale, y1 * scale
    xl, yl = clmm_amounts(scale, p, pa, pb)
    return xl * p + yl, x0 * p + y0


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--p0", type=float, help="entry price (for concentrated liquidity)")
    ap.add_argument("--lower", type=float, help="range lower price")
    ap.add_argument("--upper", type=float, help="range upper price")
    ap.add_argument("--fee-apr", type=float, default=0.0, help="fee APR while in range, e.g. 0.35")
    ap.add_argument("--days", type=float, default=30, help="holding period for fee estimate")
    a = ap.parse_args()

    ratios = (0.25, 0.5, 0.8, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0, 4.0)
    print("constant product x*y=k")
    print(f"{'P/P0':>6} {'IL':>9}")
    for r in ratios:
        print(f"{r:>6} {il_constant_product(r):>9.2%}")

    if a.p0 and a.lower and a.upper:
        fees = a.fee_apr * a.days / 365
        print(f"\nconcentrated range [{a.lower}, {a.upper}], entry {a.p0}, fees ~{fees:.2%} over {a.days:g} days if always in range")
        print(f"{'price':>10} {'LP':>8} {'hold':>8} {'IL':>9} {'net w/ fees':>12} {'in range':>9}")
        for r in ratios:
            p = a.p0 * r
            lp, hold = clmm_vs_hold(a.p0, p, a.lower, a.upper)
            in_range = a.lower < p < a.upper
            net = lp * (1 + (fees if in_range else 0)) / hold - 1
            print(f"{p:>10.2f} {lp:>8.4f} {hold:>8.4f} {lp / hold - 1:>9.2%} {net:>12.2%} {'yes' if in_range else 'no':>9}")


if __name__ == "__main__":
    main()
