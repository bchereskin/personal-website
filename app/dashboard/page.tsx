'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navigation from '@/app/components/Nav';
import Footer from '@/app/components/Footer';
import { createSupabaseBrowser } from '@/app/lib/supabase-browser';

// ---------- constants ----------

const ASSET_COLOR: Record<string, string> = {
  'BTC/USD':  '#f7931a',
  'ETH/USD':  '#627eea',
  'SOL/USD':  '#9945ff',
  'LINK/USD': '#2a5ada',
  'DOGE/USD': '#c2a633',
  'AVAX/USD': '#e84142',
};

const TARGET_WEIGHT: Record<string, number> = {
  'BTC/USD': 0.30, 'ETH/USD': 0.30, 'SOL/USD': 0.20,
  'LINK/USD': 0.10, 'DOGE/USD': 0.07, 'AVAX/USD': 0.03,
};

const DISPLAY_ORDER = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'LINK/USD', 'DOGE/USD', 'AVAX/USD'];

const V2_START_LABEL = 'Apr 17, 2026';

const REGIME_TRIGGER_LABEL: Record<string, string> = {
  classic: 'BTC below 200-day avg + drawdown',
  contagion: '3+ trailing stops in 14 days',
};

// Fallback only — the live numbers come from the backtest_results table,
// which backtest/run.py keeps in sync.
const BACKTEST_FALLBACK = [
  { name: 'HODL (target weights)', return_pct: -44.8, drawdown_pct: -65.5, sharpe: -0.69, trades: 6,  note: 'A brutal 12-month window for crypto. Buy-and-hold lost 45% with a 65% peak-to-trough drawdown.' },
  { name: 'V1 rules (original)',    return_pct: 15.4, drawdown_pct: -15.0, sharpe: 0.90, trades: 28, note: 'Trailing stops preserved capital, but the strategy dumped to cash and redeployed only on price recovery.' },
  { name: 'V2 ungated',             return_pct: -2.3, drawdown_pct: -27.3, sharpe: -0.02, trades: 94, note: 'Rotation-on-sell without a trend filter kept redeploying into the downtrend \u2014 activity without edge.' },
  { name: 'V2 + macro gate (live)',  return_pct: 16.7, drawdown_pct: -13.2, sharpe: 1.05, trades: 55, note: 'Only redeploys cash when BTC is above its 200-day average. Best return, lowest drawdown, best Sharpe \u2014 and held up across 400 bootstrapped market paths (~80% win-rate vs ungated). This is what runs live.' },
];

// ---------- types ----------

interface PositionData {
  qty: number;
  current_price: number;
  market_value: number;
  cost_basis: number;
  unrealized_pl: number;
  return_pct: number;
  weight_pct: number;
}

interface RiskMetrics {
  cash_pct?: number;
  largest_position?: string;
  largest_position_pct?: number;
  positions_in_profit?: number;
  positions_in_loss?: number;
  total_unrealized_pl?: number;
  regime_mode?: string;
  regime_triggered_by?: string | null;
  v2_start_nav?: number;
}

interface Snapshot {
  id: string;
  snapshot_time: string;
  total_nav: number;
  cash_balance: number;
  invested_value: number;
  total_return_pct: number;
  positions: Record<string, PositionData>;
  risk_metrics: RiskMetrics;
}

interface RegimeState {
  mode: string;
  triggered_by: string | null;
  portfolio_peak: number | null;
  expires_at: string | null;
  updated_at: string;
}

interface Trade {
  symbol: string;
  action: string;
  strategy: string;
  quantity: number;
  price: number;
  pct_of_position: number | null;
  reason_detail: string | null;
  created_at: string;
}

interface BacktestRow {
  name: string;
  return_pct: number;
  drawdown_pct: number;
  sharpe: number;
  trades: number;
  note: string | null;
  window_label: string;
}

// ---------- formatters ----------

const toNum = (v: unknown): number | null => {
  if (v == null) return null;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
};

