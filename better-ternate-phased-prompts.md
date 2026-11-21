# Better Ternate — Phased Build Prompts

How to use this:
- **Phase 0** is the shared context. Save it in the repo as `CLAUDE.md` (or `AGENTS.md` / `.cursorrules`) so every later session picks it up automatically. If your tool doesn't read those files, paste Phase 0 above each phase prompt.
- Run **one phase per session**. Review the result, commit, then move on.
- The look of the site is **deliberately left open** until Phase 7, so you can explore directions with your design/taste skill. Phases 1–6 build on neutral **design tokens** that the visual phase can restyle without touching logic.
- Each phase ends with a **stop point**. The AI should stop and report back instead of continuing on its own.

---

## Phase 0 — Project context (save as `CLAUDE.md`)

```
# Better Ternate — Project Context

## Role
You are a senior full-stack developer experienced in Philippine civic-tech projects.
You build fast, accessible, mobile-first portals that work on cheap Android phones on
slow mobile data. You write clean TypeScript, keep dependencies minimal, and explain
decisions briefly.

## Project
Better Ternate is a community-run, UNOFFICIAL information portal for the Municipality of
Ternate, Cavite, Philippines, modeled on BetterGov.ph and its LGU forks (Better Naic,
Better Indang, Better Los Baños, lgu.bettergov.ph). Content is organized by what people
are trying to do ("Get a barangay clearance"), not by office org chart.
This is a sample/demo site. Every page shows a notice that it is NOT the official
website of the Municipality of Ternate and links to official channels.

## Stack (do not change without asking)
- React 19 + TypeScript + Vite, React Router (lazy routes)
- Tailwind CSS v4; BetterGov "Kapwa" design system (@bettergov/kapwa) available as a base
- react-i18next (English + Filipino), lucide-react icons, fuse.js search, zod schemas
- Content as JSON + Markdown in /content (edited by volunteers via PR)
- Cloudflare Pages (hosting) + Pages Functions (/functions) + D1 (form storage)
- Cloudflare Turnstile on all public forms, verified server-side
- Vitest + React Testing Library, Playwright (+ @axe-core/playwright)
- ESLint, Prettier, Husky + lint-staged, GitHub Actions

## Standing rules
1. Mobile-first. Base styles target 360px; scale at sm 640 / md 768 / lg 1024 / xl 1280.
   Tap targets >= 44px. No horizontal scroll.
2. WCAG 2.1 AA: semantic HTML, skip link, visible focus, labels, alt text, AA contrast,
   keyboard navigation.
3. ALL visual styling goes through design tokens (CSS variables in src/styles/tokens.css,
   mapped into Tailwind @theme). Components must not hard-code colors, fonts, radii,
   or shadows. The visual design will be swapped later; logic must not depend on it.
4. All UI strings go in src/i18n/locales/{en,fil}.json. Never hard-code text.
5. ALL people and contact info are "John Doe" placeholders for now. Never use real
   names of officials, staff, or residents, and never invent real-looking data.
   - People: "John Doe" (add a role/number if needed, e.g. "John Doe (Mayor)",
     "John Doe 2"). Female roles may use "Jane Doe".
   - Phone: "0900-000-0000"   Email: "johndoe@example.com"
   - Address: "123 Sample St., Ternate, Cavite"   Fees: "₱0.00 (sample)"
   Every placeholder record has "sample": true so it can be found and replaced later.
6. Never commit secrets. Use .env / .dev.vars and provide *.example files.
7. After each task run: npm run lint && npm run typecheck && npm test. Fix failures.
8. Stop at the end of each phase and report: what was built, files changed, how to
   check it, and open questions. Do not start the next phase unless asked.
```

---

## Phase 1 — Scaffold and repository structure

