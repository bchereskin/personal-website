# Crypto Dashboard Development Handoff

> **STATUS (2026-06-29): RESOLVED — this doc is historical.** The dashboard was rebuilt as a
> Next.js page (Option C) at `app/dashboard/page.tsx`, reading snapshots from Supabase via
> `createSupabaseBrowser`. The publish-MCP / client-fetch-CSP problem described below no longer
> applies. The "Backtest Validation" section now shows real numbers from `backtest/run.py`
> (the earlier hardcoded values were fake). Kept for reference on the schema + design intent.

## Project Overview

Brett runs an AI-powered crypto portfolio monitor on a $20K paper trading fund via Alpaca. A scheduled task in Cowork runs 3x daily (8AM, 1PM, 7PM ET) that:
1. Checks 6 crypto positions against 7 sell strategies and 3 rebuy strategies
2. Executes trades via Alpaca MCP
3. Logs everything to Supabase (trade log, fund ledger, strategy snapshots)
4. Updates a published dashboard
5. Sends an iMessage summary

The scheduled task file lives at the root of this project folder as `SKILL.md`. It is already updated with the latest Strategy 5 changes and fixed iMessage template. **Do not modify the strategy logic or iMessage template — those are finalized.**

---

## What Needs To Be Built

### Problem: The dashboard keeps breaking

The dashboard is published at `brettchereskin.com/shared/crypto-dashboard` using the Cowork `publish` MCP tool (`update_page` with slug `crypto-dashboard`).

**Previous approach (broken):** Each scheduled task run rebuilt the entire HTML from scratch, causing layout/style variations between runs.

**Attempted fix (also broken):** Deployed a static HTML page that fetches data from Supabase REST API client-side. This fails because the publishing platform blocks outbound JavaScript fetch requests (likely CSP `connect-src` restriction). The page just shows a loading spinner forever.

**What Brett wants:** A clean, streamlined, dark-themed dashboard that displays live portfolio data reliably. It should look consistent every time. No 6-month backtest tab (remove it entirely — it was hardcoded fake data).

### Recommended solutions (pick the best approach):

**Option A — Supabase Edge Function + static HTML:**
Deploy an Edge Function on Supabase that serves the snapshot data. The published HTML page calls the edge function (which may not be blocked by CSP since it could be same-origin or allowlisted). The task only writes snapshot data, never touches the HTML.

**Option B — Fixed HTML template in the scheduled task:**
Define the EXACT dashboard HTML as a template in `SKILL.md`. The scheduled task calls `update_page` each run but uses the identical template with only data values swapped. This guarantees consistent layout. Downside: still rebuilds HTML each run, but from a fixed template.

**Option C — Vercel deployment:**
Deploy a proper Next.js/static site on Vercel that reads from Supabase. The Vercel MCP tools are connected. This gives full control over CSP, hosting, and frontend. Most robust but most complex.

Brett should decide which approach. If using Option B, the template should be embedded in SKILL.md with clear placeholder markers.

---

## Supabase Details

- **Project ID:** `opnsoprahgrfwjiwyvnn`
- **URL:** `https://opnsoprahgrfwjiwyvnn.supabase.co`
- **Anon Key:** stored in env as `NEXT_PUBLIC_SUPABASE_ANON_KEY` (do not commit; pull from Vercel/Supabase project settings)
- **RLS:** Enabled on all tables. Anon SELECT allowed on `strategy_snapshots` and `strategy_fund_ledger`. Public ALL on `crypto_trade_log` and `crypto_position_baselines`.

### Table Schemas

#### `strategy_snapshots` — Main dashboard data source
The scheduled task writes one row per run. Dashboard reads the latest row.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, auto-generated |
| snapshot_time | timestamptz | When the snapshot was taken |
| total_nav | numeric | Cash + invested value |
| cash_balance | numeric | From strategy_fund_ledger |
| invested_value | numeric | Sum of position market values |
| total_return_pct | numeric | ((nav - 20000) / 20000) * 100 |
| positions | jsonb | Per-position data (see example below) |
| risk_metrics | jsonb | Portfolio-level metrics (see example below) |
| created_at | timestamptz | Row creation time |

**Example `positions` JSON:**
```json
{
  "BTC/USD": {
    "qty": 0.069310979,
    "current_price": 74582.48,
    "market_value": 5167.58,
    "cost_basis": 4903.12,
    "unrealized_pl": 264.46,
    "return_pct": 5.39,
    "weight_pct": 24.89
  },
  "ETH/USD": { ... },
  "SOL/USD": { ... },
  "AVAX/USD": { ... },
  "DOGE/USD": { ... },
  "LINK/USD": { ... }
}
```
Note: `cost_basis` is TOTAL (qty * avg_entry). Per-unit cost = cost_basis / qty.

**Example `risk_metrics` JSON:**
```json
{
  "cash_pct": 12.39,
  "largest_position": "ETH/USD",
  "largest_position_pct": 25.22,
  "positions_in_profit": 6,
  "positions_in_loss": 0,
  "total_unrealized_pl": 795.21,
  "avax_remaining_pct": 10.01,
  "avax_trimmed_proceeds": 2215.13
}
```

