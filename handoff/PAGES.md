# Page specs

All page containers use `max-width` + `margin:0 auto` + `padding: 64px 32px 0`. Serif is `var(--font-serif)`; mono is `var(--font-mono)`; sans is `var(--font-sans)` (body default).

---

## Home — `app/page.tsx`

`max-width: 960px`. Three sections, each separated by a `1px solid var(--rule)`.

### 1 · Hero — `grid-template-columns: 1fr 280px; gap: 48px; padding-bottom: 64px;`

Left column:

- **Eyebrow** (mono, 11px, `var(--accent)`, letter-spacing 0.22em, uppercase, margin-bottom 20px):
  `Fintech Operator · AI Practitioner · Angel Investor`
- **H1** (serif, `clamp(44px, 5vw, 72px)`, weight 400, letter-spacing -0.02em, line-height 1.0):
  `Brett Chereskin`
- **Lead paragraph** (serif italic, 22px, line-height 1.55, `var(--ink-2)`, max-width 560px, margin-top 28px):
  *"I'm the COO of dub, a venture-backed consumer fintech. I run operations at the edge of what AI can do — shipping internal tools that replace entire functions — and angel invest in the founders doing the same. Earlier: twelve years in the Army, West Point '06."*
- **Status line** (mono, 11px, uppercase, letter-spacing 0.16em, `var(--ink-4)`, margin-top 32px):
  `Currently: ` then `COO at dub` in `var(--ink-2)` · `New York`

Right column: `<PhotoFrame aspect="3/4" src="/photos/brett.jpg"/>` — grayscale + contrast 1.05, inset vignette.

### 2 · Recent writing — `padding: 56px 0;`

`<SectionHead label="Recent writing" title="From the notebook."/>` then the three most recent posts as `<PostRow/>` list items (see COMPONENTS.md). Link each to the post slug.

### 3 · The work — `padding: 56px 0;`

`<SectionHead label="The work" title="Three lanes, concurrently."/>` followed by an ordered list, three items. Each row: `grid-template-columns: 60px 1fr; gap: 24px; padding: 20px 0; border-top: 1px solid var(--rule);`

- `01` mono meta / **Operating.** bold serif + *body italic:* "COO of dub, a venture-backed consumer fintech. Ops, finance, HR and G&A — run lean with AI tooling I build in-house."
- `02` / **Practicing.** / "I ship real AI systems in production at a regulated company. I write about what works, what breaks, and what I've quietly retired."
- `03` / **Investing.** / "Angel investor and LP. I back operators shipping with AI. Advisory work on ops, GTM, and AI adoption inside scaling companies."

---

## About — `app/about/page.tsx`

`max-width: 760px`. Two sections.

### 1 · About — `padding-bottom: 56px; border-bottom: 1px solid var(--rule);`

`<SectionHead label="About" title="A short bio."/>`

Grid `grid-template-columns: 200px 1fr; gap: 32px; margin-top: 32px;` — photo left, prose right.

Prose (serif):

1. **Lead** (22px italic, `var(--ink)`, margin-bottom 20px):
   *"I run operations at a venture-backed fintech and ship AI systems in production."*
2. 18px body (`var(--ink-2)`, line-height 1.7, margin-bottom 16px):
   "I'm the COO of dub. My day job is turning a regulated consumer fintech into a company where one operator, leaning on AI, does the work of a team. I build a lot of the tooling myself."
3. "On the side I angel invest in founders doing the same — using AI as leverage, shipping quickly, staying close to customers. I advise a handful of scaling companies on operations and AI adoption."
4. "Before all of that: twelve years in the Army. West Point '06, Army Aviation. The operator instincts carried over; most of the specifics didn't."

### 2 · Career — `padding: 56px 0;`

`<SectionHead label="Career" title="In reverse chronology."/>`

List of `<CareerRow/>` items (see COMPONENTS.md). Data in `handoff/data/career.ts`.

