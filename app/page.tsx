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
          {/* Background Image */}
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
              Operator · Builder · AI Practitioner
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
              Operational leader applying military discipline, fintech scale, and emerging AI to help companies run faster and build smarter.
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

          {/* Scroll indicator */}
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
              { value: '12+', label: 'Military Leadership' },
              { value: 'COO', label: 'at dub' },
              { value: 'West Point', label: '2006 Grad' },
              { value: 'NYC', label: 'Based' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeInUp} className="text-center">
                <p className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</p>
                <p className="text-[var(--neutral-400)] text-sm uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* What I Do Section */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="gradient-orb w-[500px] h-[500px] bg-[var(--primary)] opacity-10 -bottom-64 -left-64" />

          <div className="max-w-6xl mx-auto relative z-10">
            <MotionSection className="text-center mb-16">
              <p className="text-[var(--accent)] font-medium tracking-widest uppercase mb-3">Expertise</p>
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--neutral-50)] mb-4">
                What I Do
              </h2>
              <p className="text-lg text-[var(--neutral-400)] max-w-2xl mx-auto">
                I bring operational leadership and hands-on AI expertise together — helping companies scale faster, build smarter, and unlock what they've been putting off.
              </p>
            </MotionSection>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                  iconColor: 'var(--primary)',
                  title: 'Scale Operations',
                  description: 'Transform scrappy processes into scalable systems. Build the infrastructure that lets teams move fast without breaking things.',
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
                  iconColor: 'var(--accent)',
                  title: 'Leverage AI',
                  description: 'Apply emerging AI tools to compress timelines, unlock capabilities that used to require large teams, and build operational leverage that compounds.',
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                  iconColor: 'var(--primary)',
                  title: 'Drive Strategy',
                  description: 'Turn vision into execution. Bridge the gap between ambitious goals and the daily work that makes them happen.',
                },
              ].map((card) => (
                <motion.div
                  key={card.title}
                  variants={fadeInUp}
                  whileHover={{ y: -6, boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.4)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group bg-[var(--card-bg)] rounded-2xl p-8 hover:bg-[var(--card-bg-hover)] transition-colors border border-[var(--neutral-700)] h-full cursor-default"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `color-mix(in srgb, ${card.iconColor} 20%, transparent)` }}
                  >
                    <svg className="w-7 h-7" style={{ color: card.iconColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {card.icon}
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--neutral-100)] mb-3">{card.title}</h3>
                  <p className="text-[var(--neutral-400)]">{card.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-24 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <MotionSection className="text-center mb-16">
              <p className="text-[var(--accent)] font-medium tracking-widest uppercase mb-3">Experience</p>
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--neutral-50)]">
                Where I've Led
              </h2>
            </MotionSection>

            {/* Featured Experience - dub */}
            <MotionSection className="mb-8">
              <div className="relative rounded-3xl overflow-hidden group" style={{ background: 'linear-gradient(135deg, #121110 0%, #1a1918 100%)' }}>
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[#f08752] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#e07139] rounded-full blur-[100px] translate-y-1/2" />
                </div>
                <div className="relative z-10 p-8 md:p-12 md:flex md:items-center md:justify-between">
                  <div className="md:w-2/3">
                    <span className="inline-block px-3 py-1 bg-[#f08752] text-[#121110] text-sm font-semibold rounded-full mb-4">
                      Current
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold text-[#f5f2ed] mb-3">
                      COO at dub
                    </h3>
                    <p className="text-[#bfb3a6] text-lg mb-6 max-w-xl">
                      Leading operations at a NYC fintech. Building scalable systems,
                      driving cross-functional execution, and scaling the team through
                      rapid growth.
                    </p>
                    <a
                      href="https://www.dubapp.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#f08752] font-medium hover:text-[#ffd2b4] transition-colors"
                    >
                      Visit dub
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                  <div className="hidden md:block text-8xl font-bold text-[#f08752]/20">
                    dub
                  </div>
                </div>
              </div>
            </MotionSection>

            {/* Other Experience */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6"
            >
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative rounded-2xl overflow-hidden group h-80"
              >
                <Image
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070"
                  alt="Digital payments"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13131f] via-[#13131f]/70 to-[#1a1a2e]/40" />
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#6366f1] rounded-full blur-[80px]" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#8b5cf6] rounded-full blur-[60px]" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <span className="inline-block px-2 py-1 bg-[#6366f1]/30 text-[#a5b4fc] text-xs font-medium rounded mb-2">
                    Previous
                  </span>
                  <h3 className="text-xl font-bold text-white">Affirm</h3>
                  <p className="text-[#94a3b8] text-sm">Business Operations</p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative rounded-2xl overflow-hidden group h-80"
              >
                <Image
                  src="/kingair.jpg"
                  alt="King Air aircraft"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-2 py-1 bg-[var(--accent)]/20 text-[var(--accent)] text-xs font-medium rounded mb-2">
                    12 Years
                  </span>
                  <h3 className="text-xl font-bold text-[var(--neutral-50)]">U.S. Army</h3>
                  <p className="text-[var(--neutral-400)] text-sm">Aviator · Manned & Unmanned · Leadership</p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative rounded-2xl overflow-hidden group h-80"
              >
                <Image
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070"
                  alt="Advisory meeting"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-[var(--neutral-50)]">Startup Advisor</h3>
                  <p className="text-[var(--neutral-400)] text-sm">Ops · GTM · AI Strategy</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070"
              alt="Collaboration"
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/90 to-[var(--background)]" />
          </div>

          <MotionSection className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--neutral-50)] mb-4">
              Let's Work Together
            </h2>
            <p className="text-lg text-[var(--neutral-400)] mb-8 max-w-2xl mx-auto">
              Whether you're scaling operations, exploring how AI fits into your business, or just want to connect—I'd love to hear from you.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-[var(--accent)] text-white rounded-lg font-semibold hover:bg-[var(--accent-dark)] transition-all hover-lift"
            >
              Get in Touch
            </Link>
          </MotionSection>
        </section>
      </main>
      <Footer />
    </>
  );
}
