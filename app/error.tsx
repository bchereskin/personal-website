'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="bg-[var(--paper)] text-[var(--ink)] min-h-screen flex items-center">
      <div className="max-w-[560px] mx-auto px-8 py-20 text-center">
        <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--ink-4)] mb-3">
          Something went wrong
        </div>
        <h1 className="font-serif text-[32px] leading-[1.1] -tracking-[0.02em] mb-4">
          This page hit a snag.
        </h1>
        <p className="font-serif italic text-[18px] leading-[1.6] text-[var(--ink-3)] mb-8">
          Usually this is a temporary hiccup talking to the database. Try again in a
          moment — and if it keeps happening, let me know.
        </p>
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={reset}
            className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink)] border-b border-[var(--ink)] pb-0.5 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-4)] hover:text-[var(--ink)] transition-colors"
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
