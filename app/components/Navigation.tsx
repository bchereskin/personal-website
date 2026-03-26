'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home', exact: true },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <nav className="fixed top-0 w-full glass z-50">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity text-[var(--neutral-50)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-9 h-9"
              role="img"
              aria-label="Brett Chereskin logo"
            >
              <path
                d="M256 32 L416 96 V288 C416 368 336 432 256 480 C176 432 96 368 96 288 V96 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="24"
                strokeLinejoin="round"
              />
              <path
                d="M256 120 L320 240 H288 V360 H224 V240 H192 Z"
                fill="currentColor"
              />
            </svg>
            <span className="text-lg font-semibold hidden sm:block">
              Brett Chereskin
            </span>
          </Link>

          <div className="flex gap-6 md:gap-8">
            {navLinks.map(({ href, label, exact }) => (
              <Link
                key={href}
                href={href}
                className={`transition-colors text-sm md:text-base ${
                  isActive(href, exact)
                    ? 'text-[var(--primary)] font-medium'
                    : 'text-[var(--neutral-400)] hover:text-[var(--neutral-50)]'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
