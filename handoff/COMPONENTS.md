# Components

Six small components. Use CSS variables from `globals.css`. TypeScript with React server components where possible; mark `'use client'` only on Nav (hamburger state) and Contact form.

---

## `Nav.tsx` (client)

```tsx
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
  const active = (href: string) => href === '/' ? path === '/' : path.startsWith(href);

  return (
    <header className="border-b border-[var(--rule)] bg-[var(--paper)]">
      <div className="max-w-[960px] mx-auto px-8 pt-7 pb-5 flex justify-between items-baseline">
        <Link href="/" className="flex items-baseline gap-3 text-[var(--ink)]">
          <Logo size={28}/>
          <span className="font-serif text-[22px] font-medium -tracking-[0.01em]">Brett Chereskin</span>
        </Link>
        {/* Desktop */}
        <nav className="hidden md:flex gap-7">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`font-serif italic text-base pb-0.5 ${active(l.href) ? 'text-[var(--ink)] border-b border-[var(--ink)]' : 'text-[var(--ink-3)]'}`}>
              {l.label}
            </Link>
          ))}
        </nav>
        {/* Mobile hamburger */}
        <button className="md:hidden font-mono text-xs uppercase tracking-[0.18em] text-[var(--ink-3)]" onClick={()=>setOpen(!open)}>
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      {open && (
        <nav className="md:hidden px-8 pb-6 flex flex-col gap-4 border-t border-[var(--rule)] pt-4">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={()=>setOpen(false)}
              className={`font-serif italic text-lg ${active(l.href) ? 'text-[var(--ink)]' : 'text-[var(--ink-3)]'}`}>
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
```

---

## `Footer.tsx`

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-[var(--rule)] mt-24 py-10 px-8">
      <div className="max-w-[960px] mx-auto flex justify-between items-baseline">
        <div className="font-serif italic text-sm text-[var(--ink-3)]">Brett Chereskin · written from New York</div>
        <div className="flex gap-4 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-4)]">
          <a href="mailto:brett@...">Email</a>
          <a href="https://www.linkedin.com/in/...">LinkedIn</a>
          <a href="https://x.com/...">X</a>
        </div>
      </div>
    </footer>
  );
}
```

---

## `SectionHead.tsx`

```tsx
export default function SectionHead({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-7">
      <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--ink-4)] mb-2.5">— {label}</div>
      <h2 className="font-serif text-[42px] font-normal m-0 -tracking-[0.015em] leading-[1.1] text-[var(--ink)]">{title}</h2>
    </div>
  );
}
```

---

## `PhotoFrame.tsx`

```tsx
import Image from 'next/image';
export default function PhotoFrame({ src, alt, aspect='3/4' }: { src: string; alt: string; aspect?: string }) {
  return (
    <div className="relative overflow-hidden border border-[var(--rule)] bg-[var(--paper-2)]" style={{ aspectRatio: aspect }}>
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 280px"
        className="object-cover" style={{ filter: 'grayscale(1) contrast(1.05)' }}/>
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(26, 24, 20, 0.35)' }}/>
    </div>
  );
}
```

---

## `PostRow.tsx`

```tsx
import Link from 'next/link';
type Post = { slug: string; category: string; date: string; readTime: string; title: string; excerpt: string };

export default function PostRow({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block py-6 border-t border-[var(--rule)]">
      <div className="flex justify-between items-baseline mb-1.5 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-4)]">
        <span>{post.category}</span>
        <span>{post.date} · {post.readTime}</span>
      </div>
      <h3 className="font-serif text-[28px] font-normal m-0 mb-1.5 -tracking-[0.015em] leading-[1.2] text-[var(--ink)]">{post.title}</h3>
      <p className="font-serif italic text-[17px] leading-[1.6] text-[var(--ink-3)] m-0">{post.excerpt}</p>
    </Link>
  );
}
```

---

## `CareerRow.tsx`

```tsx
type Career = { range: string; role: string; org: string; loc: string; body: string; current?: boolean };

export default function CareerRow({ item }: { item: Career }) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-7 py-5 border-t border-[var(--rule)] items-baseline">
      <div className="font-mono text-[11px] tracking-[0.14em]" style={{ color: item.current ? 'var(--accent)' : 'var(--ink-4)' }}>
        {item.range}
      </div>
      <div>
        <div className="font-serif text-[20px] -tracking-[0.01em] text-[var(--ink)]">
          {item.role} <span className="italic text-[var(--ink-3)]">at {item.org}</span>
        </div>
        <p className="font-serif text-base leading-[1.6] text-[var(--ink-3)] mt-1.5 m-0">{item.body}</p>
      </div>
    </div>
  );
}
```

---

## `Logo.tsx`

```tsx
export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={Math.round(size * 108 / 68)} height={size} viewBox="0 0 108 68"
      role="img" aria-label="Brett Chereskin" className="text-[var(--ink)]">
      <g fill="currentColor" opacity="0.35">
        <path d="M28 42 Q12 38 0 44 Q14 40 26 44 Z"/>
        <path d="M80 42 Q96 38 108 44 Q94 40 82 44 Z"/>
      </g>
      <g fill="currentColor" opacity="0.6">
        <path d="M30 38 Q14 32 2 34 Q16 32 28 36 Z"/>
        <path d="M78 38 Q94 32 106 34 Q92 32 80 36 Z"/>
      </g>
      <g fill="currentColor">
        <path d="M32 34 Q18 28 6 28 Q20 28 30 32 Z"/>
        <path d="M76 34 Q90 28 102 28 Q88 28 78 32 Z"/>
      </g>
      <g transform="translate(22 6)">
        <path d="M32 4 L56 12 V32 C56 44 46 54 32 60 C18 54 8 44 8 32 V12 Z"
          fill="var(--paper)" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M34 14 L22 34 H30 V48 L42 28 H34 Z" fill="currentColor"/>
      </g>
      <path d="M54 0 L55 3 L58 4 L55 5 L54 8 L53 5 L50 4 L53 3 Z" fill="var(--accent)"/>
    </svg>
  );
}
```
