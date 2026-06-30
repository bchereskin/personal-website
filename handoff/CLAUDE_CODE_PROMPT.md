# Prompt for Claude Code

Paste this verbatim into Claude Code inside the `personal-website` repo, after dropping the `handoff/` folder at the repo root.

---

I'm redesigning the four top-line pages of my personal website — `app/page.tsx` (home), `app/about/page.tsx`, `app/blog/page.tsx`, and `app/contact/page.tsx` — plus the shared Nav, Footer, and logo. The design is approved. Everything you need is in `handoff/`:

- `handoff/BRIEF.md` — tokens, logo SVG, acceptance criteria
- `handoff/PAGES.md` — per-page specs (layout, spacing, copy)
- `handoff/COPY.md` — all strings
- `handoff/COMPONENTS.md` — component source for Nav, Footer, SectionHead, PhotoFrame, PostRow, CareerRow, Logo
- `handoff/data/career.ts` — career timeline data

**Please:**

1. Read all four handoff docs end to end before touching code.
2. Replace `app/globals.css` `:root` with the token block from `BRIEF.md`. Delete the old dark palette (`--background`, `--foreground`, `--neutral-*`, etc.). The site is light-mode only now — strip any `dark:` classes.
3. Swap Google Fonts in `app/layout.tsx` to Source Serif 4, Inter Tight, JetBrains Mono. Remove Geist, Geist Mono, Newsreader.
4. Replace `public/logo.svg` with the SVG from `BRIEF.md` and ensure favicon (`app/icon.svg` or wherever it's referenced) uses the same mark.
5. Create the six components in `app/components/` from `COMPONENTS.md`. Keep `Nav.tsx` and the Contact form `'use client'`; the rest can be server components.
6. Rewrite the four pages per `PAGES.md`, using copy from `COPY.md`. Keep existing data sources — Supabase for blog posts, the subscribe form endpoint, analytics, any middleware. Only the visual layer and copy change.
7. For the About page career timeline, import from `handoff/data/career.ts` (move the file into `app/data/career.ts` when you integrate).
8. Keep the existing `BlogRenderer.tsx` for individual post pages but update its prose styles to match the new tokens (18px Source Serif body, 1.7 line-height, `var(--ink-2)`).
9. Make sure nothing else in the repo still references the old tokens — grep for `--neutral`, `--sage`, `--copper`, etc. and kill orphans.

**Constraints:**

- Don't add frameworks. The repo already uses Tailwind + Next.js App Router — stick to that.
- Don't regenerate the blog content pipeline. Leave Supabase + MDX alone.
- Keep TypeScript strict.
- Mobile breakpoint at 720px: nav collapses to a hamburger (see `Nav.tsx` in `COMPONENTS.md`), multi-column grids stack.
- One photo goes in `public/photos/brett.jpg` (I'll add the file). The design uses grayscale + inset vignette — that's in `PhotoFrame.tsx`.

**When you're done,** post a short summary of what you changed, what you deleted, and any decisions you made that weren't covered in the handoff. Run `next build` locally to verify nothing's broken before committing.