```
Phase 1: Scaffold the Better Ternate repository.

Tasks:
1. Create a Vite + React 19 + TypeScript project named better-ternate.
2. Install and configure: Tailwind CSS v4 (@tailwindcss/vite), React Router,
   react-i18next, lucide-react, zod, fuse.js. Dev: ESLint (flat config), Prettier,
   Husky + lint-staged, Vitest + React Testing Library, Playwright, wrangler.
3. Create this folder structure (empty files or minimal stubs are fine):

better-ternate/
├── .github/
│   ├── workflows/            # (filled in Phase 9)
│   ├── ISSUE_TEMPLATE/       # bug_report.md, data_correction.md
│   └── pull_request_template.md
├── content/
│   ├── services/             # Markdown, one file per service
│   ├── news/                 # Markdown posts
│   └── data/                 # hotlines.json, officials.json, barangays.json,
│                             # offices.json, tourism.json
├── functions/
│   ├── api/                  # contact.ts, feedback.ts, health.ts
│   └── _middleware.ts
├── migrations/               # D1 SQL migrations
├── public/                   # favicon, robots.txt, manifest, images/
├── scripts/                  # build-search-index.ts, validate-content.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/               # one lazy-loaded file per page
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   ├── forms/
│   │   ├── search/
│   │   └── maps/
│   ├── hooks/
│   ├── lib/
│   ├── i18n/locales/         # en.json, fil.json
│   ├── styles/               # index.css, tokens.css
│   └── types/
├── tests/
│   ├── unit/
│   └── e2e/
├── .env.example
├── .dev.vars.example
├── wrangler.toml
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
├── package.json
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE                   # MIT for code; note CC BY 4.0 for /content
└── README.md

4. package.json scripts: dev, build, preview, lint, format, typecheck, test, test:e2e,
   validate:content, build:search, pages:dev (wrangler pages dev).
5. Set up path alias @/ -> src/.
6. Render one placeholder home route at "/" so `npm run dev` works.

Stop point: show the final tree, package.json, and confirm dev, lint, typecheck, and
test all pass.
```

---

## Phase 2 — Design tokens and responsive layout shell (neutral look)

```
Phase 2: Build the layout shell with a NEUTRAL, token-driven look.
Keep visuals plain (wireframe-quality grayscale + one accent). The real visual design
comes in Phase 7, so make everything easy to restyle.

Tasks:
1. src/styles/tokens.css: define CSS variables for color (bg, surface, text, muted,
   border, primary, primary-contrast, success, warning, danger, info), font families
   (sans, heading), font sizes scale, radii, shadows, spacing rhythm, and a dark-mode
   override via [data-theme="dark"] and prefers-color-scheme.
   Map them into Tailwind v4 with @theme so classes like bg-surface, text-muted work.
2. Base UI primitives in src/components/ui/: Button (primary/secondary/ghost, sizes),
   Card, Badge, Input, Textarea, Select, Alert, Container, Section, Skeleton.
   Use only token-based classes. Add a /dev/ui route (dev only) showing all primitives.
3. Layout components in src/components/layout/:
   - DisclaimerBanner: "Unofficial community site, not affiliated with the Municipality
     of Ternate" + link to official channels. Visible on every page.
   - Header: logo text "Better Ternate", desktop nav, language toggle (EN/FIL),
     theme toggle, search button.
   - MobileNav: hamburger -> accessible slide-in drawer (focus trap, Esc to close).
   - BottomBar (mobile only, < md): Hotlines · Services · Search.
   - Footer: links, data sources, license, "Report outdated info".
   - SkipLink, and a RootLayout that composes all of these.
4. i18n setup with en.json and fil.json, language saved in localStorage, <html lang>
   updated on change.
5. Router with lazy routes and placeholder pages for: /, /services, /services/:slug,
   /hotlines, /government, /barangays, /barangays/:slug, /transparency, /tourism,
   /news, /news/:slug, /contact, /about, and a 404.

Acceptance:
- No horizontal scroll at 360, 390, 768, 1440px widths.
- Keyboard-only navigation works, including the mobile drawer.
- Changing a token value in tokens.css restyles the whole site.

Stop point: screenshots or a description at 360px and 1440px, list of tokens, and how
to change the theme in one place.
```

---

## Phase 3 — Content layer and data schemas

```
Phase 3: Build the content/data layer.

Tasks:
1. src/lib/schemas.ts (zod):
   - Service: slug, title_en, title_fil, category (business | civil-registry | health |
     social-welfare | taxes-payments | permits | agriculture-fisheries), office,
     requirements[], steps[], fees[{item, amount_php}], processing_time, schedule,
     last_verified (ISO date), source_url
   - Hotline: name, agency, numbers[], type (emergency | health | utility | barangay),
     available_24_7
   - Official: name, position, term_start, term_end, office, contact?
   - Office: slug, name, head?, location, phone?, email?, hours
   - Barangay: slug, name, captain?, hall_address?, hotline?, psgc_code
   - TourismSpot: slug, name, category, description_en, description_fil, lat, lng, image?
   - NewsPost frontmatter: title, date, category, summary, source_url?
2. Loaders in src/lib/content.ts using Vite import.meta.glob for JSON and Markdown
   (parse frontmatter; render Markdown safely, sanitized).
3. Seed data using ONLY "John Doe" placeholders (see Phase 0, rule 5). Every official,
   captain, office head, contact, phone, email, and fee is a John Doe / sample value
   with "sample": true. Add an optional `sample: boolean` field to every schema.
   Show a small "Sample data" badge in the UI on any record where sample is true.
   - 6 sample services (business permit, barangay clearance, cedula, birth certificate,
     real property tax, medical assistance)
   - hotlines, officials, offices, 3 news posts, 4 tourism spots
   - barangays.json: Ternate's barangay names from the PSA PSGC list (place names
     only), with "verified": false on each. Captains and hotlines are John Doe
     placeholders.
4. scripts/validate-content.ts: validate everything in /content against the schemas,
   fail with readable errors. Wire it to `npm run validate:content`.
5. Unit tests for schemas and loaders.

Stop point: show the schemas, one sample file of each type, and validation output.
```

