import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { posts, getPostBySlug, formatDate } from '../posts';

export function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      url: `https://www.brettchereskin.com/blog/${post.slug}`,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
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

          <article className="max-w-3xl mx-auto relative z-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[var(--neutral-400)] hover:text-[var(--primary)] transition-colors mb-8 font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>

            <div className="flex items-center gap-4 text-sm text-[var(--neutral-500)] mb-4 animate-fade-in-up">
              <span className="bg-[var(--primary)]/20 text-[var(--primary)] px-3 py-1 rounded-full font-medium">
                {post.category}
              </span>
              <span>{formatDate(post.date)}</span>
              <span>{post.readTime}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[var(--neutral-50)] animate-fade-in-up delay-100">
              {post.title}
            </h1>
          </article>
        </section>

        {/* Content */}
        <section className="py-8 px-6 pb-20">
          <article className="max-w-3xl mx-auto">
            <div className="bg-[var(--card-bg)] rounded-2xl p-8 md:p-12 border border-[var(--neutral-700)] animate-fade-in-up delay-200">
              <div className="prose prose-lg max-w-none">
                {post.content.split('\n').map((paragraph, index) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return null;

                  // Helper to render inline bold text
                  const renderWithBold = (text: string) => {
                    const parts = text.split(/\*\*(.+?)\*\*/g);
                    return parts.map((part, i) =>
                      i % 2 === 1 ? <strong key={i} className="text-[var(--neutral-100)]">{part}</strong> : part
                    );
                  };

                  if (trimmed.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-2xl font-bold text-[var(--neutral-50)] mt-8 mb-4">
                        {trimmed.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (trimmed.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-xl font-bold text-[var(--neutral-100)] mt-6 mb-3">
                        {trimmed.replace('### ', '')}
                      </h3>
                    );
                  }
                  // Model comparison cards
                  if (trimmed.startsWith('[MODEL]')) {
                    const content = trimmed.replace('[MODEL]', '').trim();
                    const [name, ...rest] = content.split('|').map(s => s.trim());
                    const details = rest.join('|');
                    return (
                      <div key={index} className="bg-[var(--background)] rounded-xl p-5 mb-3 border border-[var(--neutral-700)]">
                        <h4 className="font-bold text-[var(--primary)] mb-2">{name}</h4>
                        <p className="text-[var(--neutral-400)] text-sm">{renderWithBold(details)}</p>
                      </div>
                    );
                  }
                  if (trimmed.startsWith('- **')) {
                    const match = trimmed.match(/- \*\*(.+?)\*\*:?\s*(.*)/)
                    if (match) {
                      return (
                        <p key={index} className="ml-4 mb-2 text-[var(--neutral-300)]">
                          <strong className="text-[var(--neutral-100)]">{match[1]}:</strong> {match[2]}
                        </p>
                      );
                    }
                  }
                  if (trimmed.startsWith('- ')) {
                    return (
                      <p key={index} className="ml-4 mb-2 text-[var(--neutral-300)] flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                        <span>{renderWithBold(trimmed.replace('- ', ''))}</span>
                      </p>
                    );
                  }
                  return (
                    <p key={index} className="mb-4 text-[var(--neutral-300)] leading-relaxed">
                      {renderWithBold(trimmed)}
                    </p>
                  );
                })}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-[var(--neutral-700)]">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors font-medium"
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
