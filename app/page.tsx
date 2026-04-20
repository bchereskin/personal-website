import Nav from '@/app/components/Nav';
import Footer from '@/app/components/Footer';
import SectionHead from '@/app/components/SectionHead';
import PhotoFrame from '@/app/components/PhotoFrame';
import PostRow from '@/app/components/PostRow';
import { getPublishedPosts } from '@/app/blog/posts';
import { formatDate } from '@/app/blog/posts';

export const dynamic = 'force-dynamic';

const LANES = [
  {
    n: '01',
    title: 'Operating.',
    body: 'COO of dub, a venture-backed consumer fintech. Ops, finance, HR and G&A — run lean with AI tooling I build in-house.',
  },
  {
    n: '02',
    title: 'Practicing.',
    body: 'I ship real AI systems in production at a regulated company. I write about what works, what breaks, and what I\u2019ve quietly retired.',
  },
  {
    n: '03',
    title: 'Investing.',
    body: 'Angel investor and LP. I back operators shipping with AI. Advisory work on ops, GTM, and AI adoption inside scaling companies.',
  },
];

export default async function Home() {
  const allPosts = await getPublishedPosts();
  const recent = allPosts.slice(0, 3).map((p) => ({
    slug: p.slug,
    category: p.category,
    date: formatDate(p.date),
    readTime: p.readTime,
    title: p.title,
    excerpt: p.excerpt,
  }));

  return (
    <>
      <Nav />
      <main className="bg-[var(--paper)] text-[var(--ink)]">
        <div className="max-w-[960px] mx-auto px-8 pt-16">
          {/* Hero */}
          <section className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-12 pb-16">
            <div>
              <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--accent)] mb-5">
                Fintech Operator · AI Practitioner · Angel Investor
              </div>
              <h1 className="font-serif font-normal -tracking-[0.02em] leading-[1.0] text-[var(--ink)] m-0" style={{ fontSize: 'var(--fs-display)' }}>
                Brett Chereskin
              </h1>
              <p className="font-serif italic text-[22px] leading-[1.55] text-[var(--ink-2)] max-w-[560px] mt-7">
                I&rsquo;m the COO of dub, a venture-backed consumer fintech. I run operations at the edge of what AI can do — shipping internal tools that replace entire functions — and angel invest in the founders doing the same. Earlier: twelve years in the Army, West Point &rsquo;06.
              </p>
              <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--ink-4)] mt-8">
                Currently: <span className="text-[var(--ink-2)]">COO at dub</span> · New York
              </div>
            </div>

            <div className="md:pt-2">
              <PhotoFrame src="/Headshot.jpeg" alt="Brett Chereskin" aspect="3/4" priority />
            </div>
          </section>

          {/* The work */}
          <section className="py-14 border-t border-[var(--rule)]">
            <SectionHead label="The work" title="Three lanes, concurrently." />
            <ol className="list-none p-0 m-0">
              {LANES.map((lane) => (
                <li
                  key={lane.n}
                  className="grid grid-cols-[60px_1fr] gap-6 py-5 border-t border-[var(--rule)] items-baseline"
                >
                  <div className="font-mono text-[11px] tracking-[0.14em] text-[var(--ink-4)]">
                    {lane.n}
                  </div>
                  <div>
                    <span className="font-serif font-semibold text-[var(--ink)] text-[20px] -tracking-[0.01em]">
                      {lane.title}
                    </span>{' '}
                    <span className="font-serif italic text-[var(--ink-3)] text-[18px] leading-[1.6]">
                      {lane.body}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Blog */}
          <section className="py-14 border-t border-[var(--rule)]">
            <SectionHead label="Blog" title="Recent posts." />
            <div>
              {recent.map((post) => (
                <PostRow key={post.slug} post={post} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
