'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
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

const BACKTEST = [
  { name: 'HODL (target weights)', return_pct: -2.3,  drawdown_pct: -60.7, sharpe: 0.28, trades: 6,  note: 'Crypto had a tough 12-month window. Buy-and-hold lost 2% with a brutal 60% drawdown mid-cycle.' },
  { name: 'V1 rules (original)',    return_pct: 27.8, drawdown_pct: -12.7, sharpe: 1.07, trades: 38, note: 'Trailing stops preserved capital, but the strategy dumped to cash and couldn\u2019t opportunistically redeploy.' },
  { name: 'V2 rules (live)',         return_pct: 35.2, drawdown_pct: -13.4, sharpe: 1.28, trades: 81, note: 'Rotation-on-sell + contagion regime gate + deploy-to-target. Highest return, best Sharpe, same drawdown as V1.' },
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

// ---------- formatters ----------

const fmtMoney = (v: number | undefined | null, digits = 0) =>
  v == null ? '—' : `$${v.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;

const fmtPct = (v: number | undefined | null, digits = 2) =>
  v == null ? '—' : `${v >= 0 ? '+' : ''}${v.toFixed(digits)}%`;

const fmtPrice = (v: number) => {
  if (v >= 1000) return `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  if (v >= 1)    return `$${v.toFixed(2)}`;
  return `$${v.toFixed(4)}`;
};

const timeAgo = (iso: string) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// ---------- hook ----------

