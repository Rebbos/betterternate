import { expect, test } from '@playwright/test'
import { gotoReady, hasBottomBar } from './helpers'

test('Ctrl+K opens search; Filipino query; Enter navigates', async ({ page }) => {
  await gotoReady(page, '/')
  await page.keyboard.press('Control+k')
  const input = page.getByRole('combobox', { name: 'Search Better Ternate' })
  await expect(input).toBeFocused()
  await input.fill('amilyar')
  await expect(page.getByRole('option').first()).toHaveText(/real property tax/i)
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/services\/real-property-tax$/)
  await expect(page.getByRole('dialog')).toBeHidden()
})

test('arrow keys move the active option; Esc closes in one press', async ({ page }) => {
  await gotoReady(page, '/')
  await page.keyboard.press('Control+k')
  await page.getByRole('combobox').fill('barangay')
  const options = page.getByRole('option')
  await expect(options.first()).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('ArrowDown')
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
})

test('hero search opens the dialog with the query; full screen on phones', async ({ page }) => {
  await gotoReady(page, '/')
  const hero = page.getByRole('searchbox', { name: 'What do you need?' })
  await hero.fill('cedula')
  await hero.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Search' })
  await expect(dialog).toBeVisible()
  await expect(page.getByRole('combobox')).toHaveValue('cedula')
  await expect(page.getByRole('option').first()).toHaveText(/cedula/i)
  const width = page.viewportSize()!.width
  const box = await dialog.boundingBox()
  if (width < 768) expect(box!.width).toBe(width)
  else expect(box!.width).toBeLessThan(width)
})

test('search button (header or bottom bar) opens search', async ({ page }) => {
  await gotoReady(page, '/hotlines')
  const scope = hasBottomBar(page)
    ? page.getByRole('navigation', { name: 'Quick links' })
    : page.getByRole('banner')
  await scope.getByRole('button', { name: 'Search' }).click()
  await page.getByRole('combobox').fill('police')
  await expect(page.getByRole('option', { name: 'Police Station' })).toBeVisible()
})
