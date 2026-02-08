'use client';

import Navigation from '@/app/components/Navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useScrollAnimation } from '@/app/hooks/useScrollAnimation';

function AnimatedSection({
  children,
  className = '',
  animation = 'animate-fade-in-up',
  delay = ''
}: {
  children: React.ReactNode;
  className?: string;
  animation?: string;
  delay?: string;
}) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? `${animation} ${delay}` : 'opacity-0'}`}
    >
      {children}
    </div>
  );
}

export default function About() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[var(--background)]">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
          {/* Background */}
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
              {/* Profile Photo */}
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] p-1 animate-fade-in-up flex-shrink-0">
                <div className="w-full h-full rounded-full bg-[var(--card-bg)] flex items-center justify-center overflow-hidden">
                  <Image
                    src="/Headshot.jpeg"
                    alt="Brett Chereskin"
                    width={256}
                    height={256}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div className="text-center md:text-left">
                <p className="text-[var(--primary)] font-medium tracking-widest uppercase mb-3 animate-fade-in-up">
                  About Me
                </p>
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--neutral-50)] mb-4 animate-fade-in-up delay-100">
                  Brett Chereskin
                </h1>
                <p className="text-xl text-[var(--neutral-300)] animate-fade-in-up delay-200">
                  12-year Army veteran turned tech operator. I bring military precision
                  to startup chaos—scaling operations, building teams, and turning
                  ambitious visions into reality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Career Journey */}
        <section className="py-20 px-6 relative">
          <div className="gradient-orb w-96 h-96 bg-[var(--primary)] opacity-10 -right-48 top-0" />

          <div className="max-w-4xl mx-auto relative z-10">
            <AnimatedSection>
              <p className="text-[var(--accent)] font-medium tracking-widest uppercase mb-3">Experience</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--neutral-50)] mb-10">
                Career Journey
              </h2>
            </AnimatedSection>

            <div className="space-y-6">
              {/* dub - Orange gradient theme */}
              <AnimatedSection delay="delay-100">
                <div className="relative rounded-2xl overflow-hidden group" style={{ background: 'linear-gradient(135deg, #121110 0%, #1a1918 100%)' }}>
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#f08752] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#e07139] rounded-full blur-[100px] translate-y-1/2" />
                  </div>
                  <div className="relative z-10 p-8 md:p-10">
                    <span className="inline-block px-3 py-1 bg-[#f08752] text-[#121110] text-sm font-semibold rounded-full mb-3">
                      Current
                    </span>
                    <h3 className="text-2xl font-bold text-[#f5f2ed]">COO at dub</h3>
                    <p className="text-[#bfb3a6] text-sm mb-3">New York City</p>
                    <p className="text-[#bfb3a6] max-w-xl">
                      Leading operations at a NYC-based fintech company. I drive growth
                      by building scalable systems, leading cross-functional teams, and
                      turning strategic vision into execution.
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              {/* Affirm - Purple/Indigo theme with fintech imagery */}
              <AnimatedSection delay="delay-200">
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
                    <p className="text-[#94a3b8]">
                      Drove operational initiatives at one of the leading buy-now-pay-later
                      fintech companies. Streamlined processes and helped scale the business
                      through a period of rapid growth.
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              {/* U.S. Army - Aviation theme with King Air */}
              <AnimatedSection delay="delay-300">
                <div className="relative rounded-2xl overflow-hidden group">
                  <Image
                    src="/kingair.jpg"
                    alt="King Air aircraft"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/70 to-transparent" />
                  <div className="relative z-10 p-8 md:p-10">
                    <span className="inline-block px-3 py-1 bg-[var(--accent)]/20 text-[var(--accent)] text-sm font-semibold rounded-full mb-3">
                      12 Years
                    </span>
                    <h3 className="text-2xl font-bold text-[var(--neutral-50)]">U.S. Army Officer</h3>
                    <p className="text-[var(--neutral-400)] text-sm mb-3">Aviator • Manned & Unmanned • Leadership</p>
                    <p className="text-[var(--neutral-300)] max-w-xl mb-4">
                      Served 12 years as an Army officer with assignments across the globe.
                      Led teams in high-stakes environments, managed complex operations, and
                      developed the leadership skills that now drive my approach to business.
                    </p>
                    <p className="text-[var(--neutral-500)] text-sm">
                      Fort Huachuca, AZ • Hohenfels, Germany • Wiesbaden, Germany • Fort Rucker, AL
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Education & Credentials */}
        <section className="py-20 px-6 border-y border-[var(--neutral-700)]">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <p className="text-[var(--accent)] font-medium tracking-widest uppercase mb-3">Background</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--neutral-50)] mb-10">
                Education & Credentials
              </h2>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-6">
              <AnimatedSection delay="delay-100">
                <div className="relative rounded-2xl overflow-hidden h-full group">
                  <div className="absolute inset-0">
                    <Image
                      src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070"
                      alt="West Point"
                      fill
                      className="object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-[var(--card-bg)]/80 to-transparent" />
                  </div>
                  <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                    <h3 className="text-xl font-bold text-[var(--neutral-50)] mb-2">West Point</h3>
                    <p className="text-[var(--neutral-400)] text-sm mb-3">United States Military Academy • Class of 2006</p>
                    <p className="text-[var(--neutral-300)]">
                      Four-year undergraduate program combining rigorous academics with
                      military leadership training.
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay="delay-200">
                <div className="bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--neutral-700)] h-full">
                  <h3 className="text-xl font-bold text-[var(--neutral-50)] mb-4">Licenses & Certifications</h3>
                  <ul className="space-y-3 text-[var(--neutral-300)]">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                      <span><strong className="text-[var(--neutral-100)]">Commercial Pilot</strong> — Fixed Wing & Rotary (FAA)</span>
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
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Advisory Work */}
        <section className="py-20 px-6 relative overflow-hidden">
          <div className="gradient-orb w-[500px] h-[500px] bg-[var(--accent)] opacity-10 -left-64 -bottom-64" />

          <div className="max-w-4xl mx-auto relative z-10">
            <AnimatedSection>
              <p className="text-[var(--accent)] font-medium tracking-widest uppercase mb-3">Services</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--neutral-50)] mb-10">
                Advisory Work
              </h2>
            </AnimatedSection>

            <AnimatedSection delay="delay-100">
              <div className="bg-[var(--card-bg)] rounded-2xl p-8 md:p-10 border border-[var(--neutral-700)]">
                <p className="text-[var(--neutral-300)] text-lg mb-6">
                  I advise early-stage startups on operations, scaling, and go-to-market
                  strategy. My sweet spot is helping founders navigate the transition from
                  scrappy startup to structured scale-up.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 rounded-xl bg-[var(--background)]">
                    <div className="w-12 h-12 bg-[var(--primary)]/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-[var(--neutral-100)] mb-1">Early Ops & GTM</h4>
                    <p className="text-[var(--neutral-400)] text-sm">Startup to scale-up</p>
                  </div>

                  <div className="text-center p-4 rounded-xl bg-[var(--background)]">
                    <div className="w-12 h-12 bg-[var(--accent)]/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-[var(--neutral-100)] mb-1">Fintech</h4>
                    <p className="text-[var(--neutral-400)] text-sm">Regulated at scale</p>
                  </div>

                  <div className="text-center p-4 rounded-xl bg-[var(--background)]">
                    <div className="w-12 h-12 bg-[var(--primary)]/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-[var(--neutral-100)] mb-1">AI + Enterprise</h4>
                    <p className="text-[var(--neutral-400)] text-sm">Leaders harnessing AI</p>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="inline-block bg-[var(--primary)] text-[var(--neutral-900)] px-8 py-4 rounded-lg font-semibold hover:bg-[var(--primary-light)] transition-all hover-lift"
                >
                  Get in touch
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Personal */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
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
                <div className="relative z-10 p-8 md:p-12 md:w-2/3">
                  <p className="text-[var(--accent)] font-medium tracking-widest uppercase mb-3">Beyond Work</p>
                  <h2 className="text-2xl font-bold text-[var(--neutral-50)] mb-4">Life in NYC</h2>
                  <p className="text-[var(--neutral-300)] text-lg">
                    Based in <strong className="text-[var(--neutral-100)]">New York City</strong>. When I'm not building operations
                    or advising startups, you'll find me exploring the city's incredible diversity
                    through its food, art, and theatre—or writing about how non-technical leaders
                    can leverage AI tools to amplify their impact.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
    </>
  );
}
