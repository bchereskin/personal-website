import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '@/app/components/Nav';
import Footer from '@/app/components/Footer';
import CommentsSection from '@/app/components/CommentsSection';
import SubscribeToggle from '@/app/components/SubscribeToggle';
import { BlogContentRenderer } from '@/app/components/BlogRenderer';
import ShareButtons from '@/app/components/ShareButtons';
import RelatedPosts from '@/app/components/RelatedPosts';
import { getPostBySlug, getRelatedPosts, formatDate } from '../posts';
import { getAdminSupabase } from '@/app/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: 'Brett Chereskin', url: 'https://www.brettchereskin.com' }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['Brett Chereskin'],
      url: `https://www.brettchereskin.com/blog/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      creator: '@BChereskin',
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  getAdminSupabase().rpc('increment_blog_post_visits', { post_slug: slug }).then(() => {});
  const relatedPosts = await getRelatedPosts(slug, post.category);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: 'Brett Chereskin',
      url: 'https://www.brettchereskin.com',
      jobTitle: 'Chief Operating Officer',
      worksFor: { '@type': 'Organization', name: 'dub' },
    },
    publisher: {
      '@type': 'Person',
      name: 'Brett Chereskin',
      url: 'https://www.brettchereskin.com',
    },
    mainEntityOfPage: `https://www.brettchereskin.com/blog/${post.slug}`,
    articleSection: post.category,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Nav />
      <main className="bg-[var(--paper)] text-[var(--ink)]">
        <div className="max-w-[760px] mx-auto px-8 pt-16 pb-20">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-4)] hover:text-[var(--ink)] transition-colors mb-10"
          >
            ← Back to writing
          </Link>

          <header className="pb-8 border-b border-[var(--rule)] mb-10">
            <div className="flex justify-between items-baseline mb-4 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-4)]">
              <span>{post.category}</span>
              <span>
                {formatDate(post.date)} · {post.readTime}
              </span>
            </div>
            <h1 className="font-serif font-normal -tracking-[0.02em] leading-[1.05] text-[var(--ink)] m-0" style={{ fontSize: 'clamp(36px, 4.5vw, 56px)' }}>
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-6">
              <SubscribeToggle />
              <ShareButtons title={post.title} slug={post.slug} />
            </div>
          </header>

          <article>
            <BlogContentRenderer content={post.content} />

            <CommentsSection slug={slug} />

            <RelatedPosts posts={relatedPosts} />

            <div className="mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-4)] hover:text-[var(--ink)] transition-colors"
              >
                ← Back to all posts
              </Link>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