---

## Phase 4 — Core pages (functional, neutral styling)

```
Phase 4: Build the core pages using the Phase 2 primitives and Phase 3 data.
Focus on structure, content hierarchy, and responsiveness, not final visuals.

Pages:
1. Home: hero with search input ("Ano ang kailangan mo?" / "What do you need?"),
   quick-action cards (Services, Hotlines, Government, Tourism, Transparency),
   latest 3 news items, an advisory banner slot driven by data.
2. /services: grouped by category, filter chips, card grid (1 col mobile, 2 md, 3 lg).
   /services/:slug: requirements checklist, numbered steps, fees table (stacks into
   cards on mobile), office + schedule, "Last verified" date, "Report outdated info".
3. /hotlines: grouped list with large tap-to-call (tel:) buttons, emergency first.
4. /government: officials grid + offices directory.
5. /barangays and /barangays/:slug.
6. /transparency: document list (placeholder links) + note linking to
   budget.bettergov.ph public data where Ternate data exists.
7. /tourism: spot cards + lazy-loaded Leaflet/OpenStreetMap map (loads only when
   scrolled into view).
8. /news and /news/:slug.
9. /about: purpose, unofficial notice, data sources, how to contribute, privacy notice
   (Data Privacy Act of 2012, RA 10173).
10. Per-page <title> and meta description, Open Graph tags, breadcrumbs on detail pages.

Acceptance: every page works at 360px and 1440px, no hard-coded strings, no
hard-coded colors.

Stop point: list of routes with a one-line summary each, and known gaps.
```

---

## Phase 5 — Search and offline support

```
Phase 5: Site search and offline-friendly hotlines.

Tasks:
1. scripts/build-search-index.ts: build public/search-index.json from services,
   offices, hotlines, barangays, news, tourism (title, type, url, keywords, EN + FIL).
   Run it automatically before build.
2. Search UI: command-palette style dialog (Ctrl/Cmd+K on desktop, full-screen on
   mobile) using fuse.js; results grouped by type; fully keyboard accessible.
   Wire the home hero search and header/bottom-bar search to it.
3. PWA: manifest.webmanifest + service worker (vite-plugin-pwa) that precaches the
   app shell and /hotlines data so hotlines work offline. Show an "offline" indicator.

Stop point: show sample searches in EN and FIL, and confirm /hotlines loads offline.
```

---

## Phase 6 — Forms, Cloudflare Turnstile, and backend

```
Phase 6: Contact / Report-an-issue and feedback forms protected by Cloudflare Turnstile.

Client:
1. src/components/forms/TurnstileWidget.tsx: load
   https://challenges.cloudflare.com/turnstile/v0/api.js once (or use
   @marsidev/react-turnstile). Site key from VITE_TURNSTILE_SITE_KEY.
   theme="auto", size="flexible" so it fits mobile.
2. ContactForm on /contact: name (optional), email (optional if anonymous), category,
   message, "submit anonymously" toggle, honeypot field, Turnstile widget.
   Submit disabled until a token exists. Reset the widget after every submit/error
   (tokens are single-use and expire after ~5 minutes). Clear success/error states,
   announced to screen readers (aria-live).
3. FeedbackWidget ("Was this page helpful?") on service pages, also using Turnstile.

Server (Cloudflare Pages Functions):
4. functions/api/contact.ts and functions/api/feedback.ts:
   - Read cf-turnstile-response, POST to
     https://challenges.cloudflare.com/turnstile/v0/siteverify with secret
     (env.TURNSTILE_SECRET_KEY), response, and remoteip (CF-Connecting-IP).
   - Reject with 403 if success is false. Never trust client-only checks.
   - Validate all fields with the same zod schemas used on the client.
   - Reject if the honeypot is filled.
   - Insert into D1 and return JSON { ok: true }.
5. functions/_middleware.ts: security headers (CSP allowing challenges.cloudflare.com,
   X-Content-Type-Options, Referrer-Policy, Permissions-Policy), JSON error handling.
6. migrations/0001_create_submissions.sql (id, type, category, message, email nullable,
   page_url, created_at). D1 binding "DB" in wrangler.toml.
7. .env.example: VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
   .dev.vars.example: TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
   (Cloudflare's published always-pass test keys.) Document how to set the real
   secret: wrangler pages secret put TURNSTILE_SECRET_KEY.
8. Tests: the function returns 403 for a missing/invalid token and 200 for a valid
   one (mock siteverify).

Stop point: show the request flow, how to run it locally with wrangler pages dev, and
test results.
```

