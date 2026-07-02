import type { Metadata } from 'next';
import Nav from '@/app/components/Nav';
import Footer from '@/app/components/Footer';
import SectionHead from '@/app/components/SectionHead';
import Link from 'next/link';
import { getLabPosts, formatDate } from '../blog/posts';
import { getSupabase } from '@/app/lib/supabase';

interface StrategyStatus {
  deployed: boolean;
  positionCount: number;
  returnPct: number | null;
}

async function getStrategyStatus(): Promise<StrategyStatus | null> {
  try {
    const { data } = await getSupabase()
      .from('strategy_snapshots')
      .select('invested_value, total_return_pct, positions')
      .eq('strategy_version', 2)
      .order('snapshot_time', { ascending: false })
      .limit(1);
    const snap = data?.[0];
    if (!snap) return null;
    const invested = Number(snap.invested_value) || 0;
    return {
      deployed: invested > 0,
      positionCount: snap.positions ? Object.keys(snap.positions).length : 0,
      returnPct: Number.isFinite(Number(snap.total_return_pct)) ? Number(snap.total_return_pct) : null,
    };
  } catch {
    return null;
  }
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'The Lab',
  description:
    'Build-in-public engineering notes from Brett Chereskin — AI-driven trading systems, backtests, and the technical experiments behind the writing. Deeper and more technical than the main blog.',
  alternates: { types: { 'application/rss+xml': '/lab/feed.xml' } },
  openGraph: {
    title: 'The Lab — Brett Chereskin',
    description: 'Build-in-public engineering notes: AI trading systems, backtests, and technical experiments.',
    url: 'https://www.brettchereskin.com/lab',
  },
};

export default async function Lab() {
  const [posts, status] = await Promise.all([getLabPosts(), getStrategyStatus()]);

  const statusLine = !status
    ? 'Real-time NAV, positions, regime state, and the macro-gated backtest behind the strategy.'
    : status.deployed
      ? `Real-time NAV, positions, regime state, and the macro-gated backtest behind the strategy. Currently deployed across ${status.positionCount} position${status.positionCount === 1 ? '' : 's'}.`
      : 'Real-time NAV, positions, regime state, and the macro-gated backtest behind the strategy. Currently sitting in cash by design — see why.';

  return (
    <>
      <Nav />
      <main className="bg-[var(--paper)] text-[var(--ink)]">
        <div className="max-w-[760px] mx-auto px-8 pt-16">
          <header className="pb-10 border-b border-[var(--rule)]">
            <SectionHead label="The Lab" title="The Lab." />
            <p className="font-serif italic text-[20px] leading-[1.55] text-[var(--ink-3)] m-0 max-w-[620px]">
              The technical track — building in public. AI-driven trading systems, backtests,
              and the engineering experiments behind the writing. More code and charts than the{' '}
              <Link href="/blog" className="text-[var(--accent)] hover:underline">main blog</Link>;
              read it if you like seeing the wiring.
            </p>
          </header>

          {/* Live dashboard — the centerpiece of the technical track */}
          <section className="pt-8">
            <Link
              href="/dashboard"
              className="block rounded-xl border border-[var(--rule)] p-6 hover:border-[var(--ink-4)] transition-colors group"
            >
              <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-4)] mb-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                Live · updates 3× daily
              </div>
              <h2 className="font-serif text-[26px] font-normal m-0 mb-1.5 -tracking-[0.015em] leading-[1.15] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                AI Crypto Strategy — Live Dashboard
              </h2>
              <p className="font-serif italic text-[17px] leading-[1.6] text-[var(--ink-3)] m-0">
                {statusLine} →
              </p>
            </Link>
          </section>

          <section className="pt-10 pb-14">
            <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--ink-4)] mb-2">
              — Build logs
            </div>
            {posts.length === 0 && (
              <p className="font-serif italic text-[17px] text-[var(--ink-3)] py-7">
                No build logs published yet.
              </p>
            )}
            {posts.map((post) => (
              <article key={post.slug} className="py-7 border-b border-[var(--rule)]">
                <Link href={`/blog/${post.slug}`} className="block group">
                  <div className="flex justify-between items-baseline mb-2 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-4)]">
                    <span>{post.category}</span>
                    <span>
                      {formatDate(post.date)} · {post.readTime}
                    </span>
                  </div>
                  <h2 className="font-serif text-[30px] font-normal m-0 mb-2 -tracking-[0.015em] leading-[1.15] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                    {post.title}
                  </h2>
                  <p className="font-serif italic text-[17px] leading-[1.6] text-[var(--ink-3)] m-0">
                    {post.excerpt}
                  </p>
                </Link>
              </article>
            ))}

            <div className="pt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-4)] hover:text-[var(--ink)] transition-colors"
              >
                ← Back to the main blog
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
