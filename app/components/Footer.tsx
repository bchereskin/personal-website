import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--rule)] mt-24 py-10 px-8">
      <div className="max-w-[960px] mx-auto flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-baseline">
        <div className="font-serif italic text-sm text-[var(--ink-3)]">
          Brett Chereskin · written from New York
        </div>
        <div className="flex gap-4 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-4)]">
          <Link href="/lab" className="hover:text-[var(--ink)] transition-colors">
            The Lab
          </Link>
          <a
            href="mailto:Brett.Chereskin@gmail.com"
            className="hover:text-[var(--ink)] transition-colors"
          >
            Email
          </a>
          <a
            href="https://www.linkedin.com/in/brettchereskin/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--ink)] transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://x.com/BChereskin"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--ink)] transition-colors"
          >
            X
          </a>
        </div>
      </div>
    </footer>
  );
}
