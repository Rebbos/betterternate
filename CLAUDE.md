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
- Netlify (hosting, Git integration deploys). Vercel is PAUSED: vercel.json has Git
  deploys turned off; keep it working but don't deploy there unless asked.
  Form API handlers live in /api (Web Request/Response); netlify/functions/api.ts serves
  them on Netlify. Postgres via Neon (form storage; DATABASE_URL or NETLIFY_DATABASE_URL).
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
