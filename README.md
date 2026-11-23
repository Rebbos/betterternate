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
| Hosting  | Netlify (primary) or Vercel: same build, same `/api` handlers              |
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

## Deploying to Netlify (one-time setup)

The site runs on Netlify or Vercel from the same code. On Netlify, `netlify.toml` holds the
build settings, security headers and SPA fallback, and `netlify/functions/api.ts` serves
`/api/*` by calling the same handlers in `/api` that Vercel uses.

1. **Import the repo:** in Netlify, choose _Add new project → Import an existing project_
   and pick this GitHub repo. Build settings come from `netlify.toml`.
2. **Add a database** (either way works):
   - _Extensions → Neon_ (Netlify DB). This sets `NETLIFY_DATABASE_URL`.
   - Or create a free project at neon.tech, region **Singapore (`aws-ap-southeast-1`)**,
     and add its connection string as `DATABASE_URL`.
3. **Create the table:** put the connection string in `.env.local` as `DATABASE_URL`, then
   run `npm run db:migrate`.
4. **Environment variables:** in _Site configuration → Environment variables_, add
   `VITE_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` (mark it secret) and, if you skipped
   Netlify DB, `DATABASE_URL` (secret). Add your Netlify domain(s) to the Turnstile widget.
5. **Redeploy** so the build picks up the variables.

The checks under _Check after deploying_ below apply to Netlify too.

## Deploying to Vercel (one-time setup)

Deploys use **Vercel's Git integration**: every push to `main` deploys to production, and
every pull request gets its own preview URL. GitHub Actions (`.github/workflows/ci.yml`)
runs all the tests on each PR.

1. **Import the repo:** in Vercel, choose _Add New → Project_ and import this GitHub repo.
   Build settings come from `vercel.json`, so leave them as they are.
2. **Add a database:** under the project's _Storage_ tab, add **Neon** (Postgres) from the
   Marketplace and connect it to the project. This sets `DATABASE_URL` for you.
3. **Create the table:** copy the Neon connection string into your local `.env.local` as
   `DATABASE_URL`, then run:
   ```sh
   npm run db:migrate
   ```
   Run it again whenever a new file appears in `migrations/`. It only applies new ones.
4. **Turnstile:** in the Cloudflare dashboard, go to _Turnstile → Add widget_ and add your
   Vercel domain(s). In Vercel → _Settings → Environment Variables_, add:
   - `VITE_TURNSTILE_SITE_KEY`: the site key (needed at **build** time)
   - `TURNSTILE_SECRET_KEY`: the secret key (mark it **Sensitive**)
5. **Redeploy** so the build picks up the variables.

**Check after deploying:**

- `https://<your-domain>/api/health` returns `{"ok":true}`.
- Sending the contact form once works.
- This returns **403**:
  ```sh
  curl -X POST https://<your-domain>/api/contact -H 'Content-Type: application/json' -d '{}'
  ```

**Reading submissions:** use Neon's SQL editor:
`SELECT * FROM submissions ORDER BY created_at DESC;`

Security headers (CSP, nosniff, frame and permissions policies) and the SPA fallback are in
`vercel.json` and, for Netlify, `netlify.toml`. Keep the two in sync
(`tests/unit/hosting-config.test.ts` fails if they drift apart).

## Project structure

```
api/                 Form API handlers (Vercel Functions): contact.ts, feedback.ts, health.ts
netlify/functions/    api.ts: serves /api/* on Netlify using the handlers above
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
