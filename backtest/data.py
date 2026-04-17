"""Fetch daily close prices for the 6 strategy assets from CoinGecko and cache locally."""
from __future__ import annotations

import time
from pathlib import Path

import pandas as pd
import requests

CACHE_DIR = Path(__file__).parent / "cache"
CACHE_DIR.mkdir(exist_ok=True)

COINS = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
    "SOL": "solana",
    "AVAX": "avalanche-2",
    "DOGE": "dogecoin",
    "LINK": "chainlink",
}

CACHE_TTL_SEC = 12 * 3600


def _fetch_one(symbol: str, coin_id: str, days: int) -> pd.DataFrame:
    cache = CACHE_DIR / f"{symbol}_{days}.csv"
    if cache.exists() and time.time() - cache.stat().st_mtime < CACHE_TTL_SEC:
        return pd.read_csv(cache, index_col=0, parse_dates=True)

    url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart"
    params = {"vs_currency": "usd", "days": str(days)}
    for attempt in range(4):
        resp = requests.get(url, params=params, timeout=30)
        if resp.status_code == 429:
            wait = 30 * (attempt + 1)
            print(f"[429, waiting {wait}s]", end=" ", flush=True)
            time.sleep(wait)
            continue
        resp.raise_for_status()
        break
    else:
        resp.raise_for_status()
    raw = resp.json()["prices"]
    df = pd.DataFrame(raw, columns=["ts_ms", "price"])
    df["date"] = pd.to_datetime(df["ts_ms"], unit="ms", utc=True).dt.floor("D")
    # CoinGecko sometimes returns multiple points per day; take last
    df = df.groupby("date", as_index=True)["price"].last().to_frame()
    df.to_csv(cache)
    return df


def load_prices(days: int = 365) -> pd.DataFrame:
    """Return DataFrame indexed by date with one price column per symbol."""
    frames: dict[str, pd.Series] = {}
    for sym, cid in COINS.items():
        print(f"  {sym}...", end=" ", flush=True)
        df = _fetch_one(sym, cid, days)
        frames[sym] = df["price"].rename(sym)
        time.sleep(1.8)  # free-tier friendly
        print("ok")
    prices = pd.concat(frames.values(), axis=1).sort_index()
    prices = prices.dropna(how="any")
    return prices


if __name__ == "__main__":
    p = load_prices(days=365)
    print(p.tail())
    print(f"\nrange: {p.index[0].date()} -> {p.index[-1].date()}  ({len(p)} days)")
