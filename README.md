# Sarah Chen — Portfolio

A typography-forward portfolio for Sarah Chen, freelance brand designer.

## What was built

- **Astro 6** (SSR via `@astrojs/vercel`) + **Tailwind v4** (`@tailwindcss/vite`).
- **Home** — hero, 6-project featured grid, capabilities strip.
- **Work index** `/work` — full grid of projects from Supabase.
- **Work detail** `/work/[slug]` — dynamic pages pulling from Supabase, with next-project nav.
- **About** `/about` — bio, practice notes, selected clients, recognition.
- **Contact** `/contact` — form posting to `/api/contact`, stores submissions in Supabase, sends email via Resend to `sarah@example.com`.
- **SEO** — dynamic `sitemap.xml`, `robots.txt`, Person + CreativeWork JSON-LD, OpenGraph/Twitter tags, canonical URLs.
- **Harbor hook** — `content` table in Supabase for future articles.

## Environment

Copy `.env.example` to `.env` and fill:

```
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
CONTACT_TO_EMAIL=sarah@example.com
PUBLIC_SITE_URL=https://your-domain.com
```

## Run

```bash
npm install
npm run dev
```

## Database

Supabase tables:

- `projects` — portfolio work (public read where `published = true`)
- `content` — Harbor articles (public read)
- `contact_submissions` — form inbox (public insert only)

## Next steps (manual)

- Swap placeholder project copy/images for real work.
- Point `sarah@example.com` to a real inbox and update `CONTACT_TO_EMAIL`.
- Verify a sending domain in Resend and update the `from` address in `src/lib/email.ts`.
- Connect a custom domain in Vercel and update `PUBLIC_SITE_URL`.
