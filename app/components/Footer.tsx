import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--neutral-700)] bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity text-[var(--neutral-50)] mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-7 h-7"
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
              <span className="text-base font-semibold">Brett Chereskin</span>
            </Link>
            <p className="text-[var(--neutral-400)] text-sm">
              Turning complexity into clarity.
            </p>
          </div>

          {/* Connect */}
          <div className="text-left md:text-right">
            <p className="text-[var(--neutral-300)] font-semibold text-sm uppercase tracking-wider mb-4">Connect</p>
            <div className="flex flex-col gap-2 md:items-end">
              <a
                href="https://www.linkedin.com/in/brettchereskin/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[var(--neutral-400)] hover:text-[var(--neutral-50)] transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
              <a
                href="https://twitter.com/BChereskin"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[var(--neutral-400)] hover:text-[var(--neutral-50)] transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Twitter / X
              </a>
              <a
                href="mailto:Brett.Chereskin@gmail.com"
                className="inline-flex items-center gap-2 text-[var(--neutral-400)] hover:text-[var(--neutral-50)] transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-[var(--neutral-700)]">
          <p className="text-[var(--neutral-500)] text-sm text-center">
            &copy; {new Date().getFullYear()} Brett Chereskin. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
