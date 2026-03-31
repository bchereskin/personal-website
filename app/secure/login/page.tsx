'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createSupabaseBrowser } from '@/app/lib/supabase-browser';

function SecureLoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '';
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setStatus('sending');

    const supabase = createSupabaseBrowser();
    const callbackUrl = `${window.location.origin}/auth/callback${redirect ? `?next=${encodeURIComponent(redirect)}` : ''}`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callbackUrl },
    });

    if (error) {
      setError('Something went wrong. Please try again.');
      setStatus('error');
      return;
    }

    setStatus('sent');
  }

  const inputClass =
    'w-full bg-[var(--neutral-800)] border border-[var(--neutral-600)] rounded-lg px-4 py-3 text-[var(--neutral-100)] placeholder-[var(--neutral-500)] focus:outline-none focus:border-[var(--primary)] transition-colors text-sm';

  return (
    <>
      {status === 'sent' ? (
        <div className="glass rounded-2xl p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[var(--neutral-50)] mb-2">Check your email</h2>
          <p className="text-sm text-[var(--neutral-400)]">
            We sent a login link to <span className="text-[var(--neutral-200)]">{email}</span>. Click the link to access this page.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8">
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-[var(--accent-dark)]/40 border border-[var(--accent-dark)] text-[var(--neutral-100)] text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="secure-email" className="block text-sm text-[var(--neutral-300)] mb-1.5">Email</label>
            <input
              id="secure-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--background)] font-semibold text-sm hover:bg-[var(--primary-light)] disabled:opacity-50 transition-colors"
          >
            {status === 'sending' ? 'Sending link...' : 'Send login link'}
          </button>
        </form>
      )}
    </>
  );
}

export default function SecureLogin() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
              <path d="M20 2L4 9v10c0 9.4 6.8 18.2 16 20.4C29.2 37.2 36 28.4 36 19V9L20 2z" fill="var(--primary)" fillOpacity="0.2" stroke="var(--primary)" strokeWidth="2"/>
              <rect x="15" y="14" width="10" height="12" rx="2" stroke="var(--primary)" strokeWidth="2" fill="none"/>
              <path d="M17 14v-3a3 3 0 0 1 6 0v3" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--neutral-50)]">Secure Page</h1>
          <p className="text-[var(--neutral-500)] text-sm mt-1">Enter your email to access this page</p>
        </div>

        <Suspense fallback={<div className="glass rounded-2xl p-8 text-center text-[var(--neutral-500)] text-sm">Loading...</div>}>
          <SecureLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