const fmtMoney = (v: unknown, digits = 0) => {
  const n = toNum(v);
  return n == null ? '—' : `$${n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
};

const fmtPct = (v: unknown, digits = 2) => {
  const n = toNum(v);
  return n == null ? '—' : `${n >= 0 ? '+' : ''}${n.toFixed(digits)}%`;
};

const fmtPrice = (v: unknown) => {
  const n = toNum(v);
  if (n == null) return '—';
  if (n >= 1000) return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  if (n >= 1)    return `$${n.toFixed(2)}`;
  return `$${n.toFixed(4)}`;
};

const fmtNum = (v: unknown, digits = 1) => {
  const n = toNum(v);
  return n == null ? '—' : n.toFixed(digits);
};

const timeAgo = (iso: string, now: number) => {
  if (!now) return '';
  const diff = (now - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// A mount-stable clock so relative times don't call Date.now() during render
// (which React flags as impure). Ticks once a minute so "Updated 2m ago" stays live.
function useNow() {
  const [now, setNow] = useState(0);
  useEffect(() => {
    // Intentional: seed the clock on mount (client-only) and tick it every minute.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

// ---------- hook ----------

function useDashboardData() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [regime, setRegime] = useState<RegimeState | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [backtest, setBacktest] = useState<BacktestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sb = createSupabaseBrowser();

    Promise.all([
      sb.from('strategy_snapshots')
        .select('id, snapshot_time, total_nav, cash_balance, invested_value, total_return_pct, positions, risk_metrics')
        .eq('strategy_version', 2)
        .order('snapshot_time', { ascending: false })
        .limit(1),
      sb.from('strategy_regime_state')
        .select('mode, triggered_by, portfolio_peak, expires_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(1),
      sb.from('dashboard_trades_v2')
        .select('symbol, action, strategy, quantity, price, pct_of_position, reason_detail, created_at')
        .order('created_at', { ascending: false })
        .limit(20),
      sb.from('strategy_snapshots')
        .select('snapshot_time, total_nav, total_return_pct')
        .eq('strategy_version', 2)
        .order('snapshot_time', { ascending: false })
        .limit(200),
      sb.from('backtest_results')
        .select('name, return_pct, drawdown_pct, sharpe, trades, note, window_label')
        .order('display_order', { ascending: true }),
    ])
      .then(([snap, reg, tr, hist, bt]) => {
        if (snap.data?.[0]) setSnapshot(snap.data[0] as Snapshot);
        if (reg.data?.[0]) setRegime(reg.data[0] as RegimeState);
        if (tr.data) setTrades(tr.data as Trade[]);
        if (hist.data) setHistory((hist.data as Snapshot[]).slice().reverse());
        if (bt.data?.length) setBacktest(bt.data as BacktestRow[]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { snapshot, regime, trades, history, backtest, loading, error };
}

// ---------- small components ----------

function KpiCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-[var(--neutral-700)] bg-[var(--card-bg)] p-5">
      <div className="text-[10px] uppercase tracking-widest text-[var(--neutral-400)] font-medium">{label}</div>
      <div className={`mt-2 text-3xl font-bold ${accent ?? 'text-[var(--neutral-50)]'}`}>{value}</div>
      {sub && <div className="mt-1 text-xs text-[var(--neutral-400)]">{sub}</div>}
    </div>
  );
}

function WeightBar({ actual, target, color }: { actual: number; target: number; color: string }) {
  const maxDisplay = Math.max(actual, target) * 1.15 + 2;
  const actualPct = (actual / maxDisplay) * 100;
  const targetPct = (target / maxDisplay) * 100;
  return (
    <div className="relative h-2 w-full rounded-full bg-[var(--neutral-800)] overflow-visible">
      <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${actualPct}%`, background: color }} />
      <div
        className="absolute -top-0.5 h-3 w-0.5 bg-[var(--neutral-50)]"
        style={{ left: `${targetPct}%` }}
        title={`target ${target.toFixed(1)}%`}
      />
    </div>
  );
}

function EquityCurve({ points }: { points: { x: number; y: number }[] }) {
  if (points.length < 2) {
    return <div className="h-32 flex items-center justify-center text-xs text-[var(--neutral-500)]">Collecting data — equity curve appears after 2+ snapshots</div>;
  }
  const ys = points.map((p) => p.y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const range = maxY - minY || 1;
  const w = 800;
  const h = 160;
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p.y - minY) / range) * h * 0.85 - h * 0.075;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  const first = points[0].y;
  const last = points[points.length - 1].y;
  const up = last >= first;
  const color = up ? 'var(--primary)' : 'var(--accent)';
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-32">
      <defs>
        <linearGradient id="eqFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${w},${h} L0,${h} Z`} fill="url(#eqFill)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function StrategyPill({ strategy }: { strategy: string }) {
  const s = strategy.toLowerCase();
  const color =
    s.includes('stop') || s.includes('breakdown') || s.includes('collapse') ? 'bg-red-500/15 text-red-700 border-red-500/30' :
    s.includes('rotation') ? 'bg-amber-500/15 text-amber-700 border-amber-500/30' :
    s.includes('deploy') || s.includes('rebuy') ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30' :
    s.includes('drawdown') ? 'bg-orange-500/15 text-orange-700 border-orange-500/30' :
    'bg-[var(--neutral-700)] text-[var(--neutral-200)] border-[var(--neutral-600)]';
  return <span className={`inline-block text-[10px] px-2 py-0.5 rounded border font-mono ${color}`}>{strategy}</span>;
}

