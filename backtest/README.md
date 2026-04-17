# Crypto strategy backtest

Offline validation harness for the v2 crypto strategy. Pulls daily prices from CoinGecko for the 6 portfolio assets, simulates HODL / V1 / V2 rule engines over a configurable window, and prints per-strategy return, drawdown, Sharpe, and trade counts.

## Setup

```bash
python3 -m venv .venv
.venv/bin/pip install pandas numpy requests matplotlib
```

## Run

```bash
.venv/bin/python run.py
```

Cached CSVs land in `backtest/cache/` (12h TTL, gitignored). Equity curves are written to `equity_curves.csv` (also gitignored).

## Files

- `data.py` — CoinGecko fetch + cache
- `strategies.py` — HODL / V1 / V2 rule engines + simulator
- `run.py` — entry point
