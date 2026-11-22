import { expect, test } from '@playwright/test'

const PAGES = [
  '/',
  '/services',
  '/services/business-permit',
  '/hotlines',
  '/government',
  '/barangays',
  '/barangays/poblacion-i',
  '/transparency',
  '/tourism',
  '/news',
  '/news/2026-11-01-sample-town-event',
  '/about',
]

for (const width of [360, 1440]) {
  test(`all pages: no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    for (const path of PAGES) {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow, path).toBe(0)
    }
  })
}

test('search: Ctrl+K, type, arrow keys, Enter navigates', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.keyboard.press('Control+k')
  const input = page.getByRole('combobox', { name: 'Search Better Ternate' })
  await expect(input).toBeFocused()
  await input.fill('amilyar')
  await expect(page.getByRole('option').first()).toHaveText(/real property tax/i)
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/services\/real-property-tax$/)
  await expect(page.getByRole('dialog')).toBeHidden()
})

test('search: arrow keys move the active option, Esc closes', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.keyboard.press('Control+k')
  await page.getByRole('combobox').fill('barangay')
  const options = page.getByRole('option')
  await expect(options.first()).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('ArrowDown')
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
})

test('home hero search opens the dialog with the query (mobile, full screen)', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 })
  await page.goto('/')
  await page.getByRole('searchbox', { name: 'What do you need?' }).fill('cedula')
  await page.getByRole('searchbox', { name: 'What do you need?' }).press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Search' })
  await expect(dialog).toBeVisible()
  await expect(page.getByRole('combobox')).toHaveValue('cedula')
  await expect(page.getByRole('option').first()).toHaveText(/cedula/i)
  const box = await dialog.boundingBox()
  expect(box?.width).toBe(360)
})

test('tourism map loads only when scrolled into view', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 })
  await page.goto('/tourism')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('.leaflet-container')).toHaveCount(0)
  await page.getByRole('heading', { name: 'Map' }).scrollIntoViewIfNeeded()
  await expect(page.locator('.leaflet-container')).toHaveCount(1)
})
