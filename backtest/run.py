"""Entry point: run HODL vs V1 vs V2 over historical data and print comparison."""
from __future__ import annotations

import pandas as pd

from data import load_prices
from strategies import (
    V1_WEIGHTS,
    V2_WEIGHTS,
    make_hodl,
    make_v1,
    make_v2,
    make_v3,
    simulate,
)

CAPITAL = 20_000  # match the v1 strategy's deployed capital
DAYS = 365


def pct(x: float) -> str:
    return f"{x:+.2f}%"


def fmt_money(x: float) -> str:
    return f"${x:,.0f}"


def print_result(r: dict) -> None:
    print(f"\n=== {r['name']} ===")
    print(f"  final equity:       {fmt_money(r['final_equity'])}")
    print(f"  total return:       {pct(r['total_return_pct'])}")
    print(f"  max drawdown:       {pct(r['max_drawdown_pct'])} on {r['max_drawdown_date'].date()}")
    print(f"  sharpe (daily):     {r['sharpe']:.2f}")
    print(f"  n_trades:           {r['n_trades']}")
    if r["trades_by_strategy"]:
        print("  trades by rule:")
        for rule, n in sorted(r["trades_by_strategy"].items(), key=lambda kv: -kv[1]):
            print(f"    {rule:<28} {n}")
    print(f"  final cash:         {fmt_money(r['final_cash'])}")
    print(f"  final positions:")
    for s, v in r["final_positions"].items():
        print(f"    {s:<5} {fmt_money(v)}")


def main() -> None:
    print("Fetching price data...")
    prices = load_prices(days=DAYS)
    print(f"\nLoaded {len(prices)} days: {prices.index[0].date()} -> {prices.index[-1].date()}\n")

    results = [
        # NOTE: the deployed scheduled task (crypto-monitor/SKILL.md, revised 2026-06-24)
        # IS macro-gated. "V2 ungated" below is the counterfactual baseline, NOT what runs live.
        simulate(prices, make_hodl(V2_WEIGHTS, CAPITAL), CAPITAL, "HODL (target wts)"),
        simulate(prices, make_v1(V1_WEIGHTS, CAPITAL), CAPITAL, "V1 rules (original)"),
        simulate(prices, make_v2(V2_WEIGHTS, CAPITAL), CAPITAL, "V2 ungated (counterfac)"),
        simulate(prices, make_v2(V2_WEIGHTS, CAPITAL, macro_gate=True), CAPITAL, "V2 + macro gate (LIVE)"),
        # V3's extra machinery (re-entry ladder, re-anchored rebuy) did NOT beat V2+gate — shelved.
        simulate(prices, make_v3(V2_WEIGHTS, CAPITAL), CAPITAL, "V3 aggressive (shelved)"),
        simulate(prices, make_v3(V2_WEIGHTS, CAPITAL, macro_gate=True), CAPITAL, "V3 gated (shelved)"),
    ]

    for r in results:
        print_result(r)

    # summary table
    print("\n" + "=" * 60)
    print(f"{'strategy':<22} {'return':>10} {'drawdown':>11} {'sharpe':>8} {'trades':>8}")
    print("-" * 60)
    for r in results:
        print(f"{r['name']:<22} {pct(r['total_return_pct']):>10} {pct(r['max_drawdown_pct']):>11} "
              f"{r['sharpe']:>8.2f} {r['n_trades']:>8}")

    # save equity curves for optional plotting
    eq_df = pd.concat({r["name"]: r["equity_curve"] for r in results}, axis=1)
    out = eq_df
    out.to_csv("equity_curves.csv")
    print(f"\nWrote equity_curves.csv ({len(out)} rows)")


if __name__ == "__main__":
    main()
