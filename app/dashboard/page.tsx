'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import MotionSection from '@/app/components/MotionSection';
import DonutChart from './DonutChart';

/* ── types ────────────────────────────────────────────── */

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
  cash_pct: number;
  largest_position: string;
  largest_position_pct: number;
  positions_in_profit: number;
  positions_in_loss: number;
  total_unrealized_pl: number;
  avax_remaining_pct?: number;
  avax_trimmed_proceeds?: number;
}

interface Snapshot {
  snapshot_time: string;
  total_nav: number;
  cash_balance: number;
  invested_value: number;
  total_return_pct: number;
  positions: Record<string, PositionData>;
  risk_metrics: RiskMetrics;
}

interface Trade {
  symbol: string;
  action: string;
  strategy: string;
  quantity: number;
  price: number;
  pct_of_position: number;
  reason_detail: string;
  created_at: string;
}

/* ── crypto branding ──────────────────────────────────── */

const CRYPTO_META: Record<string, { color: string; icon: string; name: string }> = {
  'BTC/USD': { color: '#f7931a', icon: '₿', name: 'Bitcoin' },
  'ETH/USD': { color: '#627eea', icon: 'Ξ', name: 'Ethereum' },
  'SOL/USD': { color: '#9945ff', icon: '◎', name: 'Solana' },
  'DOGE/USD': { color: '#c2a633', icon: 'Ð', name: 'Dogecoin' },
  'LINK/USD': { color: '#2a5ada', icon: '⬡', name: 'Chainlink' },
  'AVAX/USD': { color: '#e84142', icon: '▲', name: 'Avalanche' },
};

const SYMBOL_ORDER = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'DOGE/USD', 'LINK/USD', 'AVAX/USD'];

/* ── helpers ──────────────────────────────────────────── */

function fmt(n: number, decimals = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtUsd(n: number, decimals = 2): string {
  return '$' + fmt(n, decimals);
}

function fmtPct(n: number): string {
  const sign = n >= 0 ? '+' : '';
  return sign + fmt(n, 2) + '%';
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatTradeDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/* ── data fetching ────────────────────────────────────── */

const SUPABASE_URL = 'https://opnsoprahgrfwjiwyvnn.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wbnNvcHJhaGdyZndqaXd5dm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNDU3OTMsImV4cCI6MjA4NzgyMTc5M30.bgdtICI9bbfvLEsVPQkoWPY9JIgfNxT2vVt2Gl-VQEs';

async function fetchSnapshot(): Promise<Snapshot | null> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/strategy_snapshots?select=snapshot_time,total_nav,cash_balance,invested_value,total_return_pct,positions,risk_metrics&order=snapshot_time.desc&limit=1`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: 'no-store',
    }
  );
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;
  const row = data[0];
  return {
    ...row,
    total_nav: Number(row.total_nav),
    cash_balance: Number(row.cash_balance),
    invested_value: Number(row.invested_value),
    total_return_pct: Number(row.total_return_pct),
  };
}

async function fetchAvaxTrades(): Promise<Trade[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/crypto_trade_log?symbol=eq.AVAX/USD&action=eq.sell&select=symbol,action,strategy,quantity,price,pct_of_position,reason_detail,created_at&order=created_at.asc`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: 'no-store',
    }
  );
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data.map((t: Record<string, unknown>) => ({
    ...t,
    quantity: Number(t.quantity),
    price: Number(t.price),
    pct_of_position: Number(t.pct_of_position),
  })) as Trade[];
}

