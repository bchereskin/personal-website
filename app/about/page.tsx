'use client';

import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import MotionSection from '@/app/components/MotionSection';
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

export default function About() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[var(--background)]">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070"
              alt="NYC skyline"
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-transparent to-[var(--background)]" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12 mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] p-1 flex-shrink-0"
              >
                <div className="w-full h-full rounded-full bg-[var(--card-bg)] flex items-center justify-center overflow-hidden">
                  <Image
                    src="/Headshot.jpeg"
                    alt="Brett Chereskin"
                    width={256}
                    height={256}
                    className="object-cover w-full h-full"
                  />
                </div>
              </motion.div>

              <div className="text-center md:text-left">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-[var(--primary)] font-medium tracking-widest uppercase mb-3"
                >
                  About Me
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl md:text-5xl font-bold text-[var(--neutral-50)] mb-4"
                >
                  Brett Chereskin
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xl text-[var(--neutral-300)]"
                >
                  I flew Army reconnaissance planes for 12 years, then moved to fintech. Now I run operations at dub, invest in veteran founders, build things with AI, and write about the intersection of all of it.
                </motion.p>
              </div>
            </div>
          </div>
        </section>

        {/* Career Journey */}
        <section className="py-20 px-6 relative">
          <div className="gradient-orb w-96 h-96 bg-[var(--primary)] opacity-10 -right-48 top-0" />

          <div className="max-w-4xl mx-auto relative z-10">
            <MotionSection>
              <p className="text-[var(--accent)] font-medium tracking-widest uppercase mb-3">Experience</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--neutral-50)] mb-10">
                Career Journey
              </h2>
            </MotionSection>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="space-y-6"
            >
              {/* dub */}
              <motion.div variants={fadeInUp}>
                <div className="relative rounded-2xl overflow-hidden group" style={{ background: 'linear-gradient(135deg, #121110 0%, #1a1918 100%)' }}>
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#f08752] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#e07139] rounded-full blur-[100px] translate-y-1/2" />
                  </div>
                  <div className="relative z-10 p-8 md:p-10">
                    <span className="inline-block px-3 py-1 bg-[#f08752] text-[#121110] text-sm font-semibold rounded-full mb-3">
                      Current
                    </span>
                    <h3 className="text-2xl font-bold text-[#f5f2ed]">COO & Board Member at dub</h3>
                    <p className="text-[#bfb3a6] text-sm mb-3">New York City</p>
                    <p className="text-[#bfb3a6] max-w-xl">
                      I partner with the CEO to operate the business — sitting on the board of
                      directors and running customer operations, brokerage operations, finance, HR,
                      and most G&A functions at a social investing platform. Many of those I handle
                      single-handedly, powered by AI, operating at the scale of a much larger team.
                      It&apos;s the proving ground for everything I write about — using AI to do real
                      operational work, not just talk about it.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Affirm */}
              <motion.div variants={fadeInUp}>
                <div className="relative rounded-2xl overflow-hidden group">
                  <Image
                    src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070"
                    alt="Digital payments"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#13131f] via-[#13131f]/80 to-[#1a1a2e]/60" />
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366f1] rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#8b5cf6] rounded-full blur-[80px]" />
                  </div>
                  <div className="relative z-10 p-8 md:p-10">
                    <span className="inline-block px-2 py-1 bg-[#6366f1]/30 text-[#a5b4fc] text-xs font-medium rounded mb-3">
                      Previous
                    </span>
                    <h3 className="text-2xl font-bold text-white">Business Operations at Affirm</h3>
                    <p className="text-[#94a3b8] text-sm mb-3">San Francisco Bay Area</p>
                    <p className="text-[#94a3b8] max-w-xl">
                      Ran business operations at one of the largest BNPL companies during its
                      hypergrowth phase. Built operational infrastructure that scales under
                      regulatory pressure — compliance, risk, and cross-functional ops. Learned
                      how fast-growing fintechs break and what it takes to hold them together
                      when the stakes are real.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* U.S. Army */}
              <motion.div variants={fadeInUp}>
                <div className="relative rounded-2xl overflow-hidden group">
                  <Image
                    src="/kingair.jpg"
                    alt="King Air aircraft"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/85 to-[var(--background)]/50" />
                  <div className="relative z-10 p-8 md:p-10">
                    <span className="inline-block px-3 py-1 bg-[var(--accent)]/20 text-[var(--accent)] text-sm font-semibold rounded-full mb-3">
                      12 Years
                    </span>
                    <h3 className="text-2xl font-bold text-[var(--neutral-50)]">U.S. Army Officer</h3>
                    <p className="text-[var(--neutral-300)] text-sm mb-3">Fixed-Wing & Rotary-Wing Aviator · UAS Commander · 160th SOAR</p>
                    <p className="text-[var(--neutral-200)] max-w-xl">
                      12 years as an Army officer and aviator. Started in fixed-wing reconnaissance,
                      commanded a UAS (drone) unit on the conventional side, then joined the 160th
                      Special Operations Aviation Regiment where I helped build their first organic
                      large UAS unit from scratch. The leadership, discipline, and mission planning
                      from the military is the foundation that makes everything else work.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Education & Credentials */}
        <section className="py-20 px-6 border-y border-[var(--neutral-700)]">
          <div className="max-w-4xl mx-auto">
            <MotionSection>
              <p className="text-[var(--accent)] font-medium tracking-widest uppercase mb-3">Background</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--neutral-50)] mb-10">
                Education & Credentials
              </h2>
            </MotionSection>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 gap-6"
            >
              <motion.div variants={fadeInUp}>
                <div className="relative rounded-2xl overflow-hidden h-full group">
                  <div className="absolute inset-0">
                    <Image
                      src="/westpoint.jpg"
                      alt="West Point campus"
                      fill
                      className="object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-[var(--card-bg)]/80 to-transparent" />
                  </div>
                  <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                    <h3 className="text-xl font-bold text-[var(--neutral-50)] mb-2">West Point</h3>
                    <p className="text-[var(--neutral-400)] text-sm mb-3">United States Military Academy · Class of 2006</p>
                    <p className="text-[var(--neutral-300)]">
                      Four-year undergraduate program combining rigorous academics with
                      military leadership training.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <div className="bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--neutral-700)] h-full">
                  <h3 className="text-xl font-bold text-[var(--neutral-50)] mb-4">Licenses & Certifications</h3>
                  <ul className="space-y-3 text-[var(--neutral-300)]">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                      <span><strong className="text-[var(--neutral-100)]">Commercial Pilot</strong> — Fixed Wing & Rotary (FAA)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                      <span><strong className="text-[var(--neutral-100)]">Commercial UAS Certificate</strong> (FAA Part 107)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                      <span><strong className="text-[var(--neutral-100)]">Series 99</strong> — Operations Professional (FINRA)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                      <span><strong className="text-[var(--neutral-100)]">Securities Industry Essentials</strong> (FINRA)</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Advisory & Investing */}
        <section id="investing" className="py-20 px-6 relative overflow-hidden">
          <div className="gradient-orb w-[500px] h-[500px] bg-[var(--accent)] opacity-10 -left-64 -bottom-64" />

          <div className="max-w-4xl mx-auto relative z-10">
            <MotionSection>
              <p className="text-[var(--accent)] font-medium tracking-widest uppercase mb-3">Advisory & Investing</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--neutral-50)] mb-10">
                Where I Put My Time & Capital
              </h2>
            </MotionSection>

            {/* Advisory */}
            <MotionSection delay={0.1} className="mb-10">
              <div className="bg-[var(--card-bg)] rounded-2xl p-8 md:p-10 border border-[var(--neutral-700)]">
                <h3 className="text-xl font-bold text-[var(--neutral-100)] mb-6">Advisory</h3>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={staggerContainer}
                  className="grid md:grid-cols-3 gap-6 mb-8"
                >
                  <motion.div variants={fadeInUp} className="text-center p-4 rounded-xl bg-[var(--background)]">
                    <div className="w-12 h-12 bg-[var(--primary)]/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-[var(--neutral-100)] mb-1">Grady AI</h4>
                    <p className="text-[var(--neutral-400)] text-sm">AI-powered grading platform for higher education</p>
                  </motion.div>

                  <motion.div variants={fadeInUp} className="text-center p-4 rounded-xl bg-[var(--background)]">
                    <div className="w-12 h-12 bg-[var(--accent)]/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-[var(--neutral-100)] mb-1">Stage 2 Capital</h4>
                    <p className="text-[var(--neutral-400)] text-sm">Catalyst LP — GTM-focused fund, active with portfolio companies</p>
                  </motion.div>

                  <motion.div variants={fadeInUp} className="text-center p-4 rounded-xl bg-[var(--background)]">
                    <div className="w-12 h-12 bg-[var(--primary)]/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-[var(--neutral-100)] mb-1">Military → Civilian</h4>
                    <p className="text-[var(--neutral-400)] text-sm">Helping veterans transition into the startup ecosystem</p>
                  </motion.div>
                </motion.div>
              </div>
            </MotionSection>

            {/* Investing */}
            <MotionSection delay={0.2}>
              <div className="bg-[var(--card-bg)] rounded-2xl p-8 md:p-10 border border-[var(--neutral-700)]">
                <h3 className="text-xl font-bold text-[var(--neutral-100)] mb-6">Investing</h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <span className="w-2 h-2 rounded-full bg-[var(--primary)] mt-2.5 flex-shrink-0" />
                    <div>
                      <p className="text-[var(--neutral-100)] font-semibold mb-1">
                        <a href="https://www.contextvc.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)] transition-colors">Context Ventures</a>
                      </p>
                      <p className="text-[var(--neutral-400)]">
                        A fund investing specifically in military founders. I believe the leadership training, risk calibration, and mission orientation that veterans bring to startups is a genuine competitive advantage.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="w-2 h-2 rounded-full bg-[var(--primary)] mt-2.5 flex-shrink-0" />
                    <div>
                      <p className="text-[var(--neutral-100)] font-semibold mb-1">
                        <a href="https://www.stage2.capital" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)] transition-colors">Stage 2 Capital</a>
                      </p>
                      <p className="text-[var(--neutral-400)]">
                        B2B go-to-market focused fund. As a Catalyst LP, I actively help portfolio companies with operational strategy and scaling.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)] mt-2.5 flex-shrink-0" />
                    <div>
                      <p className="text-[var(--neutral-100)] font-semibold mb-1">
                        <a href="https://truv.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">Truv</a>
                        <span className="text-[var(--neutral-500)] font-normal text-sm ml-2">Angel Investment</span>
                      </p>
                      <p className="text-[var(--neutral-400)]">
                        Consumer-permissioned financial data platform powering income and employment verification for lenders.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </MotionSection>
          </div>
        </section>

        {/* Podcasts & Media */}
        <section className="py-20 px-6 border-t border-[var(--neutral-700)]">
          <div className="max-w-4xl mx-auto">
            <MotionSection>
              <p className="text-[var(--accent)] font-medium tracking-widest uppercase mb-3">Media</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--neutral-50)] mb-10">
                Podcasts & Conversations
              </h2>
            </MotionSection>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 gap-6"
            >
              {[
                {
                  href: 'https://www.youtube.com/watch?v=gn5EUo1ux40',
                  image: 'https://i.ytimg.com/vi/gn5EUo1ux40/maxresdefault.jpg',
                  imageClass: 'object-cover',
                  show: 'Risk and Reason Podcast',
                  title: 'Why \u201CMove Fast\u201D Breaks Fintechs',
                  description: 'Risk, fraud, operational discipline at scale. With Eli Wachs from Footprint.',
                },
                {
                  href: 'https://thenest.concentrix.com/episode-12-dub/',
                  image: 'https://thenest.concentrix.com/wp-content/uploads/2025/06/Brett-Chereskin-Chief-of-Operations-Dub.png',
                  imageClass: 'object-cover object-[center_30%]',
                  show: 'CX Coffee Chat \u00B7 Concentrix',
                  title: 'How dub is Making Investing Accessible',
                  description: 'Scaling a startup, community-driven fintech, and AI in customer operations.',
                },
                {
                  href: 'https://www.youtube.com/watch?v=-x1IW7Cx53c',
                  image: 'https://i.ytimg.com/vi/-x1IW7Cx53c/maxresdefault.jpg',
                  imageClass: 'object-cover',
                  show: 'In the Field',
                  title: 'Eating an MRE with a US Army Pilot',
                  description: 'Military-to-civilian transition, fixed-wing aviation, and building a second career in tech.',
                },
                {
                  href: 'https://www.youtube.com/watch?v=lqyusmbwBR4',
                  image: 'https://i.ytimg.com/vi/lqyusmbwBR4/maxresdefault.jpg',
                  imageClass: 'object-cover',
                  show: 'Helping The Brave',
                  title: 'Veteran Transition & Leadership',
                  description: 'Sharing experiences navigating post-military life and building in the startup ecosystem.',
                },
              ].map((podcast) => (
                <motion.div key={podcast.href} variants={fadeInUp}>
                  <a
                    href={podcast.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-[var(--card-bg)] rounded-2xl overflow-hidden border border-[var(--neutral-700)] hover:border-[var(--neutral-600)] transition-colors hover-lift h-full"
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src={podcast.image}
                        alt={podcast.title}
                        fill
                        className={podcast.imageClass}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] to-transparent" />
                    </div>
                    <div className="p-6 pt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m-2.828 9.9a9 9 0 010-12.728" />
                        </svg>
                        <span className="text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wide">{podcast.show}</span>
                      </div>
                      <h3 className="text-lg font-bold text-[var(--neutral-100)] mb-2">{podcast.title}</h3>
                      <p className="text-sm text-[var(--neutral-400)]">{podcast.description}</p>
                    </div>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Life Outside Work */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <MotionSection>
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0">
                  <Image
                    src="https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=2070"
                    alt="NYC"
                    fill
                    className="object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/80 to-transparent" />
                </div>
                <div className="relative z-10 p-8 md:p-12 md:w-3/4">
                  <p className="text-[var(--accent)] font-medium tracking-widest uppercase mb-3">Beyond Work</p>
                  <h2 className="text-2xl font-bold text-[var(--neutral-50)] mb-5">Life Outside Work</h2>
                  <p className="text-[var(--neutral-300)] text-lg mb-4">
                    I&apos;ve been married to my wife Lisa for over 13 years — we met when I was stationed in Germany
                    and still go back as often as we can. We don&apos;t have human kids, but our Pomsky Tanuki is the
                    best city dog you&apos;ll ever meet. Most of our favorite NYC spots we discovered walking him
                    through different neighborhoods.
                  </p>
                  <p className="text-[var(--neutral-300)] text-lg mb-6">
                    Born and raised on Long Island. After 15 years traveling the world with the military and doing
                    the startup thing in San Francisco, I finally came back to the city — and we&apos;ve been making up
                    for lost time. We love food, wine, and Broadway.
                  </p>
                  <Link
                    href="/favorites"
                    className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-light)] font-medium transition-colors"
                  >
                    See our NYC favorites
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </MotionSection>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6">
          <MotionSection className="max-w-4xl mx-auto text-center">
            <Link
              href="/contact"
              className="inline-block bg-[var(--primary)] text-[var(--neutral-900)] px-8 py-4 rounded-lg font-semibold hover:bg-[var(--primary-light)] transition-all hover-lift"
            >
              Get in touch
            </Link>
          </MotionSection>
        </section>
      </main>
      <Footer />
    </>
  );
}
