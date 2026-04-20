'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Logo from './Logo';

const links = [
  { href: '/',        label: 'home'    },
  { href: '/about',   label: 'about'   },
  { href: '/blog',    label: 'blog'    },
  { href: '/contact', label: 'contact' },
];

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === '/' ? path === '/' : path.startsWith(href));

  return (
    <header className="border-b border-[var(--rule)] bg-[var(--paper)]">
      <div className="max-w-[960px] mx-auto px-8 pt-7 pb-5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 text-[var(--ink)]">
          <Logo size={28} />
          <span className="font-serif text-[22px] font-medium -tracking-[0.01em] leading-none">
            Brett Chereskin
          </span>
        </Link>

        <nav className="hidden md:flex gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-serif italic text-base pb-0.5 transition-colors ${
                active(l.href)
                  ? 'text-[var(--ink)] border-b border-[var(--ink)]'
                  : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden font-mono text-xs uppercase tracking-[0.18em] text-[var(--ink-3)]"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="md:hidden px-8 pb-6 flex flex-col gap-4 border-t border-[var(--rule)] pt-4"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`font-serif italic text-lg ${
                active(l.href) ? 'text-[var(--ink)]' : 'text-[var(--ink-3)]'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
