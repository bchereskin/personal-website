'use client';

import { useState } from 'react';
import Nav from '@/app/components/Nav';
import Footer from '@/app/components/Footer';
import SectionHead from '@/app/components/SectionHead';

const inputStyle: React.CSSProperties = {
  border: 'none',
  borderBottom: '1px solid var(--rule)',
  background: 'transparent',
  fontFamily: 'var(--font-serif)',
  fontSize: '20px',
  color: 'var(--ink)',
  padding: '10px 0 12px',
  width: '100%',
  outline: 'none',
};

const labelClass =
  'block font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--ink-4)] mt-5';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
        body: JSON.stringify({
          name,
          email,
          subject: 'General Inquiry',
          message,
          honeypot,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Nav />
      <main className="bg-[var(--paper)] text-[var(--ink)]">
        <div className="max-w-[640px] mx-auto px-8 pt-16">
          <header className="pb-10 border-b border-[var(--rule)]">
            <SectionHead label="Contact" title="Get in touch." />
            <p className="font-serif italic text-[20px] leading-[1.55] text-[var(--ink-3)] m-0">
              Consulting and advisory work on AI adoption or operations. Founders raising. Readers of the newsletter. All welcome.
            </p>
          </header>

          <section className="pt-8 pb-14">
            {submitted ? (
              <div>
                <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--accent)] mb-3">
                  — Sent
                </div>
                <h3 className="font-serif font-normal text-[32px] -tracking-[0.015em] leading-[1.2] text-[var(--ink)] m-0">
                  Thanks. I&rsquo;ll reply within 48 hours.
                </h3>
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
                  <div
                    className="mb-4 font-mono text-[11px] tracking-[0.14em] uppercase"
                    style={{ color: 'var(--accent)' }}
                  >
                    {error}
                  </div>
                )}

                <label htmlFor="contact-name" className={labelClass}>
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={100}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = 'var(--ink)')}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'var(--rule)')}
                />

                <label htmlFor="contact-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={200}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = 'var(--ink)')}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'var(--rule)')}
                />

                <label htmlFor="contact-message" className={labelClass}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  maxLength={5000}
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = 'var(--ink)')}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'var(--rule)')}
                />

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={submitting || !name.trim() || !email.trim() || !message.trim()}
                    className="font-serif italic disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{
                      padding: '12px 24px',
                      border: '1px solid var(--ink)',
                      background: 'var(--ink)',
                      color: 'var(--paper)',
                      fontSize: '16px',
                    }}
                  >
                    {submitting ? 'Sending…' : 'Send →'}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
