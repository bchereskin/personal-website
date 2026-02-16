# Claude Code Context — Brett Chereskin's Personal Website

## Project Overview
Personal portfolio and blog for Brett Chereskin — COO at dub, West Point grad, Army veteran.

## Tech Stack
- **Next.js 16** with App Router
- **React 19** + **TypeScript 5** (strict mode)
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- Dark theme only (earthy palette: sage green `#7d9a78`, warm copper `#c4785a`)

## Key Commands
```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

## Project Structure
```
app/
  page.tsx           # Home page
  about/             # About page
  blog/
    page.tsx         # Blog listing
    posts.ts         # All blog post data (source of truth)
    [slug]/page.tsx  # Individual post renderer
  contact/           # Contact page
  components/        # Shared components (AnimatedSection, AnimatedCard, etc.)
  hooks/             # Custom React hooks (scroll animations)
  globals.css        # CSS variables, animations, utility classes
public/              # Static assets (Headshot.jpeg, logos, SVGs)
```

## Blog System
- All posts live in `app/blog/posts.ts` as a TypeScript array — no database, no MDX files
- `BlogPost` interface: `slug`, `title`, `excerpt`, `date` (YYYY-MM-DD), `readTime`, `category`, `content`
- Content uses a custom markdown-like format parsed in `[slug]/page.tsx`:
  - `## Heading` / `### Heading` for headers
  - `**bold**` for bold text
  - `- item` for bullet points
  - `[MODEL]` blocks for special model comparison cards
- To add a new post: add an entry to the array in `posts.ts`

## Styling Conventions
- CSS custom properties for all colors (`--primary`, `--accent`, `--neutral-*`, etc.)
- Use Tailwind arbitrary values like `bg-[var(--background)]` to reference CSS vars
- Key utility classes defined in `globals.css`: `glass`, `gradient-text`, `gradient-orb`, `hover-lift`, `link-underline`
- Staggered animations use `delay-100`, `delay-200`, etc.
- All pages/components use `'use client'` directive
- Scroll animations via IntersectionObserver (see hooks/)

## Image Handling
- Local images in `/public` — use Next.js `<Image>` component
- Remote images from Unsplash are allowed via `next.config.ts`

## Preferences
- Keep code simple and avoid over-engineering
- Don't add unnecessary comments or docstrings
- Dark theme only — no light mode
