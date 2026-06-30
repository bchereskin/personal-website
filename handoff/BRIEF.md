# Personal Website Redesign — Claude Code Handoff

**Owner:** Brett Chereskin
**Site:** personal portfolio, blog, contact
**Stack:** existing Next.js app (App Router) in `bchereskin/personal-website`
**Design source:** approved mockup at `ui_kits/website_v2/` in the Brett Chereskin Design System project
**Date:** 2026-04

---

## What's changing

Take the current site (dark-mode earthy palette, centered hero, generic imagery, heavy military framing) and rebuild the four top-line pages — **Home, About, Blog, Contact** — into the new "Field Notes" direction.

The new direction is:

- **Warm light mode** on cream paper. No dark mode.
- **Editorial / serif-led** layout, single 960px column on home/blog, 760px on about/contact.
- **Fintech + AI operator** is the primary positioning. Veteran/West Point is the closer, not the opener.
- **One accent color:** ink blue `#1f4a7a`. Used sparingly — eyebrows, active states, one bolt in the logo.
- **Custom shield-and-wings mark with an AI spark.** Full SVG below.

Keep the existing Supabase + MDX blog pipeline, subscribe form, analytics, and routing. Only the visual layer and copy on the four pages change.

---

## Design tokens

Drop these into `app/globals.css` (replacing the current `:root`):

```css
:root {
  /* Paper — warm off-white, layered */
  --paper:   #efe9db;
  --paper-2: #e6dfcc;
  --paper-3: #dcd3bc;

  /* Ink — warm near-black */
  --ink:   #1a1814;
  --ink-2: #322d24;
  --ink-3: #6a6355;  /* body */
  --ink-4: #9a9180;  /* meta / eyebrow */

  /* Rule */
  --rule: #c9bf9f;

  /* Single accent — ink blue, tech-forward, quietly confident */
  --accent: #1f4a7a;

  /* Type */
  --font-serif: 'Source Serif 4', Georgia, serif;
  --font-sans:  'Inter Tight', ui-sans-serif, system-ui, sans-serif;
  --font-mono:  'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;

  /* Type scale (px) */
  --fs-display: clamp(44px, 5vw, 72px);  /* h1 */
  --fs-h2:      42px;
  --fs-h3:      30px;
  --fs-lead:    22px;
  --fs-body:    18px;
  --fs-small:   16px;
  --fs-meta:    11px;  /* mono eyebrows */

  /* Spacing */
  --col-wide:  960px;
  --col-read:  760px;
  --col-form:  640px;

  --pad-page-y: 64px;
  --pad-sec-y:  56px;
}

html, body { background: var(--paper); color: var(--ink); }
body { font-family: var(--font-sans); }
```

Google Fonts (add to `app/layout.tsx`):

```ts
import { Source_Serif_4, Inter_Tight, JetBrains_Mono } from "next/font/google";
const serif = Source_Serif_4({ subsets:['latin'], variable:'--font-serif' });
const sans  = Inter_Tight({ subsets:['latin'], variable:'--font-sans' });
const mono  = JetBrains_Mono({ subsets:['latin'], variable:'--font-mono' });
// apply classes on <html>
```

Remove `Geist`, `Geist Mono`, `Newsreader` if no other page depends on them.

---

## Logo — `public/logo.svg`

Final mark: **Shield + Wings Underlay + AI Spark (08b)**. Replace `public/logo.svg` with this exact file:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 68" role="img" aria-label="Brett Chereskin">
  <!-- Back wings (faintest) -->
  <g fill="currentColor" opacity="0.35">
    <path d="M28 42 Q12 38 0 44 Q14 40 26 44 Z"/>
    <path d="M80 42 Q96 38 108 44 Q94 40 82 44 Z"/>
  </g>
  <!-- Mid wings -->
  <g fill="currentColor" opacity="0.6">
    <path d="M30 38 Q14 32 2 34 Q16 32 28 36 Z"/>
    <path d="M78 38 Q94 32 106 34 Q92 32 80 36 Z"/>
  </g>
  <!-- Front wings -->
  <g fill="currentColor">
    <path d="M32 34 Q18 28 6 28 Q20 28 30 32 Z"/>
    <path d="M76 34 Q90 28 102 28 Q88 28 78 32 Z"/>
  </g>
  <!-- Shield -->
  <g transform="translate(22 6)">
    <path d="M32 4 L56 12 V32 C56 44 46 54 32 60 C18 54 8 44 8 32 V12 Z"
      fill="#efe9db" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- Lightning bolt -->
    <path d="M34 14 L22 34 H30 V48 L42 28 H34 Z" fill="currentColor"/>
  </g>
  <!-- AI spark above shield — ink blue -->
  <path d="M54 0 L55 3 L58 4 L55 5 L54 8 L53 5 L50 4 L53 3 Z" fill="#1f4a7a"/>
</svg>
```

Usage: `<svg>` inline, `color: var(--ink)` → shield/wings render black; spark always stays blue. Size in nav: 28px tall. Favicon: same file, via `app/icon.svg`.

---

## Page specs

See `PAGES.md` for full markup and copy for Home, About, Blog, and Contact.

## Copy

See `COPY.md` for all strings (bio, career, post titles, contact text). Designed to be dropped directly into the page files.

## Components

See `COMPONENTS.md` for the 6 small components you'll build: `Nav`, `Footer`, `SectionHead`, `PhotoFrame`, `PostRow`, `CareerRow`.

---

## Acceptance

- [ ] All four pages render on the new tokens
- [ ] Logo replaced site-wide (nav + favicon)
- [ ] Dark mode removed (light-only)
- [ ] Old palette classes (`--background`, `--neutral-*`, etc.) deleted
- [ ] Mobile: single column, nav collapses to hamburger
- [ ] Lighthouse: passes current baselines
- [ ] Blog content source (Supabase/MDX) unchanged — only rendering styles update
