"""Rule engines + simulator for the strategies: HODL, V1 (current), V2 (proposed).

v2 of this file: fixes S4 cooldown, adds price-based rebuy to V1 (for fair comparison),
tunes V2 deploy-to-target to be less noisy, tracks sell-prices for rebuy logic.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Callable

import numpy as np
import pandas as pd

SYMBOLS = ["BTC", "ETH", "SOL", "AVAX", "DOGE", "LINK"]

V1_WEIGHTS = {"BTC": 0.25, "ETH": 0.25, "SOL": 0.20, "AVAX": 0.125, "DOGE": 0.10, "LINK": 0.075}
V2_WEIGHTS = {"BTC": 0.30, "ETH": 0.30, "SOL": 0.20, "LINK": 0.10, "DOGE": 0.07, "AVAX": 0.03}

TRAIL_PCT = {"BTC": 0.10, "ETH": 0.10, "SOL": 0.15, "AVAX": 0.15, "DOGE": 0.15, "LINK": 0.15}


@dataclass
class Portfolio:
    cash: float
    qty: dict[str, float] = field(default_factory=lambda: {s: 0.0 for s in SYMBOLS})
    cost_basis: dict[str, float] = field(default_factory=lambda: {s: 0.0 for s in SYMBOLS})
    trail_high: dict[str, float] = field(default_factory=lambda: {s: 0.0 for s in SYMBOLS})
    portfolio_peak: float = 0.0
    last_avax_trim_day: int = -9999
    s4_armed: bool = True  # fires once; re-arms only on NEW all-time peak
    last_s4_peak: float = 0.0  # peak level at last S4 fire
    sell_prices: dict[str, float] = field(default_factory=dict)  # for rebuy tracking
    low_since_sell: dict[str, float] = field(default_factory=dict)  # running low after exit (V3 re-anchor)
    s2_fire_days: list[int] = field(default_factory=list)  # for contagion detection
    risk_off_until_day: int = -1  # regime-risk-off expiry
    trades: int = 0
    trades_by_strategy: dict[str, int] = field(default_factory=dict)

    def equity(self, prices: pd.Series) -> float:
        return self.cash + sum(self.qty[s] * prices[s] for s in SYMBOLS)

    def invested(self, prices: pd.Series) -> float:
        return sum(self.qty[s] * prices[s] for s in SYMBOLS)

    def record_trade(self, strategy: str) -> None:
        self.trades += 1
        self.trades_by_strategy[strategy] = self.trades_by_strategy.get(strategy, 0) + 1

    def buy_usd(self, symbol: str, usd: float, price: float, strategy: str) -> None:
        usd = min(usd, self.cash)
        if usd <= 0 or price <= 0:
            return
        q = usd / price
        cur_cost = self.cost_basis[symbol] * self.qty[symbol]
        new_qty = self.qty[symbol] + q
        self.cost_basis[symbol] = (cur_cost + usd) / new_qty if new_qty > 0 else 0
        self.qty[symbol] = new_qty
        self.cash -= usd
        if self.trail_high[symbol] == 0 or price > self.trail_high[symbol]:
            self.trail_high[symbol] = price
        self.record_trade(strategy)

    def sell_qty(self, symbol: str, q: float, price: float, strategy: str) -> float:
        q = min(q, self.qty[symbol])
        if q <= 0:
            return 0.0
        proceeds = q * price
        self.qty[symbol] -= q
        if self.qty[symbol] <= 1e-9:
            self.qty[symbol] = 0.0
            self.trail_high[symbol] = 0.0
            self.cost_basis[symbol] = 0.0
            self.sell_prices[symbol] = price  # remember for rebuy
            self.low_since_sell[symbol] = price  # seed running low for V3 re-anchor
        self.cash += proceeds
        self.record_trade(strategy)
        return proceeds

    def sell_pct(self, symbol: str, pct: float, price: float, strategy: str) -> float:
        return self.sell_qty(symbol, self.qty[symbol] * pct, price, strategy)


def initial_deploy(p: Portfolio, prices: pd.Series, weights: dict[str, float], capital: float) -> None:
    p.cash = capital
    for sym, w in weights.items():
        p.buy_usd(sym, capital * w, prices[sym], "initial_deploy")
    p.portfolio_peak = p.equity(prices)


def update_peaks(p: Portfolio, prices: pd.Series) -> float:
    for s in SYMBOLS:
        if p.qty[s] > 0 and prices[s] > p.trail_high[s]:
            p.trail_high[s] = prices[s]
    eq = p.equity(prices)
    if eq > p.portfolio_peak:
        p.portfolio_peak = eq
        # re-arm S4 only on NEW all-time peak (not on partial recovery within same drawdown)
        if eq > p.last_s4_peak:
            p.s4_armed = True
    return eq


def _price_based_rebuy(p: Portfolio, prices: pd.Series, prev: pd.DataFrame, day: int,
                       weights: dict[str, float], tag: str) -> None:
    """Shared rebuy logic — if an asset was sold and has recovered >12% from sell price
    AND 7-day momentum is positive, buy back to ~half the target weight."""
    if day < 7 or p.cash < 200:
        return
    eq = p.equity(prices)
    for s in list(p.sell_prices.keys()):
        if p.qty[s] > 0:
            # already holding; no rebuy needed
            continue
        sell_px = p.sell_prices[s]
        if sell_px <= 0:
            continue
        recovery = prices[s] / sell_px - 1
        mom7 = prices[s] / prev.iloc[day - 7][s] - 1
        if recovery > 0.12 and mom7 > 0:
            target_usd = eq * weights[s] * 0.5  # half-weight re-entry
            spend = min(target_usd, p.cash * 0.5)
            if spend > 50:
                p.buy_usd(s, spend, prices[s], tag)
                del p.sell_prices[s]


# ----------------- HODL -----------------
def make_hodl(weights: dict[str, float], capital: float) -> Callable:
    def strategy(day: int, prices: pd.Series, prev: pd.DataFrame, p: Portfolio) -> None:
        if day == 0:
            initial_deploy(p, prices, weights, capital)
    return strategy


# ----------------- V1 (current rules + fair rebuy) -----------------
def make_v1(weights: dict[str, float], capital: float) -> Callable:
    """Current strategy: S1, S2, S4 (with cooldown fix), S5 (AVAX price proxy), S6.
    Adds a price-recovery rebuy so comparison is fair (otherwise V1 just stops out and sits in cash)."""
    def strategy(day: int, prices: pd.Series, prev: pd.DataFrame, p: Portfolio) -> None:
        if day == 0:
            initial_deploy(p, prices, weights, capital)
            return

        eq = update_peaks(p, prices)

        # S1 — full portfolio stop
        unrealized = p.invested(prices) - sum(p.cost_basis[s] * p.qty[s] for s in SYMBOLS)
        if capital > 0 and unrealized / capital < -0.25:
            for s in SYMBOLS:
                if p.qty[s] > 0:
                    p.sell_pct(s, 1.0, prices[s], "S1_portfolio_stop")
            return

        # S6 — 24h breakdown
        if day >= 1:
            yday = prev.iloc[day - 1]
            for s in SYMBOLS:
                if p.qty[s] > 0 and yday[s] > 0 and prices[s] / yday[s] - 1 <= -0.20:
                    p.sell_pct(s, 1.0, prices[s], "S6_tech_breakdown")

        # S2 — trailing stop
        for s in SYMBOLS:
            if p.qty[s] > 0 and p.trail_high[s] > 0 and prices[s] / p.trail_high[s] - 1 <= -TRAIL_PCT[s]:
                p.sell_pct(s, 1.0, prices[s], "S2_trailing_stop")
                p.s2_fire_days.append(day)

        # S4 — portfolio drawdown, fires ONCE per event (re-arms only on new all-time peak)
        if p.portfolio_peak > 0 and eq / p.portfolio_peak - 1 <= -0.15 and p.s4_armed:
            for s in SYMBOLS:
                if p.qty[s] > 0:
                    p.sell_pct(s, 0.25, prices[s], "S4_portfolio_drawdown")
            p.s4_armed = False
            p.last_s4_peak = p.portfolio_peak

        # S5 proxy — AVAX underperforming BTC by 8pp over 7d AND 24h negative AND not profitable
        if day >= 7 and p.qty["AVAX"] > 0 and day - p.last_avax_trim_day >= 2:
            avax_7d = prices["AVAX"] / prev.iloc[day - 7]["AVAX"] - 1
            btc_7d = prices["BTC"] / prev.iloc[day - 7]["BTC"] - 1
            avax_24h = prices["AVAX"] / prev.iloc[day - 1]["AVAX"] - 1
            cost = p.cost_basis["AVAX"]
            profit_pct = (prices["AVAX"] / cost - 1) if cost > 0 else 0
            if avax_7d - btc_7d < -0.08 and avax_24h < 0 and profit_pct <= 0.02:
                p.sell_pct("AVAX", 0.25, prices["AVAX"], "S5_avax_narrative")
                p.last_avax_trim_day = day

        # V1 rebuy: price recovery + positive momentum
        _price_based_rebuy(p, prices, prev, day, weights, "V1_rebuy_recovery")

    return strategy


# ----------------- V2 (rotation, regime gate, deploy-to-target) -----------------
def make_v2(weights: dict[str, float], capital: float, macro_gate: bool = False,
            macro_sma: int = 200) -> Callable:

    def _macro_ok(prices: pd.Series, prev: pd.DataFrame, day: int) -> bool:
        if not macro_gate:
            return True
        if day < macro_sma:
            return False
        return prices["BTC"] > prev.iloc[day - macro_sma:day]["BTC"].mean()

    def _health_score(s: str, prices: pd.Series, prev: pd.DataFrame, day: int, p: Portfolio) -> float:
        if day < 7:
            return 1.0
        mom7 = prices[s] / prev.iloc[day - 7][s] - 1
        eq_now = p.equity(prices)
        target_usd = eq_now * weights[s]
        current_usd = p.qty[s] * prices[s]
        under = max(0.0, (target_usd - current_usd) / max(target_usd, 1))
        score = (1 + max(mom7, -0.5)) * (0.5 + under)
        return max(score, 0.01)

    def _regime_risk_off(prices: pd.Series, prev: pd.DataFrame, day: int, p: Portfolio) -> bool:
        # Explicit contagion regime: once triggered, sticks for 30 days
        if day <= p.risk_off_until_day:
            return True
        # Contagion: 3+ S2 fires in trailing 14 days → risk-off for 30 days
        recent_s2 = [d for d in p.s2_fire_days if d >= day - 14]
        if len(recent_s2) >= 3:
            p.risk_off_until_day = day + 30
            return True
        # Classic: BTC below 200d SMA AND portfolio drawdown > 10%
        if day >= 200:
            btc_200 = prev.iloc[day - 200:day]["BTC"].mean()
            drawdown = p.equity(prices) / p.portfolio_peak - 1 if p.portfolio_peak > 0 else 0
            if prices["BTC"] < btc_200 and drawdown <= -0.10:
                return True
        return False

    def _rotate_proceeds(proceeds: float, sold: str, prices: pd.Series, prev: pd.DataFrame,
                         day: int, p: Portfolio) -> None:
        if proceeds <= 0 or _regime_risk_off(prices, prev, day, p):
            return
        candidates = [s for s in SYMBOLS if s != sold]
        scores = {s: _health_score(s, prices, prev, day, p) for s in candidates}
        # Healthy = not in own trailing-stop zone
        healthy = {s: sc for s, sc in scores.items()
                   if p.trail_high[s] == 0 or prices[s] / p.trail_high[s] - 1 > -TRAIL_PCT[s]}
        if not healthy:
            return
        total = sum(healthy.values())
        for s, sc in healthy.items():
            share = proceeds * sc / total
            if share > 25:  # skip dust
                p.buy_usd(s, share, prices[s], "rotation_buy")

    def strategy(day: int, prices: pd.Series, prev: pd.DataFrame, p: Portfolio) -> None:
        if day == 0:
            initial_deploy(p, prices, weights, capital)
            return

        eq = update_peaks(p, prices)

        # S1 always dumps to cash (no rotation)
        unrealized = p.invested(prices) - sum(p.cost_basis[s] * p.qty[s] for s in SYMBOLS)
        if capital > 0 and unrealized / capital < -0.25:
            for s in SYMBOLS:
                if p.qty[s] > 0:
                    p.sell_pct(s, 1.0, prices[s], "S1_portfolio_stop")
            return

        # S6 tech breakdown → rotate (or cash if regime off)
        if day >= 1:
            yday = prev.iloc[day - 1]
            for s in SYMBOLS:
                if p.qty[s] > 0 and yday[s] > 0 and prices[s] / yday[s] - 1 <= -0.20:
                    proc = p.sell_pct(s, 1.0, prices[s], "S6_tech_breakdown")
                    _rotate_proceeds(proc, s, prices, prev, day, p)

        # S2 trailing stop → rotate (or cash if risk-off)
        for s in SYMBOLS:
            if p.qty[s] > 0 and p.trail_high[s] > 0 and prices[s] / p.trail_high[s] - 1 <= -TRAIL_PCT[s]:
                proc = p.sell_pct(s, 1.0, prices[s], "S2_trailing_stop")
                p.s2_fire_days.append(day)
                _rotate_proceeds(proc, s, prices, prev, day, p)

        # S4 portfolio drawdown — ONCE per event, proceeds stay in cash (defensive)
        if p.portfolio_peak > 0 and eq / p.portfolio_peak - 1 <= -0.15 and p.s4_armed:
            for s in SYMBOLS:
                if p.qty[s] > 0:
                    p.sell_pct(s, 0.25, prices[s], "S4_portfolio_drawdown")
            p.s4_armed = False
            p.last_s4_peak = p.portfolio_peak

        # S5 AVAX narrative → rotate instead of cash
        if day >= 7 and p.qty["AVAX"] > 0 and day - p.last_avax_trim_day >= 2:
            avax_7d = prices["AVAX"] / prev.iloc[day - 7]["AVAX"] - 1
            btc_7d = prices["BTC"] / prev.iloc[day - 7]["BTC"] - 1
            avax_24h = prices["AVAX"] / prev.iloc[day - 1]["AVAX"] - 1
            cost = p.cost_basis["AVAX"]
            profit_pct = (prices["AVAX"] / cost - 1) if cost > 0 else 0
            if avax_7d - btc_7d < -0.08 and avax_24h < 0 and profit_pct <= 0.02:
                proc = p.sell_pct("AVAX", 0.25, prices["AVAX"], "S5_avax_narrative")
                _rotate_proceeds(proc, "AVAX", prices, prev, day, p)
                p.last_avax_trim_day = day

        # Rebuy (price-recovery) — re-enter stopped-out assets
        if _macro_ok(prices, prev, day):
            _price_based_rebuy(p, prices, prev, day, weights, "V2_rebuy_recovery")

        # Rebuy 4 — Deploy-to-Target: once/day, if cash>1000, most under-weight by >5pp gets $500 tranche
        if p.cash > 1000 and not _regime_risk_off(prices, prev, day, p) and _macro_ok(prices, prev, day):
            eq_now = p.equity(prices)
            under = {}
            for s in SYMBOLS:
                target_usd = eq_now * weights[s]
                current_usd = p.qty[s] * prices[s]
                gap = target_usd - current_usd
                if gap > eq_now * 0.05:  # >5pp under
                    under[s] = gap
            if under:
                top = max(under, key=under.get)
                spend = min(500.0, p.cash - 200, under[top])
                if spend > 100:
                    p.buy_usd(top, spend, prices[top], "rebuy4_deploy_target")

    return strategy


# ----------------- V3 (proposed: regime-exit, re-entry ladder, re-anchored rebuy, no sentiment) -----------------
def make_v3(weights: dict[str, float], capital: float, macro_gate: bool = False,
            ladder_fraction: float = 0.20) -> Callable:
    """V2 + four fixes:
      #1 regime-exit signal — clear risk_off early when BTC reclaims its 50d SMA with positive 7d momentum
      #2 re-entry ladder — replace $500 deploy with trend-filtered DCA: 20% of cash/run across all
         underweight assets above their 20d SMA (couples re-entry to trend, redeploys in ~5-10 runs)
      #3 re-anchored rebuy — re-enter on recovery off the LOW SINCE EXIT, not the old sell price
      #4 S5 removed (sentiment strategies killed; LunarCrush permanently paywalled)
    """
    REENTER_RECOVERY = 0.12   # #3: recovery off low-since-exit to re-enter
    LADDER_FRACTION = ladder_fraction  # #2: deploy this fraction of cash per run
    UNDER_GATE = 0.05         # >5pp under target to qualify for deploy

    def _macro_ok(prices: pd.Series, prev: pd.DataFrame, day: int) -> bool:
        # Macro trend gate: only re-enter when BTC is above its 200d SMA (confirmed uptrend)
        if not macro_gate:
            return True
        if day < 200:
            return False
        return prices["BTC"] > prev.iloc[day - 200:day]["BTC"].mean()

    def _sma(prev: pd.DataFrame, day: int, s: str, n: int) -> float:
        lo = max(0, day - n)
        window = prev.iloc[lo:day][s]
        return window.mean() if len(window) else prev.iloc[day][s]

    def _health_score(s: str, prices: pd.Series, prev: pd.DataFrame, day: int, p: Portfolio) -> float:
        if day < 7:
            return 1.0
        mom7 = prices[s] / prev.iloc[day - 7][s] - 1
        eq_now = p.equity(prices)
        target_usd = eq_now * weights[s]
        current_usd = p.qty[s] * prices[s]
        under = max(0.0, (target_usd - current_usd) / max(target_usd, 1))
        return max((1 + max(mom7, -0.5)) * (0.5 + under), 0.01)

    def _regime_risk_off(prices: pd.Series, prev: pd.DataFrame, day: int, p: Portfolio) -> bool:
        if day <= p.risk_off_until_day:
            # #1 regime-exit: leave risk_off early if BTC reclaims 50d SMA w/ positive 7d momentum
            if day >= 50:
                btc_50 = prev.iloc[day - 50:day]["BTC"].mean()
                btc_7d = prices["BTC"] / prev.iloc[day - 7]["BTC"] - 1 if day >= 7 else 0.0
                if prices["BTC"] > btc_50 and btc_7d > 0:
                    p.risk_off_until_day = day  # clear early
                    return False
            return True
        recent_s2 = [d for d in p.s2_fire_days if d >= day - 14]
        if len(recent_s2) >= 3:
            p.risk_off_until_day = day + 30
            return True
        if day >= 200:
            btc_200 = prev.iloc[day - 200:day]["BTC"].mean()
            drawdown = p.equity(prices) / p.portfolio_peak - 1 if p.portfolio_peak > 0 else 0
            if prices["BTC"] < btc_200 and drawdown <= -0.10:
                return True
        return False

    def _rotate_proceeds(proceeds: float, sold: str, prices: pd.Series, prev: pd.DataFrame,
                         day: int, p: Portfolio) -> None:
        if proceeds <= 0 or _regime_risk_off(prices, prev, day, p):
            return
        candidates = [s for s in SYMBOLS if s != sold]
        scores = {s: _health_score(s, prices, prev, day, p) for s in candidates}
        healthy = {s: sc for s, sc in scores.items()
                   if p.trail_high[s] == 0 or prices[s] / p.trail_high[s] - 1 > -TRAIL_PCT[s]}
        if not healthy:
            return
        total = sum(healthy.values())
        for s, sc in healthy.items():
            share = proceeds * sc / total
            if share > 25:
                p.buy_usd(s, share, prices[s], "rotation_buy")

    def _reanchored_rebuy(prices: pd.Series, prev: pd.DataFrame, day: int, p: Portfolio) -> None:
        if day < 7 or p.cash < 200 or not _macro_ok(prices, prev, day):
            return
        eq = p.equity(prices)
        for s in list(p.sell_prices.keys()):
            if p.qty[s] > 0:
                continue
            low = p.low_since_sell.get(s, p.sell_prices[s])
            if low <= 0:
                continue
            recovery = prices[s] / low - 1
            mom7 = prices[s] / prev.iloc[day - 7][s] - 1
            if recovery > REENTER_RECOVERY and mom7 > 0:
                spend = min(eq * weights[s] * 0.5, p.cash * 0.5)
                if spend > 50:
                    p.buy_usd(s, spend, prices[s], "V3_rebuy_offlow")
                    p.sell_prices.pop(s, None)
                    p.low_since_sell.pop(s, None)

    def _ladder_deploy(prices: pd.Series, prev: pd.DataFrame, day: int, p: Portfolio) -> None:
        if p.cash <= 1000 or _regime_risk_off(prices, prev, day, p) or not _macro_ok(prices, prev, day):
            return
        eq = p.equity(prices)
        qualifying: dict[str, float] = {}
        for s in SYMBOLS:
            gap = eq * weights[s] - p.qty[s] * prices[s]
            if gap > eq * UNDER_GATE and prices[s] > _sma(prev, day, s, 20):  # trend filter
                qualifying[s] = gap
        if not qualifying:
            return
        budget = min(p.cash * LADDER_FRACTION, sum(qualifying.values()), p.cash - 200)
        total_gap = sum(qualifying.values())
        for s, gap in qualifying.items():
            spend = budget * gap / total_gap
            if spend > 100:
                p.buy_usd(s, spend, prices[s], "V3_ladder_deploy")

    def strategy(day: int, prices: pd.Series, prev: pd.DataFrame, p: Portfolio) -> None:
        if day == 0:
            initial_deploy(p, prices, weights, capital)
            return

        eq = update_peaks(p, prices)

        # track running low for stopped-out assets (re-anchor reference)
        for s in SYMBOLS:
            if p.qty[s] == 0 and s in p.low_since_sell:
                p.low_since_sell[s] = min(p.low_since_sell[s], prices[s])

        # S1 — full portfolio stop to cash
        unrealized = p.invested(prices) - sum(p.cost_basis[s] * p.qty[s] for s in SYMBOLS)
        if capital > 0 and unrealized / capital < -0.25:
            for s in SYMBOLS:
                if p.qty[s] > 0:
                    p.sell_pct(s, 1.0, prices[s], "S1_portfolio_stop")
            return

        # S6 — 24h breakdown → rotate
        if day >= 1:
            yday = prev.iloc[day - 1]
            for s in SYMBOLS:
                if p.qty[s] > 0 and yday[s] > 0 and prices[s] / yday[s] - 1 <= -0.20:
                    proc = p.sell_pct(s, 1.0, prices[s], "S6_tech_breakdown")
                    _rotate_proceeds(proc, s, prices, prev, day, p)

        # S2 — trailing stop → rotate (or cash if risk-off)
        for s in SYMBOLS:
            if p.qty[s] > 0 and p.trail_high[s] > 0 and prices[s] / p.trail_high[s] - 1 <= -TRAIL_PCT[s]:
                proc = p.sell_pct(s, 1.0, prices[s], "S2_trailing_stop")
                p.s2_fire_days.append(day)
                _rotate_proceeds(proc, s, prices, prev, day, p)

        # S4 — portfolio drawdown, once per event, to cash
        if p.portfolio_peak > 0 and eq / p.portfolio_peak - 1 <= -0.15 and p.s4_armed:
            for s in SYMBOLS:
                if p.qty[s] > 0:
                    p.sell_pct(s, 0.25, prices[s], "S4_portfolio_drawdown")
            p.s4_armed = False
            p.last_s4_peak = p.portfolio_peak

        # (S5 removed — sentiment strategies killed)

        # Re-entry: re-anchored rebuy, then trend-filtered ladder deploy
        _reanchored_rebuy(prices, prev, day, p)
        _ladder_deploy(prices, prev, day, p)

    return strategy


# ----------------- simulator -----------------
def simulate(prices: pd.DataFrame, strategy_fn: Callable, capital: float, name: str) -> dict:
    p = Portfolio(cash=0.0)
    equity_curve = []
    for day in range(len(prices)):
        today = prices.iloc[day]
        strategy_fn(day, today, prices, p)
        equity_curve.append(p.equity(today))
    eq = pd.Series(equity_curve, index=prices.index)
    daily_ret = eq.pct_change().dropna()
    total_return = eq.iloc[-1] / capital - 1
    peak = eq.cummax()
    dd_series = eq / peak - 1
    drawdown = dd_series.min()
    dd_date = dd_series.idxmin()
    sharpe = (daily_ret.mean() / daily_ret.std() * np.sqrt(365)) if daily_ret.std() > 0 else 0
    return {
        "name": name,
        "final_equity": eq.iloc[-1],
        "total_return_pct": total_return * 100,
        "max_drawdown_pct": drawdown * 100,
        "max_drawdown_date": dd_date,
        "sharpe": sharpe,
        "n_trades": p.trades,
        "trades_by_strategy": p.trades_by_strategy,
        "equity_curve": eq,
        "final_cash": p.cash,
        "final_positions": {s: p.qty[s] * prices.iloc[-1][s] for s in SYMBOLS},
    }
