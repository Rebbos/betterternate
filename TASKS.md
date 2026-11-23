# Better Ternate — Task Breakdown

Save as `docs/TASKS.md`. Each task below is written so it can be copied straight into a **GitHub issue** (title = heading, body = the rest). Task IDs: `SH-` shared, `SEC-` security, `PERF-` performance, `SEO-` SEO & Google, `QA-` testing.

**Owners**

- 🔒 **Security & backend:** `@your-username`
- ⚡ **Frontend performance, SEO & Google:** `@friend-username`
- 🤝 **Shared:** both

**Priority:** `P0` must have before launch · `P1` should have at launch · `P2` after launch

---

## Order of work

```
Week 1  ── SH-01 → SH-02 → SH-03        (together: fork, setup, board)
           │
Week 1-2   ├── 🔒 SEC-01 → SEC-02 → SEC-03 → SEC-04 ...
           └── ⚡ PERF-01 → PERF-02 ... and SEO-01 → SEO-02 ...
           │   (in parallel; SH-04 data filled by whoever has time)
Week 3  ── SH-05 decisions, SH-06 design rounds
Week 3-4── QA-01 → QA-04 (pre-launch), then launch
After   ── SEO-06 Search Console, QA-05 monitoring, P2 items
```

Dependencies are noted per task as **Blocked by**.

---

# 🤝 Shared tasks

## SH-01 · Fork BetterLB and run local setup

**Owner:** both (pair on a call) · **Priority:** P0 · **Labels:** `shared`, `setup`

**Steps**

1. Fork `BetterLosBanos/betterlb` to your GitHub account or a new org (e.g. `BetterTernate`). Rename it `better-ternate`.
2. Add your friend as a collaborator (Settings → Collaborators → Add people).
3. Both clone it locally.
4. Run the setup wizard: `node scripts/setup-lgu.cjs`
   - LGU name: Ternate · Full name: Municipality of Ternate · Province: Cavite · Region: Calabarzon (Region IV-A) · Type: municipality
5. Review `config/lgu.config.json`: portal name "Better Ternate", placeholder domain, brand color (temporary), feature flags.
6. Turn **off** sections without Ternate data yet (statistics, legislative records, procurement) via the feature flags.
7. `npm install && npm run dev`. Both confirm it runs.
8. Read `ARCHITECTURE.md` and `FORKING.md` together and note anything confusing in an issue.

**Done when**

- [ ] Repo exists, both have push access
- [ ] `npm run dev` works on both machines
- [ ] `lgu.config.json` says Ternate
- [ ] Unused sections are hidden

---

## SH-02 · Repo rules, CODEOWNERS and templates

**Owner:** both · **Priority:** P0 · **Blocked by:** SH-01

**Steps**

