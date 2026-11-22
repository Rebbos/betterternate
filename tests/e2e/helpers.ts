import AxeBuilder from '@axe-core/playwright'
import { expect, type Page } from '@playwright/test'

/** Every page in the site (one detail page per type). */
export const ROUTES = [
  '/',
  '/services',
  '/services/barangay-clearance',
  '/hotlines',
  '/government',
  '/barangays',
  '/barangays/poblacion-i',
  '/transparency',
  '/tourism',
  '/news',
  '/news/2026-11-01-sample-town-event',
  '/about',
  '/contact',
  '/no-such-page',
]

// Layout breakpoints (keep in sync with Tailwind classes in components/layout).
export const isDrawerNav = (page: Page) => page.viewportSize()!.width < 1024 // lg
export const hasBottomBar = (page: Page) => page.viewportSize()!.width < 768 // md

export async function gotoReady(page: Page, path: string) {
  await page.goto(path)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
}

/** axe scan for WCAG 2.1 A/AA; returns only serious + critical violations, summarised. */
export async function seriousA11yViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    // Third-party iframe (Turnstile) is outside our control.
    .exclude('iframe[src*="challenges.cloudflare.com"]')
    .analyze()
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id} (${v.impact}): ${v.help} → ${v.nodes.map((n) => n.target).join(', ')}`)
}

/** Stub Turnstile so form tests never hit Cloudflare: render() issues a token at once. */
export async function stubTurnstile(page: Page, mode: 'pass' | 'unavailable' = 'pass') {
  await page.route('https://challenges.cloudflare.com/**', (route) =>
    mode === 'unavailable'
      ? route.abort()
      : route.fulfill({
          contentType: 'text/javascript',
          body: `
            window.__resets = 0; let n = 0, cb;
            window.turnstile = {
              render(el, o) { cb = o.callback; setTimeout(() => cb('token-' + ++n)); return 'w1' },
              reset() { window.__resets++; setTimeout(() => cb('token-' + ++n)) },
              remove() {},
            };`,
        }),
  )
}