---

## Phase 7 — Visual design direction (use with your design/taste skill)

Run this phase as many times as you like. Each run can explore a different look.

```
Phase 7: Visual design pass. The app is functionally complete with a neutral,
token-driven look. Now we explore and apply a visual direction.

Constraints (important):
- Change ONLY: src/styles/tokens.css, src/styles/index.css, src/components/ui/*,
  src/components/layout/* (presentation only), and image/illustration assets.
- Do NOT change routes, data, schemas, i18n keys, form logic, or functions.
- Keep WCAG AA contrast in BOTH light and dark mode. Keep tap targets >= 44px.
- Keep performance budget: no heavy font families (max 2 families, subset, swap),
  no large animation libraries; respect prefers-reduced-motion.
- Keep the unofficial-site disclaimer clearly visible.

Context for the look:
- Audience: Ternate residents (many on phones), local businesses, tourists.
- Place: a coastal, mountainous town in Cavite (beaches, Mt. Palay-Palay/Mataas na
  Gulod area, fishing community, heritage of the Merdicas). Use this as inspiration,
  not as an official seal or logo. Do NOT use the official municipal seal.
- Tone: trustworthy and civic, but warm and local, not a generic SaaS template.
  It should feel related to the BetterGov.ph family without copying it.

Task:
[DIRECTION GOES HERE — e.g. paste the direction/brief produced by your taste skill,
 or write: "Propose 3 distinct directions (name, palette, type pairing, shape
 language, imagery style), then implement direction #__ only."]

Deliverables:
1. Updated tokens (light + dark) and a short rationale.
2. Restyled primitives and layout; /dev/ui shows the new look.
3. Screenshots or descriptions of Home, a Service detail page, and Hotlines at 360px
   and 1440px.
4. Contrast check results for text/background token pairs.

Stop point: show the result and wait for feedback before refining.
```

Tip: commit each direction on its own branch (`design/coastal`, `design/civic-clean`, …) so you can compare Cloudflare preview deploys side by side.

---

## Phase 8 — Testing, accessibility, and performance

```
Phase 8: Quality pass.

Tasks:
1. Playwright projects for 4 viewports: 360x640, 390x844, 768x1024, 1440x900.
   E2E tests: navigation (incl. mobile drawer), search, service detail, tap-to-call
   links, language toggle, dark mode, contact form happy path + Turnstile failure.
2. @axe-core/playwright on every route: zero serious/critical violations.
3. Lighthouse CI (lighthouserc.json) on Home, a Service page, and Hotlines with mobile
   budgets: Performance, Accessibility, Best Practices, SEO >= 90; home JS < 150 KB
   gzipped.
4. Image optimization (WebP/AVIF, srcset, width/height set, lazy loading below fold).
5. Fix everything found.

Stop point: test report, Lighthouse scores, and anything not fixed with a reason.
```

---

## Phase 9 — CI/CD, deployment, and docs

```
Phase 9: Ship it.

Tasks:
1. .github/workflows/ci.yml: on PR — install, validate:content, lint, typecheck, unit
   tests, build, Playwright + axe, Lighthouse CI.
2. .github/workflows/deploy.yml: on push to main — build and deploy to Cloudflare
   Pages (cloudflare/wrangler-action), using CLOUDFLARE_API_TOKEN and
   CLOUDFLARE_ACCOUNT_ID secrets. PRs get preview deployments.
3. D1 migration step documented (wrangler d1 migrations apply).
4. README.md: what the project is, unofficial disclaimer, stack, local setup
   (npm run dev, npm run pages:dev), env vars and Turnstile test keys, D1 setup,
   deploy, project structure, how the token-based theming works.
5. CONTRIBUTING.md: how to correct data (edit /content, run validate:content, open a
   PR), the data_correction issue template, code style, branch naming.

Stop point: final checklist —
[ ] Responsive at 360 / 390 / 768 / 1440, no horizontal scroll
[ ] Forms rejected server-side without a valid Turnstile token (tested)
[ ] No secrets in repo; example env files documented
[ ] Lighthouse mobile >= 90 in all four categories
[ ] axe: zero serious/critical violations
[ ] EN/FIL covers all UI text
[ ] Unofficial disclaimer on every page
[ ] README + CONTRIBUTING complete
```
