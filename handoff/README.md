# Handoff — Personal Website v2

Drop this entire `handoff/` folder into the root of `bchereskin/personal-website`, then open Claude Code in that repo and paste `CLAUDE_CODE_PROMPT.md`.

## Contents

| File | Purpose |
|---|---|
| `BRIEF.md` | Tokens, final logo SVG, acceptance criteria |
| `PAGES.md` | Per-page layout specs (Home, About, Blog, Contact) |
| `COPY.md` | All strings, ready to drop in |
| `COMPONENTS.md` | Nav, Footer, SectionHead, PhotoFrame, PostRow, CareerRow, Logo — full source |
| `data/career.ts` | Career timeline data for the About page |
| `CLAUDE_CODE_PROMPT.md` | What to paste into Claude Code to kick off the build |

## Design reference

The approved mockup lives in `ui_kits/website_v2/index.html` in the Brett Chereskin Design System project. If anything's ambiguous, that's the source of truth.

## What's shipping

- **Direction:** Field Notes (editorial, serif-led, warm light)
- **Logo:** Shield + wings underlay + AI spark (variant 08b)
- **Accent:** Ink blue `#1f4a7a` — fintech/tech-forward, used sparingly
- **Positioning:** Fintech operator → AI practitioner → angel investor → veteran (in that order, always)

## What's NOT changing

- Blog data pipeline (Supabase + MDX)
- Subscribe form
- Analytics / middleware / auth
- Post detail pages — prose styles update but routing stays

## After the first pass

Once the four pages ship, next phases:
- Real headshot into `public/photos/brett.jpg`
- Replace seed blog posts with real ones
- OG images per post using the new tokens
- Case studies / work section (currently not scoped)
