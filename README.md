# Better Ternate

Community-run, **unofficial** information portal for the Municipality of Ternate, Cavite.
This is NOT the official website of the Municipality of Ternate.

## Quick start

```sh
npm install
cp .env.example .env.local      # Turnstile test site key (public)
cp .dev.vars.example .dev.vars  # Turnstile test secret
npm run dev                     # http://localhost:5173 (site only)
```

## Forms and backend (contact + page feedback)

The forms post to Cloudflare Pages Functions (`functions/api`), which verify Cloudflare
Turnstile server-side and store submissions in D1.

```sh
npm run db:migrate:local   # once: creates the local D1 table
npm run pages:dev          # builds, then serves site + /api on http://localhost:8788
npm run dev                # optional, in a 2nd terminal: Vite on :5173 proxies /api to :8788
```

The example keys are Cloudflare's always-pass test keys, so forms work locally without an
account. Read submissions locally:

```sh
npx wrangler d1 execute better-ternate --local --command "SELECT * FROM submissions"
```

### Production setup (one time)

1. `npx wrangler d1 create better-ternate` and paste the `database_id` into `wrangler.toml`.
2. `npm run db:migrate:remote`
3. Create a Turnstile widget in the Cloudflare dashboard for your domain, then:
   - set `VITE_TURNSTILE_SITE_KEY` (the public site key) as a Pages build environment variable
   - `npx wrangler pages secret put TURNSTILE_SECRET_KEY` (never commit it)

Security headers (CSP etc.) for all pages are in `public/_headers`.

Scripts: `lint`, `format`, `typecheck`, `test`, `test:e2e`, `validate:content`, `build:search`.

Full docs come in Phase 9. Code: MIT. `/content`: CC BY 4.0.
