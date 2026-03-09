'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import MotionSection from '@/app/components/MotionSection';
import SubscribeForm from '@/app/components/SubscribeForm';
import { posts, formatDate } from './posts';
import { motion } from 'motion/react';

export default function Blog() {
  const [showSubscribe, setShowSubscribe] = useState(false);

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
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[var(--primary)] font-medium tracking-widest uppercase mb-3"
            >
              Insights
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-[var(--neutral-50)] mb-4"
            >
              Blog
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-[var(--neutral-400)]"
            >
              Thoughts on leadership, operations, and building great companies.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-5"
            >
              <button
                onClick={() => setShowSubscribe(!showSubscribe)}
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--neutral-400)] hover:text-[var(--primary)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {showSubscribe ? 'Hide' : 'Subscribe for updates'}
              </button>
              {showSubscribe && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 max-w-md"
                >
                  <SubscribeForm />
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="pt-8 pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {posts.map((post, index) => (
                <MotionSection key={post.slug} delay={index * 0.1}>
                  <Link href={`/blog/${post.slug}`} className="block group">
                    <div
                      className="bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--neutral-700)] hover:border-[var(--neutral-600)] transition-colors hover-lift"
                    >
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
                </MotionSection>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