The current role (dub) gets `var(--accent)` on the date range. All others `var(--ink-4)`.

---

## Blog — `app/blog/page.tsx`

`max-width: 760px`.

### Header — `padding-bottom: 40px; border-bottom: 1px solid var(--rule);`

`<SectionHead label="Writing" title="Field notes."/>`
Serif italic subhead: *"Notes from running a fintech with AI — plus the occasional piece on investing and leadership."*

### List — `padding: 24px 0 56px;`

Map all published posts into `<article>` rows. Each:

- `padding: 28px 0; border-bottom: 1px solid var(--rule);`
- Top meta row (mono, 11px, 0.14em, uppercase, `var(--ink-4)`, `justify-content: space-between`): `{category}` / `{date} · {readTime}`
- H2 (serif, 30px, weight 400, letter-spacing -0.015em, line-height 1.15, margin: 0 0 8px)
- Excerpt (serif italic, 17px, line-height 1.6, `var(--ink-3)`)
- Whole row `<Link>` to `/blog/{slug}`

Keep the Supabase-backed data source; just swap the renderer. Blog post detail page: keep existing `BlogRenderer.tsx` for prose, but update its prose styles to match these tokens (serif body, 18px, 1.7 line-height, `var(--ink-2)`).

---

## Contact — `app/contact/page.tsx`

`max-width: 640px`.

### Header — `padding-bottom: 40px; border-bottom: 1px solid var(--rule);`

`<SectionHead label="Contact" title="Get in touch."/>`
Serif italic subhead: *"Consulting and advisory work on AI adoption or operations. Founders raising. Readers of the newsletter. All welcome."*

### Form — `padding: 32px 0 56px;`

Three fields: Name, Email, Message. No boxy inputs — underlined only:

```css
input, textarea {
  border: none;
  border-bottom: 1px solid var(--rule);
  background: transparent;
  font-family: var(--font-serif);
  font-size: 20px;
  color: var(--ink);
  padding: 10px 0 12px;
  width: 100%;
  outline: none;
}
input:focus, textarea:focus { border-bottom-color: var(--ink); }
textarea { resize: vertical; min-height: 120px; }
```

Each label above its field: mono 10px, letter-spacing 0.2em, uppercase, `var(--ink-4)`, margin-top 20px.

Submit button: `padding: 12px 24px; border: 1px solid var(--ink); background: var(--ink); color: var(--paper); font-family: var(--font-serif); font-size: 16px; font-style: italic;` — text `Send →`.

On success: hide form, show
- Mono `— SENT` in `var(--accent)`
- H3 serif 32px: `Thanks. I'll reply within 48 hours.`

Keep whatever submit endpoint the existing Contact form uses.

---

## Global: Nav & Footer (used on every page)

### Nav

Sticky off (just `border-bottom: 1px solid var(--rule);`), `background: var(--paper)`.

Inner: `max-width: 960px; margin: 0 auto; padding: 28px 32px 20px; display: flex; justify-content: space-between; align-items: baseline;`

- **Left:** logo (28px) + serif 22px weight 500 `Brett Chereskin`, letter-spacing -0.01em. Gap 12px. Link to `/`.
- **Right nav:** serif 16px italic links. Active: `border-bottom: 1px solid var(--ink); padding-bottom: 2px; color: var(--ink);`. Inactive: `color: var(--ink-3)`. Gap 28px.

Mobile: collapse to hamburger below 720px. Sheet opens with same serif links stacked.

### Footer

`border-top: 1px solid var(--rule); margin-top: 96px; padding: 40px 32px;`

Inner: `max-width: 960px; margin: 0 auto; display: flex; justify-content: space-between; align-items: baseline;`

- Left: serif italic 14px `var(--ink-3)`: `Brett Chereskin · written from New York`
- Right: mono 11px uppercase letter-spacing 0.14em `var(--ink-4)`: `EMAIL · LINKEDIN · X` — each a link.
