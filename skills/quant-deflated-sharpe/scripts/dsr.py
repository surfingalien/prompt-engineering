#!/usr/bin/env python3
"""Probabilistic and Deflated Sharpe Ratio (Bailey & Lopez de Prado, 2014).

Example:
  python3 dsr.py --sharpe 0.12 --n-obs 750 --skew -0.4 --kurtosis 5.2 --trials 40 --sharpe-var 0.0016
Sharpe values are PER PERIOD (not annualized). Kurtosis is raw (normal = 3), not excess.
Standard library only.
"""
import argparse
import math
from statistics import NormalDist

EULER_GAMMA = 0.5772156649015329
N = NormalDist()


def expected_max_sharpe(n_trials, sharpe_var):
    """Expected maximum Sharpe of n_trials independent zero-skill strategies."""
    if n_trials <= 1:
        return 0.0
    sd = math.sqrt(sharpe_var)
    return sd * ((1 - EULER_GAMMA) * N.inv_cdf(1 - 1 / n_trials) + EULER_GAMMA * N.inv_cdf(1 - 1 / (n_trials * math.e)))


def psr(sharpe, benchmark, n_obs, skew=0.0, kurtosis=3.0):
    """Probability that the true Sharpe exceeds `benchmark`."""
    if n_obs < 2:
        raise ValueError("need at least 2 observations")
    denom = 1 - skew * sharpe + (kurtosis - 1) / 4 * sharpe ** 2
    if denom <= 0:
        raise ValueError("non-positive variance term: check skew/kurtosis inputs")
    return N.cdf((sharpe - benchmark) * math.sqrt(n_obs - 1) / math.sqrt(denom))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--sharpe", type=float, required=True, help="observed (best) Sharpe, per period")
    ap.add_argument("--n-obs", type=int, required=True, help="number of return observations")
    ap.add_argument("--skew", type=float, default=0.0)
    ap.add_argument("--kurtosis", type=float, default=3.0, help="raw kurtosis (normal = 3)")
    ap.add_argument("--trials", type=int, default=1, help="number of independent strategy variants tried")
    ap.add_argument("--sharpe-var", type=float, default=None, help="variance of Sharpe across trials (per period)")
    ap.add_argument("--periods-per-year", type=float, default=252)
    a = ap.parse_args()

    sv = a.sharpe_var if a.sharpe_var is not None else 1 / a.n_obs  # rough default: sampling variance of a zero-mean Sharpe
    sr0 = expected_max_sharpe(a.trials, sv)
    p0 = psr(a.sharpe, 0.0, a.n_obs, a.skew, a.kurtosis)
    dsr = psr(a.sharpe, sr0, a.n_obs, a.skew, a.kurtosis)
    ann = math.sqrt(a.periods_per_year)
    print(f"observed Sharpe        {a.sharpe:.4f} per period  ({a.sharpe * ann:.2f} annualized)")
    print(f"expected max under H0  {sr0:.4f} per period  ({sr0 * ann:.2f} annualized) for {a.trials} trials")
    print(f"PSR vs 0               {p0:.4f}")
    print(f"DSR                    {dsr:.4f}")
    verdict = "strong" if dsr >= 0.95 else "inconclusive" if dsr >= 0.5 else "likely noise"
    print(f"verdict                {verdict}")


if __name__ == "__main__":
    main()
