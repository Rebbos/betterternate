import { expect, test } from '@playwright/test'
import { gotoReady, ROUTES, seriousA11yViolations } from './helpers'

// Per route, per viewport: renders, no sideways scroll, no serious/critical axe violations.
for (const path of ROUTES) {
  test(`${path}: layout + accessibility (light)`, async ({ page }) => {
    await gotoReady(page, path)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow, 'horizontal scroll').toBe(0)
    expect(await seriousA11yViolations(page)).toEqual([])
  })
}

test('all routes: accessibility in dark mode', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  for (const path of ROUTES) {
    await gotoReady(page, path)
    expect(await seriousA11yViolations(page), path).toEqual([])
  }
})

test('every page has its own <title> and meta description', async ({ page }) => {
  const titles = new Set<string>()
  for (const path of ROUTES.filter((p) => p !== '/no-such-page')) {
    await gotoReady(page, path)
    const title = await page.title()
    expect(title, path).toMatch(/Better Ternate/)
    titles.add(title)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/)
  }
  expect(titles.size).toBe(ROUTES.length - 1)
})

test('tourism map loads only when scrolled into view', async ({ page }) => {
  test.skip(page.viewportSize()!.width >= 768, 'map is already near the fold on wide screens')
  await gotoReady(page, '/tourism')
  await expect(page.locator('.leaflet-container')).toHaveCount(0)
  await page.getByRole('heading', { name: 'Map' }).scrollIntoViewIfNeeded()
  await expect(page.locator('.leaflet-container')).toHaveCount(1)
})
