'use client';

import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import MotionSection from '@/app/components/MotionSection';
import MovingBorder from '@/app/components/MovingBorder';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[var(--background)]">
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070"
              alt="City skyline"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-transparent to-[var(--background)]" />
          </div>

          <div className="relative z-10 max-w-4xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[var(--primary)] font-medium tracking-widest uppercase mb-4"
            >
              Operator · Builder · Investor
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] as const }}
              className="text-6xl md:text-8xl font-bold mb-6 gradient-text"
            >
              Brett<br />Chereskin
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-xl md:text-2xl text-[var(--neutral-300)] mb-10 max-w-2xl mx-auto"
            >
              I run operations at a fintech, build tools with AI, invest in military founders, and write about all of it. West Point grad. 12-year Army veteran. COO at dub.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                href="/about"
                className="px-8 py-4 bg-[var(--primary)] text-[var(--neutral-900)] rounded-lg font-semibold hover:bg-[var(--primary-light)] transition-all hover-lift"
              >
                About Me
              </Link>
              <MovingBorder>
                <Link
                  href="/contact"
                  className="block px-8 py-4 text-[var(--neutral-100)] font-semibold hover:text-[var(--primary)] transition-colors"
                >
                  Get in Touch
                </Link>
              </MovingBorder>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 z-10 animate-bounce"
          >
            <svg className="w-6 h-6 text-[var(--neutral-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-6 border-y border-[var(--neutral-700)]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: '12 Years', label: 'Army Aviator' },
              { value: 'COO', label: 'at dub' },
              { value: '3 Funds', label: 'LP & Angel' },
              { value: 'West Point', label: 'Class of 2006' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeInUp} className="text-center">
                <p className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</p>
                <p className="text-[var(--neutral-400)] text-sm uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* What I'm Building Section */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="gradient-orb w-[500px] h-[500px] bg-[var(--primary)] opacity-10 -bottom-64 -left-64" />

          <div className="max-w-6xl mx-auto relative z-10">
            <MotionSection className="text-center mb-16">
              <p className="text-[var(--accent)] font-medium tracking-widest uppercase mb-3">The Work</p>
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--neutral-50)] mb-4">
                What I&apos;m Building
              </h2>
              <p className="text-lg text-[var(--neutral-400)] max-w-2xl mx-auto">
                Three lanes. One thesis: operators who build with AI and invest in people create outsized impact.
              </p>
            </MotionSection>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6"
            >
              <motion.div
                variants={fadeInUp}
                className="group bg-[var(--card-bg)] rounded-2xl p-8 hover:bg-[var(--card-bg-hover)] transition-colors border border-[var(--neutral-700)] h-full hover-lift"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 20%, transparent)' }}
                >
                  <svg className="w-7 h-7 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--neutral-100)] mb-3">Running Operations</h3>
                <p className="text-[var(--neutral-400)] mb-4">
                  COO at dub. I run customer operations, finance, HR, and most G&A functions — many of them single-handedly, using AI to do the work of an entire back-office team.
                </p>
                <a
                  href="https://www.youtube.com/watch?v=gn5EUo1ux40"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--primary)] text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  Listen: Risk & Reason Podcast
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="group bg-[var(--card-bg)] rounded-2xl p-8 hover:bg-[var(--card-bg-hover)] transition-colors border border-[var(--neutral-700)] h-full hover-lift"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 20%, transparent)' }}
                >
                  <svg className="w-7 h-7 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--neutral-100)] mb-3">Building with AI</h3>
                <p className="text-[var(--neutral-400)] mb-4">
                  I build real tools with AI and write about what happens. This website, production workflows, tools for friends — shipped, not theorized.
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-[var(--accent)] text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  Read the blog
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="group bg-[var(--card-bg)] rounded-2xl p-8 hover:bg-[var(--card-bg-hover)] transition-colors border border-[var(--neutral-700)] h-full hover-lift"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 20%, transparent)' }}
                >
                  <svg className="w-7 h-7 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--neutral-100)] mb-3">Investing in Veterans</h3>
                <p className="text-[var(--neutral-400)] mb-4">
                  LP in Context Ventures and Stage 2 Capital. Angel investor. I back military founders and help portfolio companies with GTM and operations.
                </p>
                <Link
                  href="/about#investing"
                  className="inline-flex items-center gap-2 text-[var(--primary)] text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  Learn more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Experience Logo Bar */}
        <section className="py-20 px-6 border-t border-[var(--neutral-700)]">
          <div className="max-w-4xl mx-auto">
            <MotionSection className="text-center mb-12">
              <p className="text-[var(--accent)] font-medium tracking-widest uppercase mb-3">Experience</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--neutral-50)]">
                Where I&apos;ve Led
              </h2>
            </MotionSection>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="flex flex-wrap justify-center items-center gap-12 md:gap-20 mb-10"
            >
              {[
                { name: 'dub', label: 'COO & Board Member', logo: '/logos/dub.png' },
                { name: 'Affirm', label: 'Business Operations', logo: '/logos/affirm.svg' },
                { name: 'U.S. Army', label: '12 Years · Aviator', logo: '/logos/army.png' },
              ].map((org) => (
                <motion.div key={org.name} variants={fadeInUp} className="text-center">
                  <div className="h-12 flex items-center justify-center mb-3">
                    <Image
                      src={org.logo}
                      alt={`${org.name} logo`}
                      width={48}
                      height={48}
                      className="object-contain brightness-0 invert opacity-80 h-10 w-auto"
                    />
                  </div>
                  <p className="text-sm text-[var(--neutral-500)]">{org.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <MotionSection className="text-center">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[var(--primary)] font-medium hover:opacity-80 transition-opacity"
              >
                Read my full story
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </MotionSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
