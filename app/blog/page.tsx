import Nav from '@/app/components/Nav';
import Footer from '@/app/components/Footer';
import SectionHead from '@/app/components/SectionHead';
import Link from 'next/link';
import { getPublishedPosts, formatDate } from './posts';

export const dynamic = 'force-dynamic';

export default async function Blog() {
  const posts = await getPublishedPosts();

  return (
    <>
      <Nav />
      <main className="bg-[var(--paper)] text-[var(--ink)]">
        <div className="max-w-[760px] mx-auto px-8 pt-16">
          <header className="pb-10 border-b border-[var(--rule)]">
            <SectionHead label="Blog" title="All posts." />
            <p className="font-serif italic text-[20px] leading-[1.55] text-[var(--ink-3)] m-0 max-w-[600px]">
              Notes from running a fintech with AI — plus the occasional piece on investing and leadership.
            </p>
            <Link
              href="/lab"
              className="inline-flex items-center gap-2 mt-5 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-4)] hover:text-[var(--accent)] transition-colors"
            >
              Going deeper? Technical build logs live in The Lab →
            </Link>
          </header>

          <section className="pt-6 pb-14">
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
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
