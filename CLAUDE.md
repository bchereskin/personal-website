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

## Security
- All user input is sanitized via `app/lib/sanitize.ts` (`escapeHtml`, `sanitizeInput`)
- HTML entities escaped in all email templates (Resend)
- CSP + security headers configured in `next.config.ts`
- Admin routes protected by `ADMIN_EMAIL` allowlist in middleware + API routes
- Supabase RLS enabled on all tables

## SEO
- JSON-LD structured data: `Person` + `WebSite` in root layout, `Article` on each blog post
- RSS feed at `/feed.xml`, sitemap at `/sitemap.xml`, robots at `/robots.txt`
- Per-post OpenGraph + Twitter metadata via `generateMetadata`

## Preferences
- Keep code simple and avoid over-engineering
- Don't add unnecessary comments or docstrings
- Dark theme only — no light mode

## Roadmap

### Quick Wins (1-2 days each)
- [ ] **/now page** — What Brett is focused on right now, updated monthly. Gives repeat visitors a reason to return.
- [ ] **/uses page** — Tool stack (AI tools, productivity, hardware). Great for SEO and audience alignment.
- [ ] **Related posts / "Read Next"** — Show 2-3 related posts at bottom of each blog post (match on `category`).
- [ ] **Social share buttons** — LinkedIn, X, copy link on each blog post. Remove friction from sharing.
- [ ] **Company logo bar** — Visual logos for West Point, dub, Affirm, Army on home page. Trust signal.
- [ ] **Active navigation state** — Highlight current page in nav bar.
- [ ] **Reading list / bookshelf** — Curated books + one-sentence annotations. Could be section on /now or standalone.

### Medium Projects (3-7 days each)
- [ ] **Newsletter strategy upgrade** — Name the newsletter, pitch what subscribers get, place CTAs in 3 spots (end of posts, footer, dedicated page). Consider Buttondown for delivery/analytics.
- [ ] **Case studies / proof of work** — 2-3 narrative case studies (Problem → Approach → Result with metrics). Essential for advisory credibility.
- [ ] **Testimonials / endorsements section** — 2-4 short quotes from colleagues or founders Brett has advised.
- [ ] **Blog post table of contents** — Auto-generate from `##` headings. Improves readability + creates anchor links.
- [ ] **Reading progress bar** — Thin progress bar at top of blog posts showing scroll progress.
- [ ] **Building in public changelog** — Running log of what Brett builds on the site, with dates.

### Larger Projects (1-2 weeks+)
- [ ] **Newsletter platform migration** — Move from custom `/api/subscribe` to Buttondown or beehiiv for delivery, analytics, compliance.
- [ ] **AI "Ask Brett" chatbot** — Chatbot trained on blog posts. On-brand differentiator for AI-focused personal brand.
- [ ] **Speaking / events page** — Page for speaking engagements, panels, workshops. Creates inbound signal.

### Strategic (Ongoing, no code)
- [ ] **Sharpen niche positioning** — Lean into "the operator who builds with AI" specifically. Update hero tagline + meta descriptions.
- [ ] **LinkedIn cross-pollination** — Adapt every blog post into a LinkedIn post linking back to full piece.
- [ ] **Consistent author identity** — Same headshot, name format, bio across LinkedIn, X, website, guest posts.