function useDashboardData() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [regime, setRegime] = useState<RegimeState | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sb = createSupabaseBrowser();

    Promise.all([
      sb.from('strategy_snapshots')
        .select('*')
        .eq('strategy_version', 2)
        .order('snapshot_time', { ascending: false })
        .limit(1),
      sb.from('strategy_regime_state')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1),
      sb.from('dashboard_trades_v2')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20),
      sb.from('strategy_snapshots')
        .select('snapshot_time, total_nav, total_return_pct')
        .eq('strategy_version', 2)
        .order('snapshot_time', { ascending: true })
        .limit(200),
    ])
      .then(([snap, reg, tr, hist]) => {
        if (snap.data?.[0]) setSnapshot(snap.data[0] as Snapshot);
        if (reg.data?.[0]) setRegime(reg.data[0] as RegimeState);
        if (tr.data) setTrades(tr.data as Trade[]);
        if (hist.data) setHistory(hist.data as Snapshot[]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { snapshot, regime, trades, history, loading, error };
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
    s.includes('stop') || s.includes('breakdown') || s.includes('collapse') ? 'bg-red-500/15 text-red-300 border-red-500/30' :
    s.includes('rotation') ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' :
    s.includes('deploy') || s.includes('rebuy') ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
    s.includes('drawdown') ? 'bg-orange-500/15 text-orange-300 border-orange-500/30' :
    'bg-[var(--neutral-700)] text-[var(--neutral-200)] border-[var(--neutral-600)]';
  return <span className={`inline-block text-[10px] px-2 py-0.5 rounded border font-mono ${color}`}>{strategy}</span>;
}

// ---------- main ----------

export default function DashboardPage() {
  const { snapshot, regime, trades, history, loading, error } = useDashboardData();

  const positionCards = useMemo(() => {
    if (!snapshot) return [] as { symbol: string; data: PositionData }[];
    return DISPLAY_ORDER
      .filter((s) => snapshot.positions[s])
      .map((symbol) => ({ symbol, data: snapshot.positions[symbol] }));
  }, [snapshot]);

  const curvePoints = useMemo(
    () => history.map((h, i) => ({ x: i, y: Number(h.total_nav) })),
    [history]
  );

  const regimeBadge = regime?.mode === 'risk_off'
    ? { label: 'Risk-off', color: 'text-red-300 bg-red-500/15 border-red-500/30', icon: '●' }
    : { label: 'Normal', color: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30', icon: '●' };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[var(--background)]">

        {/* Header */}
        <section className="pt-32 pb-10 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border border-[var(--primary)]/40 bg-[var(--primary)]/10 text-[var(--primary-light)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                Strategy v2 · Live
              </span>
              <a
                href="https://www.brettchereskin.com/shared/crypto-dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono uppercase tracking-widest text-[var(--neutral-500)] hover:text-[var(--neutral-300)] transition-colors underline decoration-dotted underline-offset-4"
              >
                v1 dashboard (deprecated)
              </a>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[var(--neutral-50)] leading-[1.15] animate-fade-in-up">
              AI Crypto Strategy
              <span className="gradient-text"> · Live Portfolio</span>
            </h1>
            <p className="mt-4 text-[var(--neutral-300)] animate-fade-in-up delay-100">
              Rule-based crypto portfolio with rotation-on-sell, a contagion regime gate, and daily deploy-to-target rebuys. Rebuilt from the ground up after backtesting exposed flaws in v1.{' '}
              <Link href="/blog/crypto-strategy-v2-overhaul" className="text-[var(--primary)] hover:text-[var(--primary-light)] underline decoration-dotted underline-offset-4">
                Read the build notes →
              </Link>
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
            <div className="max-w-6xl mx-auto p-6 rounded-xl border border-red-500/30 bg-red-500/5 text-red-300 text-sm">
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
                  sub={`Updated ${timeAgo(snapshot.snapshot_time)}`}
                />
                <KpiCard
                  label="Return (v2)"
                  value={fmtPct(snapshot.total_return_pct)}
                  sub={`Since ${new Date(snapshot.snapshot_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                  accent={snapshot.total_return_pct >= 0 ? 'text-[var(--primary-light)]' : 'text-[var(--accent)]'}
                />
                <KpiCard
                  label="Deployed"
                  value={fmtPct(100 - (snapshot.risk_metrics?.cash_pct ?? 0), 1)}
                  sub={`${fmtMoney(snapshot.cash_balance)} cash reserve`}
                />
                <KpiCard
                  label="Regime"
                  value={regimeBadge.label}
                  sub={regime?.triggered_by ? `Triggered by ${regime.triggered_by}` : 'No triggers · all clear'}
                  accent={regime?.mode === 'risk_off' ? 'text-red-300' : 'text-emerald-300'}
                />
              </div>
            </section>

            {/* Positions */}
            <section className="px-6 pb-6">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-sm uppercase tracking-widest text-[var(--neutral-400)] font-mono mb-4">Positions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {positionCards.map(({ symbol, data }) => {
                    const sym = symbol.split('/')[0];
                    const color = ASSET_COLOR[symbol];
                    const target = (TARGET_WEIGHT[symbol] ?? 0) * 100;
                    return (
                      <div key={symbol} className="rounded-xl border border-[var(--neutral-700)] bg-[var(--card-bg)] p-5 hover-lift">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                            <span className="font-bold text-[var(--neutral-50)] text-lg">{sym}</span>
                          </div>
                          <span className={`text-sm font-mono ${data.return_pct >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                            {fmtPct(data.return_pct)}
                          </span>
                        </div>
                        <div className="mt-3 flex items-baseline justify-between">
                          <span className="text-2xl font-bold text-[var(--neutral-50)]">{fmtMoney(data.market_value)}</span>
                          <span className="text-xs text-[var(--neutral-400)] font-mono">{fmtPrice(data.current_price)}</span>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[var(--neutral-500)] mb-1.5">
                            <span>Weight {data.weight_pct?.toFixed(1)}%</span>
                            <span>Target {target.toFixed(0)}%</span>
                          </div>
                          <WeightBar actual={data.weight_pct ?? 0} target={target} color={color} />
                        </div>
                        <div className="mt-3 pt-3 border-t border-[var(--neutral-700)] flex items-center justify-between text-xs text-[var(--neutral-400)]">
                          <span>Qty {data.qty.toLocaleString('en-US', { maximumFractionDigits: 4 })}</span>
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
                      <span className="text-emerald-300">{snapshot.risk_metrics?.positions_in_profit ?? 0}</span>
                      {' / '}
                      <span className="text-red-300">{snapshot.risk_metrics?.positions_in_loss ?? 0}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--neutral-500)] mb-1">Unrealized P&L</div>
                    <div className={`text-lg font-mono ${(snapshot.risk_metrics?.total_unrealized_pl ?? 0) >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                      {fmtMoney(snapshot.risk_metrics?.total_unrealized_pl)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--neutral-500)] mb-1">Largest position</div>
                    <div className="text-lg text-[var(--neutral-50)] font-mono">
                      {snapshot.risk_metrics?.largest_position?.split('/')[0] ?? '—'}
                      <span className="text-[var(--neutral-400)] text-sm ml-1">
                        {snapshot.risk_metrics?.largest_position_pct?.toFixed(1)}%
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
              <span className="text-xs text-[var(--neutral-500)] font-mono">12-mo window · Apr 2025 → Apr 2026</span>
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
                  {BACKTEST.map((r) => (
                    <tr
                      key={r.name}
                      className={`border-b border-[var(--neutral-800)] last:border-0 ${r.name.includes('V2') ? 'bg-[var(--primary)]/5' : ''}`}
                    >
                      <td className="py-3 pr-4 text-[var(--neutral-100)] font-medium">{r.name}</td>
                      <td className={`py-3 px-3 text-right font-mono ${r.return_pct >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                        {fmtPct(r.return_pct, 1)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[var(--neutral-300)]">{fmtPct(r.drawdown_pct, 1)}</td>
                      <td className="py-3 px-3 text-right font-mono text-[var(--neutral-300)]">{r.sharpe.toFixed(2)}</td>
                      <td className="py-3 pl-3 text-right font-mono text-[var(--neutral-400)]">{r.trades}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 space-y-1.5 text-xs text-[var(--neutral-400)] leading-relaxed">
              {BACKTEST.map((r) => (
                <div key={r.name}>
                  <span className="font-semibold text-[var(--neutral-200)]">{r.name}:</span> {r.note}
                </div>
              ))}
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
                        <td className="py-2.5 pr-3 text-xs text-[var(--neutral-400)]">{timeAgo(t.created_at)}</td>
                        <td className="py-2.5 px-3 font-medium text-[var(--neutral-100)]">{t.symbol.split('/')[0]}</td>
                        <td className={`py-2.5 px-3 font-mono text-xs ${t.action === 'buy' ? 'text-emerald-300' : 'text-red-300'}`}>
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
            <div className="grid md:grid-cols-2 gap-6 text-sm text-[var(--neutral-300)] leading-relaxed">
              <div>
                <div className="text-[var(--primary-light)] font-semibold mb-1">Rotation on sells</div>
                <p>When a trailing stop, sentiment collapse, or technical breakdown fires, proceeds rotate into other assets scored by 7d momentum × under-allocation — not dumped to cash.</p>
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
                Runs 3× daily · 8AM, 1PM, 7PM ET · paper account
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