// ---------- main ----------

export default function DashboardPage() {
  const { snapshot, regime, trades, history, backtest, loading, error } = useDashboardData();
  const now = useNow();

  const backtestRows: BacktestRow[] = backtest.length ? backtest : (BACKTEST_FALLBACK as BacktestRow[]);
  const backtestWindow = backtest[0]?.window_label || '12-mo window · Jun 2025 → Jun 2026';

  // An expired risk-off means the strategy trades normally on its next run —
  // don't display a stale red badge in the meantime.
  const regimeExpired =
    regime?.mode === 'risk_off' &&
    !!regime.expires_at &&
    !!now &&
    new Date(regime.expires_at).getTime() < now;
  const regimeIsRiskOff = regime?.mode === 'risk_off' && !regimeExpired;

  const positionCards = useMemo(() => {
    if (!snapshot?.positions) return [] as { symbol: string; data: PositionData }[];
    return DISPLAY_ORDER
      .map((symbol) => {
        const data = snapshot.positions[symbol] ?? snapshot.positions[symbol.split('/')[0]];
        return data ? { symbol, data } : null;
      })
      .filter((x): x is { symbol: string; data: PositionData } => x !== null);
  }, [snapshot]);

  const curvePoints = useMemo(
    () => history.map((h, i) => ({ x: i, y: Number(h.total_nav) })),
    [history]
  );

  const regimeBadge = regimeIsRiskOff
    ? { label: 'Risk-off', color: 'text-red-700 bg-red-500/15 border-red-500/30', icon: '●' }
    : { label: 'Normal', color: 'text-emerald-700 bg-emerald-500/15 border-emerald-500/30', icon: '●' };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[var(--background)]">

        {/* Header */}
        <section className="pt-16 pb-10 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center gap-4 mb-5">
              <Link
                href="/lab"
                className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-4)] hover:text-[var(--ink)] transition-colors"
              >
                ← The Lab
              </Link>
              <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase px-3 py-1 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/5 text-[var(--accent)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                Strategy v2 · Live · paper account
              </span>
            </div>

            <h1
              className="font-serif font-normal -tracking-[0.02em] leading-[1.05] text-[var(--ink)] m-0"
              style={{ fontSize: 'clamp(34px, 4.5vw, 52px)' }}
            >
              AI Crypto Strategy
            </h1>
            <p className="mt-4 font-serif italic text-[19px] leading-[1.6] text-[var(--ink-3)] max-w-[680px]">
              A rule-based crypto portfolio with one load-bearing rule: cash only goes back to work
              when Bitcoin is above its 200-day moving average. Read the{' '}
              <Link href="/blog/crypto-strategy-v2-overhaul" className="text-[var(--accent)] underline underline-offset-4 decoration-[var(--accent)]/40 hover:decoration-[var(--accent)]">
                build notes
              </Link>{' '}
              and the{' '}
              <Link href="/blog/crypto-strategy-macro-gate-stress-test" className="text-[var(--accent)] underline underline-offset-4 decoration-[var(--accent)]/40 hover:decoration-[var(--accent)]">
                stress test
              </Link>{' '}
              behind it.
            </p>
          </div>
        </section>

        {/* Loading / error */}
        {loading && (
          <section className="px-6 pb-16">
            <div className="max-w-6xl mx-auto animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-28 rounded-xl bg-[var(--card-bg)] border border-[var(--neutral-700)]" />
                ))}
              </div>
            </div>
          </section>
        )}

        {error && (
          <section className="px-6 pb-16">
            <div className="max-w-6xl mx-auto p-6 rounded-xl border border-red-500/30 bg-red-500/5 text-red-700 text-sm">
              Failed to load dashboard data: {error}
            </div>
          </section>
        )}

        {/* KPIs */}
        {!loading && !error && snapshot && (
          <>
            <section className="px-6 pb-6">
              <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard
                  label="Strategy NAV"
                  value={fmtMoney(snapshot.total_nav)}
                  sub={`Updated ${timeAgo(snapshot.snapshot_time, now)}`}
                />
                <KpiCard
                  label="Return (v2)"
                  value={fmtPct(snapshot.total_return_pct)}
                  sub={`Since v2 launch · ${V2_START_LABEL}`}
                  accent={snapshot.total_return_pct >= 0 ? 'text-emerald-700' : 'text-red-700'}
                />
                <KpiCard
                  label="Deployed"
                  value={fmtPct(100 - (snapshot.risk_metrics?.cash_pct ?? 0), 1)}
                  sub={`${fmtMoney(snapshot.cash_balance)} cash reserve`}
                />
                <KpiCard
                  label="Regime"
                  value={regimeBadge.label}
                  sub={
                    regimeExpired
                      ? 'Risk-off expired · awaiting next run'
                      : regimeIsRiskOff && regime?.triggered_by
                        ? (REGIME_TRIGGER_LABEL[regime.triggered_by] ?? `Triggered by ${regime.triggered_by}`)
                        : 'No triggers · all clear'
                  }
                  accent={regimeIsRiskOff ? 'text-red-700' : 'text-emerald-700'}
                />
              </div>
            </section>

            {/* Positions */}
            <section className="px-6 pb-6">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-sm uppercase tracking-widest text-[var(--neutral-400)] font-mono mb-4">Positions</h2>
                {positionCards.length === 0 && (
                  <div className="rounded-xl border border-[var(--rule)] bg-[var(--card-bg)] p-6">
                    <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--accent)] mb-2">
                      100% cash — by design
                    </div>
                    <p className="font-serif italic text-[17px] leading-[1.65] text-[var(--ink-2)] m-0 max-w-[640px]">
                      The macro gate is closed: Bitcoin is trading below its 200-day moving average,
                      so sell proceeds stay in cash and redeployment is paused. Sitting out downtrends
                      is where the strategy&apos;s edge comes from — positions return when BTC reclaims
                      the 200-day line.
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {positionCards.map(({ symbol, data }) => {
                    const sym = symbol.split('/')[0];
                    const color = ASSET_COLOR[symbol];
                    const target = (TARGET_WEIGHT[symbol] ?? 0) * 100;
                    // Tolerate both v1 (return_pct/weight_pct) and v2 (unrealized_plpc/target_weight_pct) schemas
                    const returnPct = toNum(data.return_pct ?? (data as unknown as Record<string, unknown>).unrealized_plpc) ?? 0;
                    const weightPct = toNum(data.weight_pct) ?? 0;
                    const qty = toNum(data.qty) ?? 0;
                    return (
                      <div key={symbol} className="rounded-xl border border-[var(--neutral-700)] bg-[var(--card-bg)] p-5 hover-lift">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                            <span className="font-bold text-[var(--neutral-50)] text-lg">{sym}</span>
                          </div>
                          <span className={`text-sm font-mono ${returnPct >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                            {fmtPct(returnPct)}
                          </span>
                        </div>
                        <div className="mt-3 flex items-baseline justify-between">
                          <span className="text-2xl font-bold text-[var(--neutral-50)]">{fmtMoney(data.market_value)}</span>
                          <span className="text-xs text-[var(--neutral-400)] font-mono">{fmtPrice(data.current_price)}</span>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[var(--neutral-500)] mb-1.5">
                            <span>Weight {fmtNum(weightPct)}%</span>
                            <span>Target {target.toFixed(0)}%</span>
                          </div>
                          <WeightBar actual={weightPct} target={target} color={color} />
                        </div>
                        <div className="mt-3 pt-3 border-t border-[var(--neutral-700)] flex items-center justify-between text-xs text-[var(--neutral-400)]">
                          <span>Qty {qty.toLocaleString('en-US', { maximumFractionDigits: 4 })}</span>
                          <span>Cost {fmtMoney(data.cost_basis)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Risk metrics strip */}
            <section className="px-6 pb-6">
              <div className="max-w-6xl mx-auto rounded-xl border border-[var(--neutral-700)] bg-[var(--card-bg)] p-5">
                <h2 className="text-sm uppercase tracking-widest text-[var(--neutral-400)] font-mono mb-4">Risk Metrics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-xs text-[var(--neutral-500)] mb-1">In profit</div>
                    <div className="text-lg text-[var(--neutral-50)] font-mono">
                      <span className="text-emerald-700">{snapshot.risk_metrics?.positions_in_profit ?? 0}</span>
                      {' / '}
                      <span className="text-red-700">{snapshot.risk_metrics?.positions_in_loss ?? 0}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--neutral-500)] mb-1">Unrealized P&L</div>
                    <div className={`text-lg font-mono ${(snapshot.risk_metrics?.total_unrealized_pl ?? 0) >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                      {fmtMoney(snapshot.risk_metrics?.total_unrealized_pl)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--neutral-500)] mb-1">Largest position</div>
                    <div className="text-lg text-[var(--neutral-50)] font-mono">
                      {snapshot.risk_metrics?.largest_position?.split('/')[0] ?? '—'}
                      <span className="text-[var(--neutral-400)] text-sm ml-1">
                        {fmtNum(snapshot.risk_metrics?.largest_position_pct)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--neutral-500)] mb-1">v2 Start NAV</div>
                    <div className="text-lg text-[var(--neutral-50)] font-mono">
                      {fmtMoney(snapshot.risk_metrics?.v2_start_nav)}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Equity curve */}
            <section className="px-6 pb-6">
              <div className="max-w-6xl mx-auto rounded-xl border border-[var(--neutral-700)] bg-[var(--card-bg)] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm uppercase tracking-widest text-[var(--neutral-400)] font-mono">v2 Equity Curve</h2>
                  <span className="text-xs text-[var(--neutral-500)] font-mono">{history.length} snapshots</span>
                </div>
                <EquityCurve points={curvePoints} />
              </div>
            </section>
          </>
        )}

        {/* Backtest results — static */}
        <section className="px-6 pb-6">
          <div className="max-w-6xl mx-auto rounded-xl border border-[var(--neutral-700)] bg-[var(--card-bg)] p-5">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-sm uppercase tracking-widest text-[var(--neutral-400)] font-mono">Backtest Validation</h2>
              <span className="text-xs text-[var(--neutral-500)] font-mono">{backtestWindow}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-[var(--neutral-500)] border-b border-[var(--neutral-700)]">
                    <th className="text-left py-2 pr-4">Strategy</th>
                    <th className="text-right py-2 px-3">Return</th>
                    <th className="text-right py-2 px-3">Max DD</th>
                    <th className="text-right py-2 px-3">Sharpe</th>
                    <th className="text-right py-2 pl-3">Trades</th>
                  </tr>
                </thead>
                <tbody>
                  {backtestRows.map((r) => (
                    <tr
                      key={r.name}
                      className={`border-b border-[var(--neutral-800)] last:border-0 ${r.name.includes('live') ? 'bg-[var(--primary)]/5' : ''}`}
                    >
                      <td className="py-3 pr-4 text-[var(--neutral-100)] font-medium">{r.name}</td>
                      <td className={`py-3 px-3 text-right font-mono ${(toNum(r.return_pct) ?? 0) >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                        {fmtPct(r.return_pct, 1)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[var(--neutral-300)]">{fmtPct(r.drawdown_pct, 1)}</td>
                      <td className="py-3 px-3 text-right font-mono text-[var(--neutral-300)]">{fmtNum(r.sharpe, 2)}</td>
                      <td className="py-3 pl-3 text-right font-mono text-[var(--neutral-400)]">{r.trades}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 space-y-1.5 text-xs text-[var(--neutral-400)] leading-relaxed">
              {backtestRows.filter((r) => r.note).map((r) => (
                <div key={r.name}>
                  <span className="font-semibold text-[var(--neutral-200)]">{r.name}:</span> {r.note}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--neutral-800)] text-xs">
              <Link
                href="/blog/crypto-strategy-macro-gate-stress-test"
                className="text-[var(--accent)] underline underline-offset-4 decoration-[var(--accent)]/40 hover:decoration-[var(--accent)]"
              >
                How these numbers were validated — parameter sweeps and 400 Monte Carlo paths →
              </Link>
            </div>
          </div>
        </section>

        {/* Trade log */}
        {!loading && trades.length > 0 && (
          <section className="px-6 pb-6">
            <div className="max-w-6xl mx-auto rounded-xl border border-[var(--neutral-700)] bg-[var(--card-bg)] p-5">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-sm uppercase tracking-widest text-[var(--neutral-400)] font-mono">Recent Trades (v2)</h2>
                <span className="text-xs text-[var(--neutral-500)] font-mono">{trades.length} shown</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-wider text-[var(--neutral-500)] border-b border-[var(--neutral-700)]">
                      <th className="text-left py-2 pr-3">When</th>
                      <th className="text-left py-2 px-3">Asset</th>
                      <th className="text-left py-2 px-3">Side</th>
                      <th className="text-left py-2 px-3">Strategy</th>
                      <th className="text-right py-2 px-3">Qty</th>
                      <th className="text-right py-2 pl-3">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((t, i) => (
                      <tr key={`${t.created_at}-${t.symbol}-${i}`} className="border-b border-[var(--neutral-800)] last:border-0">
                        <td className="py-2.5 pr-3 text-xs text-[var(--neutral-400)]">{timeAgo(t.created_at, now)}</td>
                        <td className="py-2.5 px-3 font-medium text-[var(--neutral-100)]">{t.symbol.split('/')[0]}</td>
                        <td className={`py-2.5 px-3 font-mono text-xs ${t.action === 'buy' ? 'text-emerald-700' : 'text-red-700'}`}>
                          {t.action.toUpperCase()}
                        </td>
                        <td className="py-2.5 px-3"><StrategyPill strategy={t.strategy} /></td>
                        <td className="py-2.5 px-3 text-right font-mono text-[var(--neutral-300)] text-xs">
                          {Number(t.quantity).toLocaleString('en-US', { maximumFractionDigits: 4 })}
                        </td>
                        <td className="py-2.5 pl-3 text-right font-mono text-[var(--neutral-300)] text-xs">{fmtPrice(Number(t.price))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* How it works */}
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto rounded-xl border border-[var(--neutral-700)] bg-[var(--card-bg)] p-6">
            <h2 className="text-sm uppercase tracking-widest text-[var(--neutral-400)] font-mono mb-4">How v2 Works</h2>
            <div className="mb-6 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-4 text-sm text-[var(--neutral-300)] leading-relaxed">
              <div className="text-[var(--accent)] font-semibold mb-1">The macro gate — the rule that matters most</div>
              <p>Cash is only redeployed when Bitcoin trades above its 200-day moving average. Below the line, sells go to cash and stay there. In backtest, this single trend filter is the difference between +16.7% (gated) and -2.3% (ungated) — and it held up across 400 bootstrapped market paths.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-[var(--neutral-300)] leading-relaxed">
              <div>
                <div className="text-[var(--primary-light)] font-semibold mb-1">Rotation on sells</div>
                <p>When a trailing stop or technical breakdown fires, proceeds rotate into other assets scored by 7d momentum × under-allocation — not dumped to cash (unless the regime is risk-off).</p>
              </div>
              <div>
                <div className="text-[var(--primary-light)] font-semibold mb-1">Contagion regime gate</div>
                <p>3+ trailing-stop fires in 14 days flip the strategy to risk-off for 30 days: rotation pauses, proceeds go to cash, deploys pause. Caught the worst drawdown in backtest.</p>
              </div>
              <div>
                <div className="text-[var(--accent)] font-semibold mb-1">Deploy-to-target</div>
                <p>Idle cash gets tranched back in daily via Rebuy 4 — $500/day into whichever asset is most under-weight. No more 80%-cash sitting through recoveries.</p>
              </div>
              <div>
                <div className="text-[var(--accent)] font-semibold mb-1">Learning loop</div>
                <p>Every trade gets re-evaluated 7 days later against a counterfactual. Rolling per-strategy win rates surface in each monitor email — turn off rules that stop earning their keep.</p>
              </div>
            </div>
            <div className="mt-5 pt-5 border-t border-[var(--neutral-700)] flex items-center justify-between flex-wrap gap-3 text-xs">
              <div className="text-[var(--neutral-500)] font-mono">
                Runs 3× daily · 8AM, 1PM, 7PM ET · paper account ·{' '}
                <a
                  href="https://www.brettchereskin.com/shared/crypto-dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-dotted underline-offset-4 hover:text-[var(--ink)]"
                >
                  v1 dashboard (archived)
                </a>
              </div>
              <Link
                href="/blog/crypto-strategy-v2-overhaul"
                className="text-[var(--primary)] hover:text-[var(--primary-light)] font-medium transition-colors"
              >
                Read the full build notes →
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
