#!/usr/bin/env python3
"""Variance swap fair strike from an option strip (CBOE VIX-style discretization),
plus realized variance from a price series.

  python3 varswap.py --chain chain.csv --forward 5000 --rate 0.04 --maturity 0.25
      chain.csv columns: strike,type,mid   (type = put or call; OTM quotes are used)
  python3 varswap.py --prices closes.txt   # one close per line -> annualized realized vol
  python3 varswap.py --demo-flat-vol 0.2   # self-check: flat 20% vol should give ~20 vol points

Standard library only.
"""
import argparse
import csv
import math
from statistics import NormalDist

N = NormalDist()


def fair_variance(strikes, quotes, forward, rate, maturity):
    """strikes ascending; quotes[i] = OTM option mid at strikes[i] (puts below K0, calls above,
    average of put and call at K0). Returns annualized variance K_var."""
    k0 = max([k for k in strikes if k <= forward] or [strikes[0]])
    total = 0.0
    for i, k in enumerate(strikes):
        if i == 0:
            dk = strikes[1] - strikes[0]
        elif i == len(strikes) - 1:
            dk = strikes[-1] - strikes[-2]
        else:
            dk = (strikes[i + 1] - strikes[i - 1]) / 2
        total += dk / k ** 2 * quotes[i]
    return (2 * math.exp(rate * maturity) / maturity) * total - (1 / maturity) * (forward / k0 - 1) ** 2


def black(forward, k, t, vol, rate, call):
    d1 = (math.log(forward / k) + 0.5 * vol * vol * t) / (vol * math.sqrt(t))
    d2 = d1 - vol * math.sqrt(t)
    df = math.exp(-rate * t)
    if call:
        return df * (forward * N.cdf(d1) - k * N.cdf(d2))
    return df * (k * N.cdf(-d2) - forward * N.cdf(-d1))


def otm_strip(rows, forward):
    by_k = {}
    for k, typ, mid in rows:
        by_k.setdefault(k, {})[typ] = mid
    strikes = sorted(by_k)
    k0 = max([k for k in strikes if k <= forward] or [strikes[0]])
    quotes = []
    for k in strikes:
        q = by_k[k]
        if k == k0 and "put" in q and "call" in q:
            quotes.append((q["put"] + q["call"]) / 2)
        elif k < forward:
            quotes.append(q.get("put", q.get("call")))
        else:
            quotes.append(q.get("call", q.get("put")))
    return strikes, quotes


def realized_vol(closes, periods_per_year=252):
    rets = [math.log(b / a) for a, b in zip(closes, closes[1:])]
    if not rets:
        raise ValueError("need at least two prices")
    return math.sqrt(periods_per_year / len(rets) * sum(r * r for r in rets))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--chain")
    ap.add_argument("--forward", type=float)
    ap.add_argument("--rate", type=float, default=0.0)
    ap.add_argument("--maturity", type=float)
    ap.add_argument("--prices")
    ap.add_argument("--vega-notional", type=float, default=None)
    ap.add_argument("--demo-flat-vol", type=float, default=None)
    a = ap.parse_args()

    if a.demo_flat_vol:
        f, t, r = 100.0, 0.5, 0.0
        strikes = [f * math.exp(x / 100) for x in range(-300, 301, 2)]
        quotes = [black(f, k, t, a.demo_flat_vol, r, call=k >= f) for k in strikes]
        kvar = fair_variance(strikes, quotes, f, r, t)
        print(f"demo flat vol {a.demo_flat_vol:.2%}: fair strike {math.sqrt(kvar) * 100:.2f} vol points")
        return
    if a.chain:
        if not (a.forward and a.maturity):
            ap.error("--chain needs --forward and --maturity")
        with open(a.chain, newline="") as fh:
            rows = [(float(r["strike"]), r["type"].strip().lower(), float(r["mid"])) for r in csv.DictReader(fh)]
        strikes, quotes = otm_strip(rows, a.forward)
        kvar = fair_variance(strikes, quotes, a.forward, a.rate, a.maturity)
        kvol = math.sqrt(max(kvar, 0)) * 100
        print(f"K_var = {kvar:.6f}  ->  variance strike {kvol:.2f} vol points")
        if a.vega_notional:
            print(f"variance notional = vega notional / (2 * K_vol) = {a.vega_notional / (2 * kvol):,.2f}")
    if a.prices:
        with open(a.prices) as fh:
            closes = [float(x) for x in fh.read().split() if x.strip()]
        print(f"realized vol (zero-mean, 252d) = {realized_vol(closes):.2%} over {len(closes) - 1} returns")


if __name__ == "__main__":
    main()
