'use client';

import Navigation from '@/app/components/Navigation';
import Image from 'next/image';
import { useScrollAnimation } from '@/app/hooks/useScrollAnimation';

function AnimatedCard({
  children,
  delay = ''
}: {
  children: React.ReactNode;
  delay?: string;
}) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`${isVisible ? `animate-fade-in-up ${delay}` : 'opacity-0'}`}
    >
      {children}
    </div>
  );
}

export default function Contact() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[var(--background)]">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074"
              alt="Communication"
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-transparent to-[var(--background)]" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <p className="text-[var(--primary)] font-medium tracking-widest uppercase mb-3 animate-fade-in-up">
              Get in Touch
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-[var(--neutral-50)] mb-4 animate-fade-in-up delay-100">
              Let's Connect
            </h1>
            <p className="text-xl text-[var(--neutral-400)] animate-fade-in-up delay-200">
              Interested in consulting, advisory work, or just want to chat?
              Reach out through any of these channels.
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Email */}
              <AnimatedCard delay="delay-100">
                <a
                  href="mailto:Brett.Chereskin@gmail.com"
                  className="block bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--neutral-700)] hover:border-[var(--primary)] transition-all hover-lift h-full group"
                >
                  <div className="w-14 h-14 bg-[var(--primary)]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--neutral-50)] mb-2">Email</h3>
                  <p className="text-[var(--neutral-400)] text-sm">Brett.Chereskin@gmail.com</p>
                </a>
              </AnimatedCard>

              {/* LinkedIn */}
              <AnimatedCard delay="delay-200">
                <a
                  href="https://www.linkedin.com/in/brettchereskin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--neutral-700)] hover:border-[var(--accent)] transition-all hover-lift h-full group"
                >
                  <div className="w-14 h-14 bg-[var(--accent)]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-[var(--accent)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--neutral-50)] mb-2">LinkedIn</h3>
                  <p className="text-[var(--neutral-400)] text-sm">Connect professionally</p>
                </a>
              </AnimatedCard>

              {/* Twitter/X */}
              <AnimatedCard delay="delay-300">
                <a
                  href="https://twitter.com/BChereskin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--neutral-700)] hover:border-[var(--neutral-400)] transition-all hover-lift h-full group"
                >
                  <div className="w-14 h-14 bg-[var(--neutral-600)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-[var(--neutral-100)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--neutral-50)] mb-2">Twitter / X</h3>
                  <p className="text-[var(--neutral-400)] text-sm">@BChereskin</p>
                </a>
              </AnimatedCard>
            </div>

            {/* Advisory CTA */}
            <AnimatedCard delay="delay-400">
              <div className="mt-12 relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0">
                  <Image
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070"
                    alt="Team meeting"
                    fill
                    className="object-cover opacity-30"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/90 to-[var(--background)]/70" />
                </div>
                <div className="relative z-10 p-8 md:p-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-[var(--neutral-50)] mb-3">
                    Looking for advisory support?
                  </h2>
                  <p className="text-[var(--neutral-300)] mb-6 max-w-xl text-lg">
                    I work with early-stage startups on operations, scaling, and go-to-market strategy.
                    Let's discuss how I can help your company grow.
                  </p>
                  <a
                    href="mailto:Brett.Chereskin@gmail.com?subject=Advisory%20Inquiry"
                    className="inline-block bg-[var(--primary)] text-[var(--neutral-900)] px-8 py-4 rounded-lg font-semibold hover:bg-[var(--primary-light)] transition-all hover-lift"
                  >
                    Start a conversation
                  </a>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </section>
      </main>
    </>
  );
}
