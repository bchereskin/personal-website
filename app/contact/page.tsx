'use client';

import { useState } from 'react';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import MotionSection from '@/app/components/MotionSection';
import Image from 'next/image';
import { motion } from 'motion/react';

const SUBJECTS = ['General Inquiry', 'Business Inquiry', 'Advisory', 'Speaking', 'Other'];

const inputClass =
  'w-full bg-[var(--neutral-800)] border border-[var(--neutral-600)] rounded-lg px-4 py-3 text-[var(--neutral-100)] placeholder-[var(--neutral-500)] focus:outline-none focus:border-[var(--primary)] transition-colors text-sm';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, honeypot }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }
      setSubmitted(true);
      setName(''); setEmail(''); setSubject(''); setMessage('');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[var(--background)]">
        {/* Hero */}
        <section className="relative pt-32 pb-10 px-6 overflow-hidden">
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
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[var(--primary)] font-medium tracking-widest uppercase mb-3"
            >
              Get in Touch
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-[var(--neutral-50)] mb-4"
            >
              Let&apos;s Connect
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-[var(--neutral-400)]"
            >
              Interested in consulting, advisory work, or just want to chat? Send me a message below.
            </motion.p>
          </div>
        </section>

        {/* Contact Form */}
        <section className="px-6 pb-20">
          <div className="max-w-2xl mx-auto">
            <MotionSection delay={0.1}>
              <div className="glass rounded-2xl p-6 md:p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 bg-[var(--primary)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--neutral-50)] mb-2">Message sent!</h3>
                    <p className="text-[var(--neutral-400)] text-sm">Thanks for reaching out — I&apos;ll be in touch within 48 hours.</p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-sm text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <input
                      type="text"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      aria-hidden="true"
                      className="absolute opacity-0 pointer-events-none w-0 h-0"
                    />

                    {error && (
                      <div className="mb-5 px-4 py-3 rounded-lg bg-[var(--accent-dark)] text-[var(--neutral-50)] text-sm">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm text-[var(--neutral-300)] mb-1.5">
                          Name <span className="text-[var(--accent)]">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          required
                          maxLength={100}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-sm text-[var(--neutral-300)] mb-1.5">
                          Email <span className="text-[var(--accent)]">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          maxLength={200}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="contact-subject" className="block text-sm text-[var(--neutral-300)] mb-1.5">
                        Subject <span className="text-[var(--accent)]">*</span>
                      </label>
                      <select
                        id="contact-subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="" disabled>Select a topic…</option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="contact-message" className="block text-sm text-[var(--neutral-300)] mb-1.5">
                        Message <span className="text-[var(--accent)]">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell me about your project or what you have in mind…"
                        required
                        maxLength={5000}
                        rows={5}
                        className={`${inputClass} resize-y`}
                      />
                      <p className="mt-1 text-xs text-[var(--neutral-500)] text-right">{message.length}/5000</p>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || !name.trim() || !email.trim() || !subject || !message.trim()}
                      className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--background)] font-semibold text-sm hover:bg-[var(--primary-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? 'Sending…' : 'Send message'}
                    </button>
                  </form>
                )}
              </div>
            </MotionSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