async function fetchAvaxEntryPrice(): Promise<number> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/crypto_position_baselines?symbol=eq.AVAX/USD&select=avg_entry_price&limit=1`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: 'no-store',
    }
  );
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return 9.07; // fallback
  return Number(data[0].avg_entry_price);
}

/* ── component ────────────────────────────────────────── */

export default function DashboardPage() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [avaxEntry, setAvaxEntry] = useState<number>(9.07);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [snap, avaxTrades, entryPrice] = await Promise.all([
        fetchSnapshot(),
        fetchAvaxTrades(),
        fetchAvaxEntryPrice(),
      ]);
      setSnapshot(snap);
      setTrades(avaxTrades);
      setAvaxEntry(entryPrice);
      setLoading(false);
      setLastRefresh(new Date());
    }
    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !snapshot) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-block w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-[var(--neutral-400)]">Loading dashboard...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!snapshot) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-[var(--neutral-400)]">
              No snapshot data available yet.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const positions = snapshot.positions;
  const risk = snapshot.risk_metrics;
  const sortedSymbols = SYMBOL_ORDER.filter((s) => s in positions);

  const donutSlices = [
    ...sortedSymbols.map((s) => ({
      key: s,
      pct: positions[s].weight_pct,
    })),
    { key: 'Cash', pct: risk.cash_pct },
  ];

  const totalTrimmedQty = trades.reduce((sum, t) => sum + t.quantity, 0);
  const totalTrimProceeds = trades.reduce((sum, t) => sum + t.quantity * t.price, 0);
  const totalTrimCostBasis = trades.reduce((sum, t) => sum + t.quantity * avaxEntry, 0);
  const totalTrimPnl = totalTrimProceeds - totalTrimCostBasis;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[var(--background)]">
        {/* ── Hero ──────────────────────────────────── */}
        <section className="relative pt-28 pb-12 px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-[var(--primary)] opacity-[0.04] rounded-full blur-3xl" />
            <div className="absolute top-40 right-1/4 w-80 h-80 bg-[var(--accent)] opacity-[0.03] rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto relative">
            <MotionSection>
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                  Paper Trading
                </span>
                <span className="text-xs text-[var(--neutral-500)]">
                  Updated {timeAgo(snapshot.snapshot_time)}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--neutral-50)] mb-2">
                AI Crypto Strategy Dashboard
              </h1>
              <p className="text-[var(--neutral-400)] text-base max-w-2xl">
                Sentiment-driven risk management on a $20K paper trading fund.
                6 crypto positions monitored 3&times; daily via Alpaca + LunarCrush.
              </p>
            </MotionSection>
          </div>
        </section>

        {/* ── Hero Stats ───────────────────────────── */}
        <section className="px-6 pb-10">
          <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Strategy NAV',
                value: fmtUsd(snapshot.total_nav),
                sub: `Started at $20,000`,
                accent: false,
              },
              {
                label: 'Total Return',
                value: fmtPct(snapshot.total_return_pct),
                sub: fmtUsd(snapshot.total_nav - 20000) + ' P&L',
                accent: snapshot.total_return_pct >= 0,
              },
              {
                label: 'Cash Balance',
                value: fmtUsd(snapshot.cash_balance),
                sub: `${fmt(risk.cash_pct)}% of fund`,
                accent: false,
              },
              {
                label: 'Invested',
                value: fmtUsd(snapshot.invested_value),
                sub: `${sortedSymbols.length} positions`,
                accent: false,
              },
            ].map((card, i) => (
              <MotionSection key={card.label} delay={0.05 * i}>
                <div className="bg-[var(--card-bg)] rounded-xl p-5 border border-[var(--neutral-700)] hover:border-[var(--neutral-600)] transition-colors">
                  <p className="text-xs text-[var(--neutral-400)] uppercase tracking-wider mb-1">
                    {card.label}
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      card.accent
                        ? 'text-emerald-400'
                        : 'text-[var(--neutral-50)]'
                    }`}
                  >
                    {card.value}
                  </p>
                  <p className="text-xs text-[var(--neutral-500)] mt-1">
                    {card.sub}
                  </p>
                </div>
              </MotionSection>
            ))}
          </div>
        </section>

        {/* ── Allocation + Risk ────────────────────── */}
        <section className="px-6 pb-10">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
            {/* Donut */}
            <MotionSection>
              <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--neutral-700)] flex flex-col items-center">
                <h2 className="text-sm font-semibold text-[var(--neutral-300)] uppercase tracking-wider mb-6 self-start">
                  Portfolio Allocation
                </h2>
                <DonutChart
                  slices={donutSlices}
                  centerLabel="Positions"
                  centerValue={String(sortedSymbols.length)}
                />
              </div>
            </MotionSection>

            {/* Risk Metrics */}
            <MotionSection delay={0.1}>
              <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--neutral-700)]">
                <h2 className="text-sm font-semibold text-[var(--neutral-300)] uppercase tracking-wider mb-5">
                  Risk Metrics
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      label: 'Unrealized P&L',
                      value: fmtUsd(risk.total_unrealized_pl),
                      color:
                        risk.total_unrealized_pl >= 0
                          ? 'text-emerald-400'
                          : 'text-red-400',
                    },
                    {
                      label: 'Largest Position',
                      value: `${CRYPTO_META[risk.largest_position]?.name || risk.largest_position} (${fmt(risk.largest_position_pct)}%)`,
                      color: 'text-[var(--neutral-50)]',
                    },
                    {
                      label: 'Positions in Profit',
                      value: `${risk.positions_in_profit} of ${risk.positions_in_profit + risk.positions_in_loss}`,
                      color: 'text-emerald-400',
                    },
                    {
                      label: 'Cash Reserve',
                      value: `${fmt(risk.cash_pct)}%`,
                      color: 'text-[var(--neutral-50)]',
                    },
                    ...(risk.avax_trimmed_proceeds
                      ? [
                          {
                            label: 'AVAX Trim Proceeds',
                            value: fmtUsd(risk.avax_trimmed_proceeds),
                            color: 'text-[var(--accent)]',
                          },
                          {
                            label: 'AVAX Remaining',
                            value: `${fmt(risk.avax_remaining_pct || 0)}% of original`,
                            color: 'text-[var(--neutral-50)]',
                          },
                        ]
                      : []),
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between items-center py-2 border-b border-[var(--neutral-700)]/50 last:border-0"
                    >
                      <span className="text-sm text-[var(--neutral-400)]">
                        {row.label}
                      </span>
                      <span className={`text-sm font-medium ${row.color}`}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </MotionSection>
          </div>
        </section>

        {/* ── Position Cards ───────────────────────── */}
        <section className="px-6 pb-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-sm font-semibold text-[var(--neutral-300)] uppercase tracking-wider mb-5">
              Positions
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedSymbols.map((symbol, i) => {
                const p = positions[symbol];
                const meta = CRYPTO_META[symbol];
                const isProfit = p.return_pct >= 0;
                const ticker = symbol.replace('/USD', '');

                return (
                  <MotionSection key={symbol} delay={0.04 * i}>
                    <div className="bg-[var(--card-bg)] rounded-xl p-5 border border-[var(--neutral-700)] hover:border-[var(--neutral-600)] transition-colors group">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold"
                            style={{
                              backgroundColor: meta.color + '18',
                              color: meta.color,
                            }}
                          >
                            {meta.icon}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-[var(--neutral-50)]">
                              {ticker}
                            </p>
                            <p className="text-xs text-[var(--neutral-500)]">
                              {meta.name}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-sm font-bold ${
                            isProfit ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {fmtPct(p.return_pct)}
                        </span>
                      </div>

                      {/* Stats grid */}
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                        <div>
                          <p className="text-[var(--neutral-500)]">Price</p>
                          <p className="text-[var(--neutral-100)] font-medium">
                            {p.current_price >= 1
                              ? fmtUsd(p.current_price)
                              : '$' + p.current_price.toFixed(4)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[var(--neutral-500)]">Value</p>
                          <p className="text-[var(--neutral-100)] font-medium">
                            {fmtUsd(p.market_value)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[var(--neutral-500)]">Cost Basis</p>
                          <p className="text-[var(--neutral-100)] font-medium">
                            {fmtUsd(p.cost_basis)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[var(--neutral-500)]">Weight</p>
                          <p className="text-[var(--neutral-100)] font-medium">
                            {fmt(p.weight_pct)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-[var(--neutral-500)]">
                            Unrealized P&L
                          </p>
                          <p
                            className={`font-medium ${
                              isProfit ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {fmtUsd(p.unrealized_pl)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[var(--neutral-500)]">Qty</p>
                          <p className="text-[var(--neutral-100)] font-medium">
                            {p.qty < 1 ? p.qty.toFixed(6) : fmt(p.qty, 2)}
                          </p>
                        </div>
                      </div>

                      {/* AVAX trim badge */}
                      {symbol === 'AVAX/USD' && risk.avax_remaining_pct != null && (
                        <div className="mt-3 pt-3 border-t border-[var(--neutral-700)]/50">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[var(--accent)]">
                              {fmt(100 - risk.avax_remaining_pct)}% trimmed
                            </span>
                            <span className="text-[var(--neutral-500)]">
                              {fmt(risk.avax_remaining_pct)}% remaining
                            </span>
                          </div>
                          <div className="mt-1.5 h-1.5 bg-[var(--neutral-700)] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${100 - (risk.avax_remaining_pct || 0)}%`,
                                backgroundColor: '#e84142',
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </MotionSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── AVAX Trim Timeline ───────────────────── */}
        {trades.length > 0 && (
          <section className="px-6 pb-16">
            <div className="max-w-6xl mx-auto">
              <MotionSection>
                <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--neutral-700)]">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <h2 className="text-sm font-semibold text-[var(--neutral-300)] uppercase tracking-wider">
                      AVAX Trim Timeline
                    </h2>
                    <div className="flex items-center gap-4 text-xs text-[var(--neutral-500)]">
                      <span>{trades.length} sells &middot; {fmt(totalTrimmedQty, 2)} units</span>
                      <span className="text-[var(--neutral-600)]">|</span>
                      <span>Entry: {fmtUsd(avaxEntry, 4)}</span>
                      <span className="text-[var(--neutral-600)]">|</span>
                      <span className={totalTrimPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        Net P&L: {fmtUsd(totalTrimPnl)}
                      </span>
                    </div>
                  </div>

                  <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-3 top-2 bottom-2 w-px bg-[var(--neutral-700)]" />

                    <div className="space-y-4">
                      {(() => {
                        let runningPnl = 0;
                        return trades.map((trade, i) => {
                          const tradePnl = (trade.price - avaxEntry) * trade.quantity;
                          runningPnl += tradePnl;
                          const isProfit = tradePnl >= 0;

                          return (
                            <div key={i} className="flex gap-4 relative">
                              {/* Dot */}
                              <div className="relative z-10 mt-1.5">
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                                  style={{
                                    backgroundColor: isProfit ? '#10b98118' : '#e8414218',
                                    color: isProfit ? '#10b981' : '#e84142',
                                  }}
                                >
                                  {i + 1}
                                </div>
                              </div>

                              {/* Content */}
                              <div className="flex-1 pb-1">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                                  <span className="text-sm font-medium text-[var(--neutral-100)]">
                                    Sold {fmt(trade.quantity, 2)} AVAX @{' '}
                                    {fmtUsd(trade.price, 4)}
                                  </span>
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                                    {trade.strategy.replace(/_/g, ' ')}
                                  </span>
                                  <span
                                    className={`text-xs font-medium ${
                                      isProfit ? 'text-emerald-400' : 'text-red-400'
                                    }`}
                                  >
                                    {isProfit ? '+' : ''}{fmtUsd(tradePnl)}
                                  </span>
                                </div>
                                <p className="text-xs text-[var(--neutral-500)]">
                                  {formatTradeDate(trade.created_at)} &middot;{' '}
                                  {fmtUsd(trade.quantity * trade.price)} proceeds &middot;{' '}
                                  <span className={runningPnl >= 0 ? 'text-emerald-400/60' : 'text-red-400/60'}>
                                    cumulative: {runningPnl >= 0 ? '+' : ''}{fmtUsd(runningPnl)}
                                  </span>
                                </p>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>
              </MotionSection>
            </div>
          </section>
        )}

        {/* ── Strategy Overview ────────────────────── */}
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <MotionSection>
              <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--neutral-700)]">
                <h2 className="text-sm font-semibold text-[var(--neutral-300)] uppercase tracking-wider mb-5">
                  How It Works
                </h2>
                <div className="grid sm:grid-cols-3 gap-5">
                  {[
                    {
                      title: 'Monitor',
                      desc: 'An AI agent checks 6 crypto positions 3× daily against 7 sell strategies and 3 rebuy strategies using Alpaca + LunarCrush data.',
                      icon: '📡',
                    },
                    {
                      title: 'Execute',
                      desc: 'When sentiment collapses, narratives shift, or trailing stops trigger, the agent trims positions automatically — protecting capital.',
                      icon: '⚡',
                    },
                    {
                      title: 'Report',
                      desc: 'Every run logs trades and snapshots to Supabase. This dashboard reads the latest data directly — what you see is the real state.',
                      icon: '📊',
                    },
                  ].map((item) => (
                    <div key={item.title} className="text-center">
                      <span className="text-2xl mb-2 block">{item.icon}</span>
                      <h3 className="text-sm font-semibold text-[var(--neutral-50)] mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[var(--neutral-400)] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </MotionSection>
          </div>
        </section>

        {/* ── Footer line ──────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <p className="text-xs text-[var(--neutral-600)] text-center">
            Data refreshes every 5 minutes. Strategy runs 3× daily (8AM, 1PM, 7PM
            ET). Paper trading on Alpaca — not financial advice.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
