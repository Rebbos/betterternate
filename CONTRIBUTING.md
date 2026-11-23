# Contributing to Better Ternate

Thank you for helping make local government information easier to find. You don't need to
be a programmer: most help is fixing or adding information.

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## 1. Report wrong or outdated information (no coding)

- Click **Report outdated info** on the page with the problem. It opens a form pre-filled
  with that page.
- Or open a **Data correction** issue on GitHub (_Issues → New issue → Data correction_)
  and fill in:
  - the page URL
  - what's wrong
  - the correct information
  - **a source**: an official link or document, or the office you confirmed it with

Unsourced changes can't be accepted: people rely on this information.

## 2. Correct data yourself (edit `/content`)

All content is plain files in [`/content`](content):

| What                                              | File                                |
| ------------------------------------------------- | ----------------------------------- |
| Hotlines                                          | `content/data/hotlines.json`        |
| Offices, officials, barangays, tourism, documents | `content/data/*.json`               |
| A service ("Get a barangay clearance")            | `content/services/<slug>.md`        |
| News and advisories                               | `content/news/YYYY-MM-DD-<slug>.md` |

**Easiest way:** open the file on GitHub, click the pencil icon, edit, and choose
"Create a new branch and start a pull request". The automated checks will tell you if
something is malformed.

**On your computer:**

```sh
npm install
npm run validate:content   # checks every file against the schemas
npm run dev                # preview at http://localhost:5173
```

`validate:content` prints readable errors with the file and field, for example:

```
✗ data/hotlines.json
    ✖ Invalid option: expected one of "emergency"|"health"|"utility"|"barangay"
      → at [0].type
```

### Content rules

- **Real people and contacts:** only publish what is already officially public (e.g. an
  office's public hotline), and cite the source in your PR.
- **Placeholders:** while data is unverified, use "John Doe" / "Jane Doe", phone
  `0900-000-0000`, email `johndoe@example.com`, address `123 Sample St., Ternate, Cavite`,
  and keep `"sample": true`. When you replace a placeholder with verified data, remove
  `"sample": true` (and set `"verified": true` for barangays).
- **Services:** update `last_verified` (YYYY-MM-DD) whenever you confirm the details, and
  set `source_url` to where you confirmed them.
- **Advisories:** use `category: advisory` and set `expires` (YYYY-MM-DD). The home page
  banner shows the newest unexpired advisory.
- **Search:** `keywords` on a service adds search terms, e.g. Filipino words people
  actually type.
- Never paste raw HTML into Markdown. It's escaped on purpose.

## 3. Code contributions

### Branches and PRs

Branch from `main` and name branches by type:

| Prefix     | For                            |
| ---------- | ------------------------------ |
| `content/` | data or text changes           |
| `fix/`     | bug fixes                      |
| `feat/`    | new features                   |
| `design/`  | visual or design-token changes |
| `docs/`    | documentation                  |

Example: `content/update-cedula-fees`. Keep PRs small and focused. Every PR gets a Netlify
deploy preview link and runs CI (content check, lint, typecheck, unit tests, build, browser and
accessibility tests, Lighthouse).

### Before you push

```sh
npm run lint && npm run typecheck && npm test
npm run test:e2e   # browser + accessibility tests (first run: npx playwright install chromium)
```

A pre-commit hook (Husky + lint-staged) formats and lints staged files automatically.

### Code style

- **TypeScript**, formatted by Prettier (no semicolons, single quotes, 100 columns) and
  linted by ESLint. Don't fight the formatter.
- **Mobile-first:** design for a 360px screen first. Tap targets must be at least 44px and
  there must be no horizontal scrolling.
- **Accessibility:** use semantic HTML and labels, visible focus, alt text, and AA contrast
  (WCAG 2.1 AA). The axe tests must stay at zero serious issues.
- **No hard-coded text:** every UI string goes in **both** `src/i18n/locales/en.json` and
  `fil.json`. A test fails if their keys differ.
- **No hard-coded styling:** colors, fonts, radii and shadows come from tokens in
  `src/styles/tokens.css`. See "How theming works" in the README.
- **Keep it light:** the home page must stay under 150 KB of JavaScript (gzipped), so check
  with the build output before adding a dependency.
- **Secrets:** never commit keys. Use `.env.local` (gitignored) and document new variables
  in `.env.example`.
