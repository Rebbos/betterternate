import { expect, test } from '@playwright/test'

test.use({ baseURL: 'http://localhost:4173' })

test('hotlines work offline after the first visit', async ({ page, context }) => {
  test.skip(
    test.info().project.name !== 'desktop-1440',
    'service worker behaviour is viewport-independent',
  )
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  // Wait until the service worker has installed and taken control (precache done).
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
    if (!navigator.serviceWorker.controller)
      await new Promise((r) => navigator.serviceWorker.addEventListener('controllerchange', r))
  })

  await context.setOffline(true)
  await page.goto('/hotlines') // full page load, served by the service worker
  await expect(page.getByRole('heading', { level: 1, name: 'Hotlines' })).toBeVisible()
  await expect(page.getByRole('link', { name: /^Call / }).first()).toHaveAttribute('href', /^tel:/)
  await expect(page.getByRole('status').filter({ hasText: "You're offline" })).toBeVisible()

  // Search index is precached too.
  await page.getByRole('button', { name: 'Search' }).first().click()
  await page.getByRole('combobox').fill('police')
  await expect(page.getByRole('option', { name: 'Police Station' })).toBeVisible()
})
