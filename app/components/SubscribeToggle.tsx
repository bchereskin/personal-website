'use client';

import { useState } from 'react';
import SubscribeForm from './SubscribeForm';

export default function SubscribeToggle() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShow(!show)}
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--neutral-400)] hover:text-[var(--primary)] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {show ? 'Hide' : 'Subscribe for updates'}
      </button>
      {show && (
        <div className="mt-4 max-w-md">
          <SubscribeForm />
        </div>
      )}
    </div>
  );
}
