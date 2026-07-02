# brettchereskin.com

Personal site, blog, and content platform for Brett Chereskin — fintech operator, AI practitioner, West Point grad, and Army veteran. Built and maintained with AI-assisted development; several of the posts document that process.

**Live:** [brettchereskin.com](https://www.brettchereskin.com)

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4**
- **Supabase** — Postgres for blog posts, comments, contacts, subscribers, shared/secure pages, and the crypto-strategy dashboard tables (RLS on every table)
- **Resend** — transactional email (contact, subscriber notifications)
- **Vercel** — hosting, cron, analytics

Design system: warm "Field Notes" light theme — cream paper, near-black ink, a single ink-blue accent, serif display type (Source Serif 4).

## Structure

```
app/
  page.tsx            Home
  about/ favorites/ contact/
  blog/               Blog listing + [slug] renderer (Supabase-backed)
  lab/                "The Lab" — technical / build-in-public track
  dashboard/          Live AI crypto-strategy dashboard
  admin/              Admin dashboard (ADMIN_EMAIL allowlist)
  shared/[slug]/      Hosted HTML pages (strict per-response CSP)
  secure/[slug]/      Auth-gated pages (magic link + RLS)
  api/                Public + admin route handlers
  components/ lib/ hooks/
backtest/             Python crypto-strategy backtest harness
mcp-server/           MCP server for publishing hosted pages
```

Blog and Lab posts share one `blog_posts` table, split by a `track` column (`notes` vs `lab`). Content uses a small custom markup parsed by `components/BlogRenderer.tsx` (`##`/`###`, `**bold**`, `*italic*`, `- bullets`, `[CALLOUT]`, `[MODEL]`, `[IMAGE]`, `[QUOTE]`, `[text](url)`).

## Develop

```bash
npm install
npm run dev      # localhost:3000
npm run build    # production build
npm run lint     # ESLint (app code only)
```

Requires a `.env.local` with Supabase, Resend, `ADMIN_EMAIL`, and `PUBLISH_API_KEY` values — see `.env.local.example`.

## Notes

- Dark theme is gone; the site is light-only.
- Supabase signups stay disabled — secure-page users are pre-created, not self-registered.
- The dashboard's backtest table reads from the `backtest_results` table, which `backtest/run.py` keeps in sync.
