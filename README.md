# Better Ternate

A community-run, **unofficial** information portal for the Municipality of Ternate, Cavite,
Philippines. It organizes local government information by what people need to do
("Get a barangay clearance", "Call the fire station") in English and Filipino, and works
well on cheap Android phones on slow mobile data, even offline for hotlines.

> **This is NOT the official website of the Municipality of Ternate.** Every page says so
> and links to official channels. Most content is currently **sample data**: names are
> "John Doe" placeholders and every placeholder record is marked `"sample": true`.

Inspired by [BetterGov.ph](https://bettergov.ph) and its LGU forks, with its own visual
identity.

## Stack

| Area     | Choice                                                                     |
| -------- | -------------------------------------------------------------------------- |
| App      | React 19, TypeScript, Vite, React Router (lazy routes)                     |
| Styling  | Tailwind CSS v4 driven entirely by design tokens (`src/styles/tokens.css`) |
| Language | react-i18next, English + Filipino (`src/i18n/locales`)                     |
| Content  | Markdown + JSON in `/content`, validated with zod at build time            |
| Search   | fuse.js over a prebuilt index; works offline                               |
| Offline  | Service worker (vite-plugin-pwa) precaches the app, content and search     |
| Hosting  | Vercel (static site + Functions + Cron); Netlify backup, deployments off   |
| Forms    | Cloudflare Turnstile (verified server-side) → Postgres (Neon)              |
| Tests    | Vitest + Testing Library, Playwright + axe, Lighthouse CI                  |

## Local setup

Requires Node 22+.

```sh
npm install
cp .env.example .env.local   # test keys; works without any accounts
npm run dev                  # http://localhost:5173 (site AND /api)
```

`npm run dev` also runs the form API (`/api/*`) locally. Without `DATABASE_URL`, submitted
forms are **logged to the terminal instead of stored**, so you don't need a database to
work on the site.

### Environment variables

| Name                      | Where       | Purpose                                            |
| ------------------------- | ----------- | -------------------------------------------------- |
| `VITE_TURNSTILE_SITE_KEY` | browser     | Turnstile site key (public)                        |
| `TURNSTILE_SECRET_KEY`    | server only | Turnstile secret, used by `/api` to verify tokens  |
| `DATABASE_URL`            | server only | Postgres connection string; optional locally       |
| `NETLIFY_DATABASE_URL`    | server only | Set by Netlify DB; used if `DATABASE_URL` is empty |
| `CRON_SECRET`             | server only | Authorizes Vercel Cron calls to `/api/purge-old`   |

`.env.example` ships Cloudflare's published **always-pass test keys**
(`1x00000000000000000000AA` / `1x0000000000000000000000000000000AA`): the widget passes
without interaction and siteverify always says yes. Useful variants: `2x…` keys always
fail, `3x…` force an interactive challenge. **Never deploy with test keys**: that turns
bot protection off.

### Scripts

| Command                    | What it does                                                      |
| -------------------------- | ----------------------------------------------------------------- |
| `npm run dev`              | Dev server with hot reload + local `/api`                         |
| `npm run build`            | Validate content → build search index → typecheck → build         |
| `npm run preview`          | Serve the production build (service worker active)                |
| `npm run validate:content` | Check everything in `/content` against the schemas                |
| `npm run lint` / `format`  | ESLint / Prettier                                                 |
| `npm run typecheck`        | TypeScript                                                        |
| `npm test`                 | Unit + API tests (Vitest)                                         |
| `npm run test:e2e`         | Browser tests at 4 viewports + axe accessibility (Playwright)     |
| `npm run lhci`             | Lighthouse CI with mobile budgets (needs Chrome or `CHROME_PATH`) |
| `npm run db:migrate`       | Apply `migrations/*.sql` to `DATABASE_URL`                        |

## Deploying (Vercel primary, Netlify backup)

**Vercel** is the live site: https://betterternate.vercel.app. Deploys use Vercel's Git
integration: every push to `main` deploys to production, and every pull request gets its
own preview URL. GitHub Actions (`.github/workflows/ci.yml`) runs all the tests on each PR.
`vercel.json` holds the build command, security headers, SPA fallback and the daily cron.

### Vercel (one-time setup)

1. **Import the repo:** in Vercel, choose _Add New → Project_ and import this GitHub repo.
   Build settings come from `vercel.json`. Set _Settings → Functions → Region_ to
   **Singapore (`sin1`)**, next to the database.
2. **Database (Neon Postgres via the Vercel Marketplace, free):** in the Vercel project,
   open _Storage → Create Database → Neon_, pick **Singapore**, and connect it to the
   project for all environments. Vercel sets `DATABASE_URL` (pooled) and
   `DATABASE_URL_UNPOOLED` (direct) for you. If it offers a separate database branch
   for **Preview** deployments, turn it on, so test submissions never land in real
   data. Open the database in Neon's console from _Storage → your database → Open in
   Neon_ (that's where the SQL editor is). `neon.ts` holds the Neon service settings for
   the Neon CLI; it isn't required for the site to run.
3. **Other environment variables** (_Settings → Environment Variables_, mark secrets
   **Sensitive**):

   | Name                      | Production                               | Preview      |
   | ------------------------- | ---------------------------------------- | ------------ |
   | `CRON_SECRET`             | any long random string                   | (not needed) |
   | `VITE_TURNSTILE_SITE_KEY` | real site key (needed at **build** time) | same         |
   | `TURNSTILE_SECRET_KEY`    | real secret key                          | same         |

   For local development, copy the variables into `.env.local` (the Vercel CLI does it
   with `vercel env pull .env.local`). Never commit that file.

4. **Migrations run automatically:** production builds run `npm run db:migrate` before
   building (`buildCommand` in `vercel.json`); it uses `DATABASE_URL_UNPOOLED` and only
   applies new files in `migrations/`. Preview builds skip it. To migrate another branch
   (such as a preview database), put its strings in `.env.local` and run
   `npm run db:migrate` yourself.
5. **Turnstile:** in the Cloudflare dashboard, go to _Turnstile → your widget_ and add
   `betterternate.vercel.app` (and the Netlify domain, for the backup).
6. **Redeploy** so the build picks up the variables.

**Check after deploying:**

- `https://betterternate.vercel.app/api/health` returns `{"ok":true}`.
- Refreshing a deep link such as `/services/barangay-clearance` loads the page.
- Sending the contact form once works (a human has to do this: Turnstile).
- This returns **403**:
  ```sh
  curl -X POST https://betterternate.vercel.app/api/contact -H 'Content-Type: application/json' -d '{}'
  ```

**Reading submissions:** use Neon's SQL editor. Keep the Neon project's members to the
maintainers: submissions contain names and emails.
`SELECT * FROM submissions WHERE status = 'new' ORDER BY created_at DESC;`

**Data retention:** Vercel Cron calls `/api/purge-old` daily (`crons` in `vercel.json`,
authorized with `CRON_SECRET`) and deletes submissions older than 180 days
(`RETENTION_DAYS` in `server/retention.ts`, stated in the privacy notice). Runs show under
the project's _Cron Jobs_ and _Logs_ in Vercel.

Security headers (CSP, nosniff, frame and permissions policies) and the SPA fallback are in
`vercel.json` and, for the Netlify backup, `netlify.toml`;
`tests/unit/hosting-config.test.ts` fails if the two drift apart.

### Netlify (backup, deployments off)

Netlify deployments are **off for now**. In `netlify.toml`, `ignore = "exit 0"` cancels
every Netlify build (production, previews and branch deploys), so nothing deploys there and
no Netlify credits are spent (15 per production deploy on the Free plan). The daily purge
runs only once, on Vercel. https://betterternate.netlify.app keeps serving its last deploy
until it's removed in the Netlify dashboard.

`netlify.toml` and `netlify/` still keep the site deployable on Netlify:
`netlify/functions/api.ts` serves the same `/api` handlers and
`netlify/functions/purge-old.ts` is its daily cron. To switch Netlify back on, delete the
`ignore` line (and the test in `tests/unit/hosting-config.test.ts` that guards it), set
the same environment variables in Netlify, then push or trigger a deploy.

## Project structure

```
api/                 Vercel Functions: contact.ts, feedback.ts, health.ts, purge-old.ts (cron)
netlify/             Backup host: functions/api.ts serves the same /api handlers, purge-old.ts
server/              Shared server code: submit handler (Turnstile + zod), db.ts
content/             Volunteer-editable data
  data/*.json          hotlines, offices, officials, barangays, tourism, documents
  services/*.md        one file per service (frontmatter + notes)
  news/*.md            YYYY-MM-DD-slug.md
migrations/          Postgres schema (applied with npm run db:migrate)
public/              Static files: icons, manifest, theme-init.js, robots.txt
scripts/             validate-content, build-search-index, db-migrate, make-icons
src/
  components/ui/       Primitives (Button, Card, Badge, Alert, form controls…)
  components/layout/   Header, footer, nav, disclaimer, logo art
  components/forms/    Contact form, feedback widget, Turnstile
  components/search/   Search dialog
  i18n/locales/        en.json, fil.json (ALL UI text)
  lib/                 schemas (zod), content loaders, search, forms, formatting
  routes/              One file per page
  styles/              tokens.css (design tokens), index.css
tests/
  unit/                Vitest: components, content, schemas, search, i18n
  api/                 Vitest: API handlers (mocked Turnstile + database)
  e2e/                 Playwright: pages, navigation, search, forms, offline
```

## How theming works

All visual values live in **`src/styles/tokens.css`** as CSS variables (`--bt-*`): colors,
fonts, radii, shadows and the 44px tap size, with light and dark values. `@theme inline`
maps them to Tailwind utilities (`bg-surface`, `text-primary`, `rounded-lg`…).

Tailwind's own palette, radii, shadows and fonts are **switched off**, so components can't
hard-code a color: `bg-red-500` simply doesn't exist. To restyle the whole site, edit the
values in `tokens.css`. Keep text and background pairs at WCAG AA contrast (4.5:1) in
both modes.

The current design is "Dagat" (coastal): sea teal on sand, Bricolage Grotesque headings
(self-hosted) with the phone's system font for body text.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Found wrong information but don't code? Use the
**Report outdated info** link on any page, or open a _Data correction_ issue.

## License

Code: MIT. Content in `/content`: CC BY 4.0. See [LICENSE](LICENSE).
