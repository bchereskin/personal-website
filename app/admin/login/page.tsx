'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/app/lib/supabase-browser';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Invalid email or password.');
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  const inputClass =
    'w-full bg-[var(--neutral-800)] border border-[var(--neutral-600)] rounded-lg px-4 py-3 text-[var(--neutral-100)] placeholder-[var(--neutral-500)] focus:outline-none focus:border-[var(--primary)] transition-colors text-sm';

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
              <path d="M20 2L4 9v10c0 9.4 6.8 18.2 16 20.4C29.2 37.2 36 28.4 36 19V9L20 2z" fill="var(--primary)" fillOpacity="0.2" stroke="var(--primary)" strokeWidth="2"/>
              <path d="M14 20l4 4 8-8" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--neutral-50)]">Admin</h1>
          <p className="text-[var(--neutral-500)] text-sm mt-1">brettchereskin.com</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8">
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-[var(--accent-dark)]/40 border border-[var(--accent-dark)] text-[var(--neutral-100)] text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="admin-email" className="block text-sm text-[var(--neutral-300)] mb-1.5">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="admin-password" className="block text-sm text-[var(--neutral-300)] mb-1.5">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--background)] font-semibold text-sm hover:bg-[var(--primary-light)] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
