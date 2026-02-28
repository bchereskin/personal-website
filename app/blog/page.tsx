'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { posts, formatDate } from './posts';
import { useScrollAnimation } from '@/app/hooks/useScrollAnimation';

function AnimatedArticle({
  children,
  delay = ''
}: {
  children: React.ReactNode;
  delay?: string;
}) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <article
      ref={ref}
      className={`${isVisible ? `animate-fade-in-up ${delay}` : 'opacity-0'}`}
    >
      {children}
    </article>
  );
}

export default function Blog() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[var(--background)]">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070"
              alt="Writing"
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-transparent to-[var(--background)]" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <p className="text-[var(--primary)] font-medium tracking-widest uppercase mb-3 animate-fade-in-up">
              Insights
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-[var(--neutral-50)] mb-4 animate-fade-in-up delay-100">
              Blog
            </h1>
            <p className="text-xl text-[var(--neutral-400)] animate-fade-in-up delay-200">
              Thoughts on leadership, operations, and building great companies.
            </p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {posts.map((post, index) => (
                <AnimatedArticle key={post.slug} delay={`delay-${(index + 1) * 100}`}>
                  <Link href={`/blog/${post.slug}`} className="block group">
                    <div className="bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--neutral-700)] hover:border-[var(--neutral-600)] transition-all hover-lift">
                      <div className="flex items-center gap-4 text-sm text-[var(--neutral-500)] mb-4">
                        <span className="bg-[var(--primary)]/20 text-[var(--primary)] px-3 py-1 rounded-full font-medium">
                          {post.category}
                        </span>
                        <span>{formatDate(post.date)}</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-[var(--neutral-50)] mb-3 group-hover:text-[var(--primary)] transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-[var(--neutral-400)] mb-4">{post.excerpt}</p>
                      <span className="text-[var(--primary)] font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                        Read more
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </AnimatedArticle>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
