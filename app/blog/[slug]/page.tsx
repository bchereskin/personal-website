import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import CommentsSection from '@/app/components/CommentsSection';
import SubscribeToggle from '@/app/components/SubscribeToggle';
import { BlogContentRenderer } from '@/app/components/BlogRenderer';
import { getPostBySlug, formatDate } from '../posts';
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
      <Navigation />
      <main className="min-h-screen bg-[var(--background)]">

        {/* Hero */}
        <section className="relative pt-32 pb-16 px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=2070"
              alt="Writing"
              fill
              className="object-cover opacity-15"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-transparent to-[var(--background)]" />
          </div>

          <div className="max-w-3xl mx-auto relative z-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[var(--neutral-400)] hover:text-[var(--primary)] transition-colors mb-8 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>

            <div className="flex flex-wrap items-center gap-3 text-sm mb-5 animate-fade-in-up">
              <span className="bg-[var(--primary)]/20 text-[var(--primary)] px-3 py-1 rounded-full font-medium text-xs uppercase tracking-wide">
                {post.category}
              </span>
              <span className="font-mono text-xs text-[var(--neutral-500)]">{formatDate(post.date)}</span>
              <span className="text-[var(--neutral-600)]">/</span>
              <span className="font-mono text-xs text-[var(--neutral-500)]">{post.readTime}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[var(--neutral-50)] leading-[1.15] animate-fade-in-up delay-100">
              {post.title}
            </h1>

            <div className="mt-6 animate-fade-in-up delay-200">
              <SubscribeToggle />
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="px-6 pb-24">
          <article className="max-w-3xl mx-auto animate-fade-in-up delay-200 font-serif">

            <BlogContentRenderer content={post.content} />

            <CommentsSection slug={slug} />

            <div className="mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[var(--primary)] hover:opacity-80 transition-opacity text-sm font-sans font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to all posts
              </Link>
            </div>
          </article>
        </section>

      </main>
      <Footer />
    </>
  );
}