#### `crypto_trade_log` — Trade history (used for AVAX timeline)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| symbol | text | e.g., "AVAX/USD" |
| action | text | "sell" or "buy" |
| strategy | text | e.g., "narrative_shift", "sentiment_collapse", "initial_deploy" |
| quantity | numeric | Amount traded |
| price | numeric | Fill price |
| pct_of_position | numeric | % of position traded |
| reason_detail | text | Human-readable explanation |
| sentiment_at_action | numeric | LunarCrush sentiment % at trade time |
| cash_after_action | numeric | Alpaca cash after trade |
| equity_after_action | numeric | Alpaca equity after trade |
| created_at | timestamptz | Trade timestamp |

#### `crypto_position_baselines` — Position reference data

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| symbol | text | e.g., "BTC/USD" |
| original_deploy_usd | numeric | Original $ deployed |
| avg_entry_price | numeric | Average entry price |
| original_qty | numeric | Original quantity bought |
| buy_sentiment_pct | numeric | Sentiment at buy time |
| stop_trigger_price | numeric | Stop-loss trigger |
| stop_limit_price | numeric | Stop-loss limit |
| stop_buffer_pct | numeric | Buffer % |
| status | text | "active" or "partial" |
| current_qty | numeric | Current holding qty |
| trailing_stop_high | numeric | Highest price since entry |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### `strategy_fund_ledger` — Cash flow tracking

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| entry_type | text | "sell", "rebuy", "initial_deploy" |
| symbol | text | |
| quantity | numeric | |
| price | numeric | |
| cash_flow | numeric | + for sells, - for buys |
| running_cash_balance | numeric | Fund cash after this entry |
| running_invested_value | numeric | |
| running_nav | numeric | |
| note | text | |
| alpaca_fill_id | text | Alpaca order ID |
| trade_log_id | uuid | FK to crypto_trade_log |
| event_time | timestamptz | |
| created_at | timestamptz | |

#### `crypto_monitor_runs` — Run log

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| scheduled_time | text | Scheduled time label |
| actual_run_at | timestamptz | Actual run time |
| positions_checked | integer | Always 6 |
| triggers_fired | integer | Count of strategy triggers |
| triggers_detail | text | Description of what fired |
| status | text | "completed" |

---

## Dashboard Design Requirements

**Theme:** Dark (#0a0e17 background), consistent with what was deployed previously.

**Sections (in order):**
1. **Header:** "AI Crypto Strategy Dashboard" with subtitle "Sentiment-driven risk management · $20K paper trading fund"
2. **Hero cards (4 across):** Strategy NAV, Total Return %, Cash Balance, Invested Amount
3. **Two-column layout:** Allocation donut chart (left), Risk Metrics grid (right)
4. **Position cards (3×2 grid):** Each shows symbol, return %, price, value, weight, cost basis. AVAX card shows trim percentage.
5. **AVAX Trim Timeline:** Chronological list of all AVAX sells from `crypto_trade_log`
6. **Footer:** Last updated timestamp, "Runs 3× daily" note

**Chart.js colors:**
- BTC: #f7931a
- ETH: #627eea
- SOL: #9945ff
- DOGE: #c2a633
- LINK: #2a5ada
- AVAX: #e84142
- Cash: #3b82f6

**NO backtest tab.** That feature was broken (hardcoded fake data) and has been removed.

---

## Connected MCPs & Tools

The Cowork session has these relevant MCPs connected:
- **Alpaca** — Paper trading (positions, orders, trades)
- **Supabase** — Database (execute_sql, apply_migration, edge functions)
- **LunarCrush** — Crypto sentiment (Fetch, Cryptocurrencies, Stocks tools)
- **Blockscout** — On-chain data (token balances for LINK treasury monitoring)
- **Publish** — HTML page hosting at brettchereskin.com/shared/{slug}
- **Vercel** — Deployment platform (if deploying a proper frontend)
- **iMessage** — Alert delivery

---

## Current State Summary

- **Fund NAV:** $20,761 (+3.80% return)
- **Positions:** All 6 in profit (BTC +5.4%, ETH +6.7%, SOL +2.3%, DOGE +2.8%, LINK +3.4%, AVAX +2.7%)
- **AVAX:** Has been trimmed from 269.4 to 27.0 units (90% trimmed) via 8 sells over 2 days. Strategy 5 was firing every single run because it only checked social dominance. Now updated to also require negative price momentum + profitability check + 48h cooldown.
- **Cash reserve:** $2,573.43 (12.4% of fund)
- **Snapshots in DB:** 3 rows available for the dashboard to read
- **Trade log:** 10+ entries, mostly AVAX sells

---

## Key Files

- `SKILL.md` — The scheduled task definition (already updated with Strategy 5 fixes, fixed iMessage template, and instruction to NOT rebuild dashboard HTML)
- `DASHBOARD-HANDOFF.md` — This file
