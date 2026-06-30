"""Robustness harness for the macro gate.

Two independent tests on the 365-day series (free-tier CoinGecko cap):
  1. Parameter sensitivity — does the gate's edge survive across SMA windows?
  2. Block-bootstrap Monte Carlo — resample contiguous return blocks to build many
     synthetic regime orderings, then compare V2-gated vs V2-ungated on each path.
     This is the real test of "is the gate a one-window artifact": if the gate only
     wins on the single historical ordering it's luck; if it wins across hundreds of
     reshuffled regime sequences (especially bear-heavy ones) it's a real effect.
"""
from __future__ import annotations

import numpy as np
import pandas as pd

from data import load_prices
from strategies import SYMBOLS, V2_WEIGHTS, make_v2, simulate

CAPITAL = 20_000
SEED = 12345


def _metrics(prices: pd.DataFrame, fn, name: str) -> dict:
    return simulate(prices, fn, CAPITAL, name)


# ---------------- Test 1: SMA-window sensitivity ----------------
def sma_sensitivity(prices: pd.DataFrame) -> pd.DataFrame:
    rows = []
    # baseline: ungated
    r = _metrics(prices, make_v2(V2_WEIGHTS, CAPITAL, macro_gate=False), "ungated")
    rows.append(("ungated", "-", r["total_return_pct"], r["max_drawdown_pct"], r["sharpe"], r["n_trades"]))
    for w in (150, 175, 200, 225, 250):
        r = _metrics(prices, make_v2(V2_WEIGHTS, CAPITAL, macro_gate=True, macro_sma=w), f"gate{w}")
        rows.append((f"gate sma={w}", w, r["total_return_pct"], r["max_drawdown_pct"], r["sharpe"], r["n_trades"]))
    return pd.DataFrame(rows, columns=["variant", "sma", "return_pct", "drawdown_pct", "sharpe", "trades"])


# ---------------- Test 2: block-bootstrap Monte Carlo ----------------
def block_bootstrap_paths(prices: pd.DataFrame, n_paths: int, block: int, rng: np.random.Generator):
    """Yield synthetic price frames by stitching contiguous blocks of daily returns
    (shared block indices across all assets → preserves cross-asset correlation;
    block length preserves within-asset trend persistence)."""
    rets = prices.pct_change().dropna()
    n = len(rets)
    n_blocks = int(np.ceil(n / block))
    start = prices.iloc[0]
    for _ in range(n_paths):
        starts = rng.integers(0, n - block, size=n_blocks)
        idx = np.concatenate([np.arange(s, s + block) for s in starts])[:n]
        sampled = rets.iloc[idx].reset_index(drop=True)
        levels = (1 + sampled).cumprod()
        synth = levels.mul(start, axis=1)
        synth.index = prices.index[: len(synth)]
        yield synth


def monte_carlo(prices: pd.DataFrame, n_paths: int = 400, block: int = 21) -> dict:
    rng = np.random.default_rng(SEED)
    recs = []
    for synth in block_bootstrap_paths(prices, n_paths, block, rng):
        g = _metrics(synth, make_v2(V2_WEIGHTS, CAPITAL, macro_gate=True), "g")
        u = _metrics(synth, make_v2(V2_WEIGHTS, CAPITAL, macro_gate=False), "u")
        # buy&hold of this path = ungated-weighted hold; proxy regime by BTC path return
        btc_ret = synth["BTC"].iloc[-1] / synth["BTC"].iloc[0] - 1
        recs.append({
            "g_ret": g["total_return_pct"], "u_ret": u["total_return_pct"],
            "g_dd": g["max_drawdown_pct"], "u_dd": u["max_drawdown_pct"],
            "g_sharpe": g["sharpe"], "u_sharpe": u["sharpe"],
            "btc_ret": btc_ret * 100,
        })
    return {"df": pd.DataFrame(recs), "block": block, "n_paths": n_paths}


def summarize_mc(mc: dict) -> None:
    df = mc["df"]
    df["edge"] = df["g_ret"] - df["u_ret"]
    bear = df[df["btc_ret"] < 0]
    bull = df[df["btc_ret"] >= 0]
    print(f"\n=== Monte Carlo: {mc['n_paths']} paths, block={mc['block']}d ===")
    print(f"{'metric':<34}{'GATED':>12}{'UNGATED':>12}")
    print("-" * 58)
    print(f"{'median return %':<34}{df.g_ret.median():>12.2f}{df.u_ret.median():>12.2f}")
    print(f"{'mean return %':<34}{df.g_ret.mean():>12.2f}{df.u_ret.mean():>12.2f}")
    print(f"{'median max drawdown %':<34}{df.g_dd.median():>12.2f}{df.u_dd.median():>12.2f}")
    print(f"{'median sharpe':<34}{df.g_sharpe.median():>12.2f}{df.u_sharpe.median():>12.2f}")
    print(f"{'5th pct return % (tail risk)':<34}{df.g_ret.quantile(.05):>12.2f}{df.u_ret.quantile(.05):>12.2f}")
    print("-" * 58)
    print(f"win-rate (gated >= ungated): {(df.edge >= 0).mean()*100:.1f}%  over {len(df)} paths")
    print(f"mean edge (gated - ungated): {df.edge.mean():+.2f} pp")
    print(f"\nconditioned on regime (by BTC path return):")
    print(f"  BEAR paths (BTC<0): n={len(bear):<4} median edge {bear.edge.median():+.2f} pp  "
          f"gate win-rate {(bear.edge>=0).mean()*100:.0f}%")
    print(f"  BULL paths (BTC>=0): n={len(bull):<4} median edge {bull.edge.median():+.2f} pp  "
          f"gate win-rate {(bull.edge>=0).mean()*100:.0f}%")


def main() -> None:
    print("Loading prices (cached)...")
    prices = load_prices(days=365)
    print(f"{len(prices)} days: {prices.index[0].date()} -> {prices.index[-1].date()}")

    print("\n" + "=" * 58)
    print("TEST 1 — SMA-window sensitivity (does the edge survive?)")
    print("=" * 58)
    sens = sma_sensitivity(prices)
    with pd.option_context("display.float_format", lambda x: f"{x:.2f}"):
        print(sens.to_string(index=False))

    print("\n" + "=" * 58)
    print("TEST 2 — block-bootstrap Monte Carlo")
    print("=" * 58)
    for block in (14, 21, 30):
        summarize_mc(monte_carlo(prices, n_paths=400, block=block))


if __name__ == "__main__":
    main()
