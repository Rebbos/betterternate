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
- Tailwind CSS v4 with our own token-based primitives. Do NOT use @bettergov/kapwa:
  Better Ternate has its own visual identity (inspired by BetterGov.ph, not styled like it)
- react-i18next (English + Filipino), lucide-react icons, fuse.js search, zod schemas
- Content as JSON + Markdown in /content (edited by volunteers via PR)
- Vercel (primary hosting, Git integration deploys) + Vercel Functions (/api) + Vercel
  Cron (daily /api/purge-old, needs CRON_SECRET). Netlify is the BACKUP host and its
  DEPLOYMENTS ARE OFF (`ignore = "exit 0"` in netlify.toml cancels every Netlify build).
  Keep netlify.toml and netlify/ working (netlify/functions/api.ts serves the same /api
  handlers; purge-old.ts is its cron), but don't remove that line, delete them, or
  deploy to Netlify unless asked.
  Postgres via Neon (form storage; DATABASE_URL or NETLIFY_DATABASE_URL).
  Security headers in vercel.json AND netlify.toml: keep them in sync.
- Cloudflare Turnstile on all public forms, verified server-side
- Vitest + React Testing Library, Playwright (+ @axe-core/playwright)
- ESLint, Prettier, Husky + lint-staged, GitHub Actions

## Reference starter
https://github.com/iyanski/betterlocalgov (CC0, the "Better LGU" Kapwa starter).
Borrow freely: service categories, Markdown content structure, page/section layout ideas,
i18n strings. Do NOT adopt its Kapwa styling, Vercel/Terraform hosting, Meilisearch, or
YAML content pipeline; our stack above wins. Swap any real names/contacts for John Doe
placeholders (rule 5) when borrowing content.

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
6. Never commit secrets. Use .env.local (gitignored) and keep .env.example up to date.
7. After each task run: npm run lint && npm run typecheck && npm test. Fix failures.
8. Stop at the end of each phase and report: what was built, files changed, how to
   check it, and open questions. Do not start the next phase unless asked.
9. After any change is deployed, check the live site firsthand
   (https://betterternate.vercel.app) before calling it done. Passing local checks is
   not enough. Re-fetch, bypassing cache, until the new deploy is live, then verify the
   pages, routes, headers and /api endpoints the change touched (curl or a browser) and
   report what you actually saw. Never solve or bypass Turnstile; ask a human to do the
   real form submission.

## Workflow (humans + agents)
One task = one GitHub issue = one branch = one PR = one Claude session.
Issue (from TASKS.md) → session on its own branch from latest main (plan mode if
non-trivial) → PR with a free Vercel preview → CI + /code-review + CODEOWNER review →
merge to main (Vercel production deploy) → live check (rule 9) → a human does any real
Turnstile form submission.
10. Start every session from the latest main and one issue; keep PRs small. Merge main
    into your branch before asking for review.
11. Put human-only steps at the TOP of every PR description: dashboard settings
    (Vercel, Netlify, Neon, Cloudflare, GitHub), secrets, real form submissions.
    Secrets go through the platform's settings, never chat or commits.
12. Shared files (vercel.json, netlify.toml, package.json, CLAUDE.md, locale JSON) change
    in one PR at a time. Parallel sessions split by CODEOWNERS area (backend/security vs
    frontend/SEO) and must not edit the same files.
13. Hosting decisions are human decisions: never switch the primary host, re-enable a
    host's auto-deploys (including removing `ignore = "exit 0"` from netlify.toml), or
    change the canonical/SEO domain unless asked. Netlify deployments are off for now.