1. Add `CONTRIBUTING.md` (replace BetterLB's or merge it in).
2. Add `.github/CODEOWNERS` with real usernames.
3. Add `.github/pull_request_template.md` (template is in CONTRIBUTING §5).
4. Add issue templates: `bug_report.md`, `data_correction.md`, `task.md`.
5. Set branch protection on `main` (CONTRIBUTING §6).
6. Add `CLAUDE.md` with project rules, updated for the fork and the officials/John Doe rule.
7. Create `docs/DECISIONS.md` (empty log).

**Done when**

- [ ] A test PR from each person auto-requests the right reviewer
- [ ] Direct push to `main` is rejected

---

## SH-03 · Project board and labels

**Owner:** both · **Priority:** P0

**Steps**

1. GitHub → Projects → New project (Board). Columns: **Backlog · To do · In progress · In review · Done**.
2. Create labels: `security` 🔴, `performance` 🟠, `seo` 🟢, `data` 🔵, `design` 🟣, `shared` ⚪, `bug`, `P0`, `P1`, `P2`, `blocked`.
3. Turn every task in this file into an issue, assign it, label it and add it to the board.
4. Create milestones: **M1 Setup**, **M2 Core build**, **M3 Pre-launch**, **M4 Launch**, **M5 Post-launch**.

**Done when**

- [ ] Every task here exists as an issue on the board with an owner and milestone

---

## SH-04 · Ternate content and data

**Owner:** both (split by section, see below) · **Priority:** P0 · **Blocked by:** SH-01

Follow the data rules in CONTRIBUTING §8 (real names for elected officials only; John Doe for everything else).

| Sub-task                                                                                                      | Owner | File(s)                                                        |
| ------------------------------------------------------------------------------------------------------------- | ----- | -------------------------------------------------------------- |
| Officials 2025–2028 (Mayor, VM, 8 SB members, 2 ex-officio as John Doe)                                       | 🔒    | `src/data/` officials/legislative files, from `officials.json` |
| 10 barangays (names real, captains John Doe)                                                                  | 🔒    | barangays data                                                 |
| Departments/offices (John Doe heads, placeholder contacts)                                                    | ⚡    | directory data                                                 |
| Services (6+ sample: business permit, barangay clearance, cedula, birth certificate, RPT, medical assistance) | ⚡    | services data                                                  |
| Emergency hotlines (placeholder numbers, `sample: true`)                                                      | 🔒    | hotlines data                                                  |
| Tourism spots (real place names, placeholder images)                                                          | ⚡    | tourism data                                                   |
| About / history (cite sources)                                                                                | ⚡    | about data                                                     |

**Steps**

1. Map BetterLB's data format first. Don't invent new schemas; fit theirs.
2. Delete or replace **all** Los Baños content. Search: `grep -ri "los ba" src/ public/ config/`
3. Add `sample: true` / a "Sample data" badge wherever placeholders are used.

**Done when**

- [ ] `grep -ri "los ba\|betterlb" src/ public/ config/` returns nothing user-facing
- [ ] All placeholder records are flagged and visibly badged
- [ ] Officials match the 2025 results (8 councilors, including Charito Mojica)

---

## SH-05 · Cross-area decisions

**Owner:** both · **Priority:** P0 · **Blocked by:** SH-01

Decide and record each in `docs/DECISIONS.md`:

1. **Analytics:** Cloudflare Web Analytics _(recommended: no cookies, no banner, ~0 KB impact)_ vs Google Analytics 4 _(needs a consent banner under RA 10173, adds ~50–90 KB of script, more CSP entries)_.
2. **Fonts:** self-host via `@fontsource/*` _(recommended)_ vs Google Fonts CDN.
3. **Maps:** keep Leaflet + OpenStreetMap _(recommended)_ vs Google Maps embed (heavier, needs an API key, more CSP entries).
4. **Domain:** `*.pages.dev` for now vs custom domain (e.g. `betterternate.org`).
5. **Form storage retention:** how long submissions are kept in D1 (suggest 90 days).

**Done when**

- [ ] All 5 decisions logged with date and both names

---

## SH-06 · Design rounds (taste skill)

**Owner:** both (whoever runs the taste skill; the other reviews) · **Priority:** P1 · **Blocked by:** SH-04

**Steps**

1. Generate 2–3 visual directions with the taste skill.
2. Implement each on its own branch: `design/<name>`.
3. Change **only** Kapwa tokens, Tailwind theme and presentation components. No data, logic or functions changes.
4. Compare the Cloudflare preview URLs side by side on a phone and a desktop.
5. Pick one and merge it.

**Done when**

- [ ] Chosen direction merged
- [ ] ⚡ confirms Lighthouse didn't drop (PERF-07)
- [ ] 🔒 confirms CSP still holds (SEC-05)

---

# 🔒 Security & backend tasks — `@your-username`

## SEC-01 · Security audit of the inherited BetterLB code

**Priority:** P0 · **Blocked by:** SH-01

**Steps**

1. Run `npm audit`. Fix high/critical issues or document why not.
2. Review every file in `functions/`: what does each endpoint do, what input does it take, is it validated, is it authenticated?
3. Check `wrangler.jsonc` bindings (D1, KV). Remove anything Ternate doesn't need, e.g. BetterLB's own D1/KV IDs, which you can't use anyway.
4. Check for hard-coded keys, tokens or URLs pointing at BetterLB infrastructure: `grep -rni "key\|token\|secret\|betterlb" functions/ src/ config/ wrangler.jsonc`
5. Check `.env.example`. What does BetterLB expect (e.g. MeiliSearch credentials)? Decide whether Ternate needs each one.
6. Write findings in `docs/SECURITY-AUDIT.md`: endpoint list, risk, action.

**Done when**

- [ ] `docs/SECURITY-AUDIT.md` exists with every endpoint reviewed
- [ ] No BetterLB secrets/IDs remain
- [ ] `npm audit` has zero high/critical findings (or each is documented)

---

## SEC-02 · Cloudflare Turnstile: client widget

**Priority:** P0 · **Blocked by:** SEC-01

**Steps**

1. In the Cloudflare dashboard → Turnstile → Add site. Mode: **Managed**. Add domains: `localhost`, your `*.pages.dev` domain, and the custom domain later.
2. Create `src/components/forms/TurnstileWidget.tsx`:
   - Use `@marsidev/react-turnstile` (or a small custom wrapper).
   - Site key from `import.meta.env.VITE_TURNSTILE_SITE_KEY`.
   - `options={{ theme: 'auto', size: 'flexible' }}` so it fits 360px screens.
   - Expose `onSuccess(token)`, `onExpire`, `onError`, and a `reset()` ref.
3. Load the Turnstile script **only on pages with forms** (coordinate with ⚡ for performance).
4. In each form: disable submit until a token exists; send it as `cf-turnstile-response`; call `reset()` after every submit (success or fail), because tokens are single-use and expire after ~300 seconds.
5. Add translated error/help strings (EN/FIL) to i18n files.
6. In `.env.example`, set `VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA` (Cloudflare's always-pass test key).

**Done when**

- [ ] Widget renders on every public form at 360px and 1440px without overflow
- [ ] Submit is disabled without a token
- [ ] Widget resets after each submit

---

## SEC-03 · Turnstile: server-side verification

**Priority:** P0 · **Blocked by:** SEC-02

**Steps**

1. Create `functions/_lib/turnstile.ts`:
   ```ts
   export async function verifyTurnstile(token: string | null, secret: string, ip?: string) {
     if (!token) return { success: false, 'error-codes': ['missing-input-response'] }
     const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
       method: 'POST',
       body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
     })
     return res.json() as Promise<{
       success: boolean
       'error-codes': string[]
       hostname?: string
       action?: string
     }>
   }
   ```
2. Call it **first** in every form endpoint (`/api/contact`, `/api/feedback`, etc.). On failure → `403 { ok: false, error: 'verification_failed' }`.
3. Also check `hostname` in the response matches your domain (blocks tokens from other sites).
4. Optional: set an `action` per form (`contact`, `feedback`) and verify it matches.
5. Secret from `env.TURNSTILE_SECRET_KEY`. In `.dev.vars.example`: `TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA`.
6. Production: `npx wrangler pages secret put TURNSTILE_SECRET_KEY`.

**Done when**

- [ ] Missing token → 403
- [ ] Fake token → 403
- [ ] Reused token → 403
- [ ] Valid token → 200
- [ ] Tests for all four (mock `fetch`)

---

## SEC-04 · Form endpoint hardening

**Priority:** P0 · **Blocked by:** SEC-03

**Steps**

1. **Validation:** zod schema per endpoint (shared with the client in `src/lib/schemas.ts`). Enforce max lengths (e.g. message ≤ 2000 chars, name ≤ 100), email format, and a category enum.
2. **Honeypot:** a hidden `website` field; if filled, return `200 { ok: true }` silently and discard it, so bots don't learn they were caught.
3. **Method check:** only `POST`; others return `405`.
4. **Content-Type check:** accept only `application/x-www-form-urlencoded`, `multipart/form-data` or `application/json`.
5. **Body size limit:** reject anything over ~10 KB.
6. **CORS:** allow only your own origin(s). No `*`.
7. **Errors:** never return stack traces or internal messages. Log details server-side and return generic errors to clients.
8. **Anonymous option:** if "submit anonymously" is checked, don't store email/name or IP.
9. **Output safety:** if submissions are ever shown in an admin view, escape them on output (XSS).

**Done when**

- [ ] Each rule above has a test
- [ ] Invalid input returns a clean `400` with field errors and no stack trace

---

## SEC-05 · Security headers and CSP

**Priority:** P0 · **Blocked by:** SH-05 (needs analytics/fonts/maps decisions)

**Steps**

1. Create or extend `public/_headers` (Cloudflare Pages format), or set headers in `functions/_middleware.ts`.
2. Start with this baseline and adjust to SH-05 decisions:
   ```
   /*
     Content-Security-Policy: default-src 'self'; script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com; frame-src https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com; img-src 'self' data: https://*.tile.openstreetmap.org; style-src 'self' 'unsafe-inline'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
     Strict-Transport-Security: max-age=31536000; includeSubDomains
     X-Content-Type-Options: nosniff
     Referrer-Policy: strict-origin-when-cross-origin
     Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
     X-Frame-Options: DENY
     Cross-Origin-Opener-Policy: same-origin
   ```
3. Roll out with `Content-Security-Policy-Report-Only` first on a preview deploy. Check the console for violations, fix them, then switch to enforcing.
4. If ⚡ adds anything external later, update the CSP in the same PR.
5. Document every allowed domain and why in `docs/SECURITY.md`.

**Done when**

- [ ] securityheaders.com grade **A** or better on the preview URL
- [ ] No CSP violations in the console on any page
- [ ] Turnstile, map tiles and analytics all still work

---

## SEC-06 · D1 database setup

**Priority:** P0 · **Blocked by:** SEC-01

**Steps**

1. Create the database: `npx wrangler d1 create better-ternate-db`. Put the ID in `wrangler.jsonc`.
2. Migration `db/migrations/0001_submissions.sql`:
   ```sql
   CREATE TABLE submissions (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     type TEXT NOT NULL CHECK (type IN ('contact','feedback','report')),
     category TEXT,
     message TEXT NOT NULL,
     name TEXT,
     email TEXT,
     page_url TEXT,
     is_anonymous INTEGER NOT NULL DEFAULT 0,
     created_at TEXT NOT NULL DEFAULT (datetime('now'))
   );
   CREATE INDEX idx_submissions_created ON submissions(created_at);
   ```
3. Apply locally: `npx wrangler d1 migrations apply better-ternate-db --local`; then remote: `--remote`.
4. Always use **prepared statements with `.bind()`**, never string concatenation (SQL injection).
5. **Retention:** a Cron Trigger worker, or a manual monthly script, deletes rows older than the SH-05 retention period:
   ```sql
   DELETE FROM submissions WHERE created_at < datetime('now', '-90 days');
   ```
6. Don't store IP addresses unless needed. If you do, hash them.

**Done when**

- [ ] Migrations apply cleanly locally and remotely
- [ ] All queries use `.bind()`
- [ ] Retention job documented and tested

---

## SEC-07 · Rate limiting and WAF

**Priority:** P1 · **Blocked by:** SEC-03, custom domain (Cloudflare WAF rules need a zone)

**Steps**

1. Cloudflare dashboard → Security → WAF → Rate limiting rules:
   - Path `/api/*`, method `POST`, **5 requests per minute per IP** → Block for 10 minutes.
2. Turn on **Bot Fight Mode** (free).
3. If still on `*.pages.dev` (no zone), add a simple in-function limit using KV (key = hashed IP + minute) as a temporary measure.
4. Test by sending 10 quick requests; the 6th+ should be blocked.

**Done when**

- [ ] Rapid repeated POSTs are blocked
- [ ] Normal single submissions are unaffected

---

## SEC-08 · Secrets and environment management

**Priority:** P0 · **Blocked by:** SEC-01

**Steps**

1. `.gitignore` includes `.env`, `.env.*` (except `.env.example`), `.dev.vars`.
2. Document every variable in `docs/ENVIRONMENT.md`: name, public/secret, where it's set, example value.
3. Rule: **`VITE_*` = public** (bundled into the browser). Secrets only go in Cloudflare secrets / `.dev.vars`.
4. After a build, scan the bundle: `grep -ri "secret\|0x4AAAA" dist/`. Only the site key should appear.
5. Turn on **GitHub secret scanning** and **push protection** (Settings → Code security).
6. GitHub Actions secrets: `CLOUDFLARE_API_TOKEN` (scoped to _Pages: Edit_ only), `CLOUDFLARE_ACCOUNT_ID`.

**Done when**

- [ ] `docs/ENVIRONMENT.md` complete
- [ ] Bundle scan clean
- [ ] Secret scanning + push protection on

---

## SEC-09 · Dependency security

**Priority:** P1

**Steps**

1. Add `.github/dependabot.yml` for npm (weekly) and GitHub Actions (monthly).
2. Add `npm audit --audit-level=high` to CI. It fails the build on high/critical issues.
3. Pin GitHub Actions to major versions (`actions/checkout@v4`).
4. Review Dependabot PRs weekly. ⚡ checks bundle-size impact on frontend deps.

**Done when**

- [ ] Dependabot opening PRs
- [ ] CI fails on high/critical vulnerabilities

---

## SEC-10 · Privacy notice (RA 10173 – Data Privacy Act)

**Priority:** P0

**Steps**

1. Create a `/privacy` page (EN + FIL) covering:
   - Who runs the site (volunteers, unofficial, not the LGU)
   - What data forms collect (name optional, email optional, message, page URL)
   - Why (to fix outdated info and respond to feedback)
   - Where it's stored (Cloudflare D1) and for how long (SH-05 retention)
   - Anonymous option
   - Analytics used (per SH-05) and whether cookies are used
   - How to request deletion (contact email, placeholder until real)
2. Link it from the footer and next to every form ("By submitting, you agree to our Privacy Notice").
3. If GA4 was chosen in SH-05: implement a consent banner. No GA scripts load before consent.

**Done when**

- [ ] `/privacy` live in both languages
- [ ] Linked from footer and every form

---

## SEC-11 · Remove or lock down inherited admin features

**Priority:** P1 · **Blocked by:** SEC-01

**Steps**

1. BetterLB has admin API endpoints in `functions/`. For each one: does Ternate need it now?
2. If not: delete it, or return `404` behind a feature flag.
3. If yes: it must require authentication (e.g. Cloudflare Access in front of `/admin/*` and `/api/admin/*`, free for small teams).
4. Confirm unauthenticated requests to every admin route fail.

**Done when**

- [ ] No admin endpoint reachable without auth on the live site

---

# ⚡ Frontend performance tasks — `@friend-username`

## PERF-01 · Baseline measurement

**Priority:** P0 · **Blocked by:** SH-01

**Steps**

1. Build and preview: `npm run build && npm run preview`.
2. Run Lighthouse (Chrome DevTools → Lighthouse → **Mobile**, "Slow 4G" throttling) on Home, a service page, Hotlines, Officials and Tourism.
3. Record the bundle size: `npx vite-bundle-visualizer` (or `rollup-plugin-visualizer`).
4. Write everything in `docs/PERFORMANCE.md`: scores, LCP, CLS, INP, TBT, total JS (gzipped), largest chunks.

**Done when**

- [ ] `docs/PERFORMANCE.md` has the baseline table and the top 5 heaviest modules

---

## PERF-02 · Code splitting and lazy loading

**Priority:** P0 · **Blocked by:** PERF-01

**Steps**

1. Every route uses `React.lazy()` + `<Suspense>` with a lightweight skeleton fallback.
2. Lazy-load heavy components only when needed:
   - **Leaflet map:** load when scrolled into view (`IntersectionObserver`).
   - **Search (Fuse.js / Meilisearch client):** load when the search dialog opens.
   - **Turnstile script:** only on form pages (coordinate with 🔒 SEC-02).
3. Check vendor chunk splitting in `vite.config.ts` (`build.rollupOptions.output.manualChunks`) so React isn't re-downloaded on every route.
4. Remove unused dependencies inherited from BetterLB (`npx depcheck`).

**Done when**

- [ ] Home page JS ≤ **150 KB gzipped**
- [ ] Map and search code aren't in the home page bundle

---

## PERF-03 · Images

**Priority:** P0

**Steps**

1. Convert all images to **AVIF + WebP** with JPEG/PNG fallback (`vite-imagetools` or `sharp` in a script).
2. Use `<picture>` with `srcset` and `sizes` for responsive widths (e.g. 400, 800, 1200 px).
3. Always set `width` and `height` (prevents layout shift / CLS).
4. `loading="lazy"` + `decoding="async"` for everything below the fold. The hero image gets `fetchpriority="high"` and **no** lazy loading.
5. Logos and icons: SVG, optimized with SVGO.
6. Target: no single image over 150 KB; hero under 100 KB at mobile width.

**Done when**

- [ ] Lighthouse shows no "properly size images" / "next-gen formats" warnings
- [ ] CLS < 0.1 on all pages

---

## PERF-04 · Fonts

**Priority:** P1 · **Blocked by:** SH-05

**Steps**

1. Self-host via `@fontsource/*` (per SH-05), loading only the weights you use (e.g. 400, 600, 700).
2. Subset to Latin + Latin Extended (covers Filipino and ñ).
3. `font-display: swap`.
4. Preload only the main body font file.
5. Max 2 font families.

**Done when**

- [ ] No render-blocking font requests
- [ ] No requests to fonts.googleapis.com (unless SH-05 chose it)

---

## PERF-05 · Caching

**Priority:** P1

**Steps**

1. Hashed assets (`/assets/*`): `Cache-Control: public, max-age=31536000, immutable`. Coordinate with 🔒, since these go in the same `public/_headers` file.
2. HTML: `Cache-Control: no-cache` (always revalidate, so new deploys show up).
3. JSON data files: short cache (e.g. `max-age=300`).
4. If a PWA/service worker exists from BetterLB: precache the app shell + Hotlines page so it works offline.

**Done when**

- [ ] Second page load is mostly from cache (DevTools → Network shows `(disk cache)`)
- [ ] Hotlines page loads in airplane mode

---

## PERF-06 · Mobile UX and responsiveness pass

**Priority:** P0 · **Blocked by:** SH-04

**Steps**

1. Test every page at **360×640, 390×844, 768×1024, 1440×900** (DevTools device mode + a real phone).
2. Check: no horizontal scroll; tap targets ≥ 44×44 px; readable 16 px base text; menu opens/closes and traps focus; bottom bar doesn't cover content; tables stack into cards on mobile; tap-to-call `tel:` links work.
3. Test on real mobile data, not Wi-Fi.
4. Log issues as `fix/` issues and fix them.

**Done when**

- [ ] All 4 viewports pass on every page
- [ ] Tested on at least one real Android phone

---

## PERF-07 · Lighthouse CI budget

**Priority:** P1 · **Blocked by:** PERF-02, PERF-03

**Steps**

1. Add `@lhci/cli` and `lighthouserc.json`:
   ```json
   {
     "ci": {
       "collect": {
         "staticDistDir": "./dist",
         "url": ["/", "/services", "/hotlines", "/government"],
         "settings": { "preset": "desktop" },
         "numberOfRuns": 3
       },
       "assert": {
         "assertions": {
           "categories:performance": ["error", { "minScore": 0.9 }],
           "categories:accessibility": ["error", { "minScore": 0.9 }],
           "categories:best-practices": ["error", { "minScore": 0.9 }],
           "categories:seo": ["error", { "minScore": 0.9 }],
           "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
         }
       },
       "upload": { "target": "temporary-public-storage" }
     }
   }
   ```
   Run a second config with mobile emulation (remove `preset: desktop`). Mobile is the priority.
2. Add a `lighthouse` job to `.github/workflows/ci.yml` that runs on every PR.
3. Agree with 🔒 that this check is **required** in branch protection.

**Done when**

- [ ] PRs that drop scores below 90 fail CI

---

## PERF-08 · Accessibility (WCAG 2.1 AA)

**Priority:** P0

**Steps**

1. Install the **axe DevTools** extension; scan every page.
2. Add `@axe-core/playwright` checks to E2E tests for every route.
3. Manual checks: skip link works; full keyboard navigation (Tab / Shift+Tab / Enter / Esc); visible focus outline; every input has a label; images have alt text; colour contrast ≥ 4.5:1 (both light and dark mode); `<html lang>` switches between `en` and `fil`.
4. Screen reader spot-check with **TalkBack** (Android) on Home and the Contact form.

**Done when**

- [ ] axe: zero serious/critical violations on all pages
- [ ] Contact form fully usable by keyboard only

---

# 🟢 SEO & Google tasks — `@friend-username`

## SEO-01 · Metadata and SEO config

**Priority:** P0 · **Blocked by:** SH-01

**Steps**

1. Edit `src/data/seo-metadata.json`: replace all Los Baños values with Ternate.
2. Run `node scripts/generate-seo.cjs`.
3. Every page needs a unique `<title>` (≤ 60 chars, format `Page — Better Ternate`) and `<meta name="description">` (≤ 155 chars).
4. Set `<link rel="canonical">` per page.
5. `<html lang>` matches the current language; add `hreflang` alternates for `en` and `fil` if each language has its own URL.

**Done when**

- [ ] No duplicate titles/descriptions across pages
- [ ] No "Los Baños" in any meta tag (`grep -ri "los ba" dist/`)

---

## SEO-02 · Social sharing (Open Graph and Twitter cards)

**Priority:** P1

**Steps**

1. Add `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name`, `og:locale` (`en_PH` / `fil_PH`), and `twitter:card=summary_large_image`.
2. Create a **1200×630** share image (Better Ternate branding, **not** the official seal; include "Unofficial community site").
3. Test with the **Facebook Sharing Debugger** (developers.facebook.com/tools/debug). Most Ternate residents will share links via Facebook and Messenger.

**Done when**

- [ ] Pasting the URL in Messenger shows the correct title, description and image

---

## SEO-03 · Sitemap and robots.txt

**Priority:** P0

**Steps**

1. Generate `sitemap.xml` at build time from all routes plus dynamic pages (each barangay, service and news post). Use `vite-plugin-sitemap` or a script in `scripts/`.
2. `public/robots.txt`:
   ```
   User-agent: *
   Allow: /
   Disallow: /api/
   Disallow: /admin/
   Sitemap: https://<your-domain>/sitemap.xml
   ```
3. Preview deployments should **not** be indexed: add `X-Robots-Tag: noindex` for non-production hosts (coordinate with 🔒 on headers).

**Done when**

- [ ] `/sitemap.xml` lists every public page
- [ ] `/robots.txt` loads and points to the sitemap

---

## SEO-04 · Structured data (JSON-LD)

**Priority:** P1

**Steps**

1. Site-wide: `WebSite` with a `SearchAction` (so Google can show a search box).
2. Government page: `GovernmentOrganization` for the Municipality (real public info only: name, address of the municipal hall). Add a `disambiguatingDescription` noting this is an unofficial community portal.
3. Tourism pages: `TouristAttraction` / `Place` with geo coordinates.
4. Officials: `Person` with `jobTitle` only (no personal details).
5. Breadcrumbs: `BreadcrumbList` on detail pages.
6. Validate with Google's **Rich Results Test** and the **Schema Markup Validator** (validator.schema.org).

**Done when**

- [ ] Rich Results Test shows no errors on Home, an official's page, a tourism page and a service page

---

## SEO-05 · Analytics setup

**Priority:** P1 · **Blocked by:** SH-05

**If Cloudflare Web Analytics (recommended):**

1. Cloudflare dashboard → Analytics & Logs → Web Analytics → Add site.
2. Pages projects can auto-inject it; otherwise add the beacon script.
3. Tell 🔒 to allow `static.cloudflareinsights.com` and `cloudflareinsights.com` in the CSP.

**If Google Analytics 4:**

1. Create a GA4 property; get the Measurement ID (`G-XXXX`). It's public, so it can be a `VITE_` var.
2. Load GA **only after consent** via the banner from 🔒 SEC-10.
3. Turn on IP anonymization and turn off Google Signals / ad personalization.
4. Tell 🔒 to add `googletagmanager.com`, `google-analytics.com` and `*.analytics.google.com` to the CSP.
5. Measure the performance impact and log it in `docs/PERFORMANCE.md`.

**Done when**

- [ ] Visits show up in the dashboard
- [ ] No CSP violations
- [ ] Lighthouse score unchanged (±2)

---

## SEO-06 · Google Search Console

**Priority:** P1 (at launch) · **Blocked by:** launch on the final domain

**Steps**

1. Go to search.google.com/search-console → Add property.
   - **Custom domain:** use the **Domain** property, verified via a DNS TXT record (coordinate with 🔒, who manages DNS in Cloudflare).
   - **`*.pages.dev`:** use the **URL prefix** property, verified via an HTML meta tag or file in `public/`.
2. Submit `sitemap.xml` (Sitemaps → Add).
3. Use **URL Inspection** → "Request indexing" for Home, Services, Hotlines, Government.
4. Check weekly for the first month:
   - **Pages** report: indexing errors, "Crawled – not indexed"
   - **Core Web Vitals:** mobile and desktop
   - **Performance:** what people search to find the site (e.g. "ternate cavite barangay clearance")
   - **Enhancements:** structured data errors
5. Add both teammates as users (Settings → Users and permissions).

**Done when**

- [ ] Property verified, sitemap submitted with status "Success"
- [ ] Core pages indexed
- [ ] Both teammates have access

---

## SEO-07 · Google Business Profile check (optional)

**Priority:** P2

**Steps**

1. Search Google Maps for "Ternate Municipal Hall". Note the existing listing.
2. **Do not** create a Business Profile for Better Ternate claiming to be the municipality.
3. Optionally, use the public Maps link on the Contact/Government page for directions.

**Done when**

- [ ] Decision noted in `docs/DECISIONS.md`

---

# 🧪 Testing & launch (QA)

## QA-01 · Pre-launch E2E test suite

**Owner:** 🤝 (🔒 writes form/API tests, ⚡ writes UI/navigation tests) · **Priority:** P0

**Steps**

1. Playwright projects for 4 viewports: 360×640, 390×844, 768×1024, 1440×900.
2. ⚡ tests: navigation (incl. mobile menu), search, language toggle, dark mode, service detail, hotlines tap-to-call links, 404 page.
3. 🔒 tests: contact form happy path (test keys), missing token → error shown, honeypot, field validation messages.
4. axe check on every route (from PERF-08).
5. Runs in CI on every PR.

**Done when**

- [ ] Suite green in CI on all 4 viewports

---

## QA-02 · Production deployment

**Owner:** 🔒 (deploy and secrets), ⚡ (verifies frontend) · **Priority:** P0

**Steps**

1. Connect the repo to Cloudflare Pages (or use the GitHub Actions deploy from BetterLB with your own `CLOUDFLARE_API_TOKEN`).
2. Set production env vars and secrets: `VITE_TURNSTILE_SITE_KEY` (real), `TURNSTILE_SECRET_KEY` (real, via `wrangler pages secret put`).
3. Apply D1 migrations remotely.
4. Confirm that PRs get preview URLs.
5. Turn on "Always Use HTTPS" (custom domain).

**Done when**

- [ ] Production URL live
- [ ] Preview URL generated for a test PR

---

## QA-03 · Post-deploy smoke test (every deploy, ~5 min)

**Owner:** whoever merged · **Priority:** P0

- [ ] Home, Officials, Barangays, Services, Hotlines, Contact load (no blank pages)
- [ ] Deep link + refresh works (e.g. `/barangays/bucana`)
- [ ] No red errors in the console
- [ ] `/api/health` (or equivalent) responds
- [ ] Unofficial-site banner visible

Optional: automate as a Playwright smoke suite run against the live URL after the deploy job.

---

## QA-04 · Launch-day full check

**Owner:** 🤝 · **Priority:** P0

**🔒 Security checklist**

- [ ] Real Turnstile keys live; test key `1x000…` **not** in production bundle
- [ ] Real submission → row appears in D1 (`wrangler d1 execute better-ternate-db --remote --command "SELECT * FROM submissions ORDER BY created_at DESC LIMIT 5"`)
- [ ] `curl -X POST https://<domain>/api/contact -d "message=test"` → **403**
- [ ] Token reuse rejected; honeypot rejected; rate limit triggers
- [ ] securityheaders.com grade A
- [ ] HTTP → HTTPS redirect
- [ ] `/api/unknown` returns a clean error, no stack trace
- [ ] Admin routes inaccessible without auth
- [ ] Test rows deleted from D1

**⚡ Performance & SEO checklist**

- [ ] PageSpeed Insights (pagespeed.web.dev) mobile ≥ 90 on Home, a service page, Hotlines
- [ ] Real-phone test on mobile data (Android Chrome; iPhone Safari if available)
- [ ] Hotlines work offline (airplane mode)
- [ ] Facebook Sharing Debugger preview correct
- [ ] `robots.txt` + `sitemap.xml` live
- [ ] Rich Results Test passes
- [ ] Link check: `npx linkinator https://<domain> --recurse`
- [ ] Analytics receiving visits

**🤝 Content checklist**

- [ ] No Los Baños content anywhere
- [ ] Officials list correct (Mayor, VM, 8 councilors, 2 ex-officio placeholders)
- [ ] Every John Doe record shows the "Sample data" badge
- [ ] Unofficial disclaimer on every page; no official seal used

---

## QA-05 · Monitoring (after launch)

**Owner:** 🔒 uptime/errors/security, ⚡ analytics/Search Console/vitals · **Priority:** P1

| What                          | Tool                                                             | Owner   | Check                            |
| ----------------------------- | ---------------------------------------------------------------- | ------- | -------------------------------- |
| Uptime                        | UptimeRobot (free, 5-min checks, email alerts)                   | 🔒      | Alerts on                        |
| Function errors               | `npx wrangler pages deployment tail` / Cloudflare dashboard logs | 🔒      | Weekly                           |
| Bot activity                  | Cloudflare Turnstile analytics (solve vs fail rate)              | 🔒      | Weekly                           |
| Dependencies                  | Dependabot PRs                                                   | 🔒 + ⚡ | Weekly                           |
| Traffic                       | Cloudflare Web Analytics / GA4                                   | ⚡      | Weekly                           |
| Search performance & indexing | Google Search Console                                            | ⚡      | Weekly for month 1, then monthly |
| Core Web Vitals (real users)  | Search Console CWV report                                        | ⚡      | Monthly                          |
| Data freshness                | "Last verified" dates in data                                    | 🤝      | Monthly                          |

**Rollback drill:** practice once before launch. Cloudflare Pages → Deployments → pick the previous deployment → **Rollback**. Write the steps in `README.md`.

**Done when**

- [ ] All monitors set up, both teammates get alerts
- [ ] Rollback tested once

---

# Summary by owner

| 🔒 `@your-username`        | ⚡ `@friend-username`         |
| -------------------------- | ----------------------------- |
| SEC-01 Security audit      | PERF-01 Baseline              |
| SEC-02 Turnstile client    | PERF-02 Code splitting        |
| SEC-03 Turnstile server    | PERF-03 Images                |
| SEC-04 Form hardening      | PERF-04 Fonts                 |
| SEC-05 Headers & CSP       | PERF-05 Caching               |
| SEC-06 D1 database         | PERF-06 Mobile UX pass        |
| SEC-07 Rate limiting / WAF | PERF-07 Lighthouse CI         |
| SEC-08 Secrets & env       | PERF-08 Accessibility         |
| SEC-09 Dependency security | SEO-01 Metadata               |
| SEC-10 Privacy notice      | SEO-02 Social sharing         |
| SEC-11 Admin lockdown      | SEO-03 Sitemap & robots       |
| QA-02 Deploy (lead)        | SEO-04 Structured data        |
| QA-05 Uptime & errors      | SEO-05 Analytics              |
|                            | SEO-06 Search Console         |
|                            | SEO-07 Business Profile check |
|                            | QA-05 Analytics & vitals      |

**Shared:** SH-01 to SH-06, QA-01, QA-03, QA-04.
