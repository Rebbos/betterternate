import { expect, test } from '@playwright/test'
import { gotoReady, hasBottomBar, isDrawerNav } from './helpers'

test('navigate to a service: menu → Services → detail → breadcrumb back', async ({ page }) => {
  await gotoReady(page, '/')
  if (isDrawerNav(page)) {
    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('dialog', { name: 'Menu' }).getByRole('link', { name: 'Services' }).click()
  } else {
    await page.getByRole('banner').getByRole('link', { name: 'Services' }).click()
  }
  await expect(page.getByRole('heading', { level: 1, name: 'Services' })).toBeVisible()

  await page.getByRole('link', { name: 'Get a barangay clearance' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Get a barangay clearance')
  await expect(page.getByRole('heading', { name: 'Requirements' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Steps' })).toBeVisible()
  await expect(page.getByText('₱0.00 (sample)')).toBeVisible()
  await expect(page.getByText(/Last verified/)).toBeVisible()

  await page
    .getByRole('navigation', { name: 'Breadcrumb' })
    .getByRole('link', { name: 'Services' })
    .click()
  await expect(page).toHaveURL(/\/services$/)
})

test('service filter chips narrow the list and survive reload', async ({ page }) => {
  await gotoReady(page, '/services')
  await page.getByRole('button', { name: 'Taxes and payments' }).click()
  await expect(page).toHaveURL(/category=taxes-payments/)
  await expect(page.getByRole('link', { name: /cedula/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /business permit/i })).toHaveCount(0)
  await page.reload()
  await expect(page.getByRole('button', { name: 'Taxes and payments' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
})

test('bottom bar (mobile) reaches Hotlines', async ({ page }) => {
  test.skip(!hasBottomBar(page), 'bottom bar is mobile-only')
  await gotoReady(page, '/')
  await page
    .getByRole('navigation', { name: 'Quick links' })
    .getByRole('link', { name: 'Hotlines' })
    .click()
  await expect(page.getByRole('heading', { level: 1, name: 'Hotlines' })).toBeVisible()
})

test('hotlines are tap-to-call tel: links, emergency first, big enough to tap', async ({
  page,
}) => {
  await gotoReady(page, '/hotlines')
  await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText('Emergency')
  const calls = page.getByRole('link', { name: /^Call / })
  expect(await calls.count()).toBeGreaterThan(5)
  await expect(calls.first()).toHaveAttribute('href', 'tel:09000000000')
  const box = await calls.first().boundingBox()
  expect(box!.height).toBeGreaterThanOrEqual(44)
})

test('mobile drawer works with keyboard only', async ({ page }) => {
  test.skip(!isDrawerNav(page), 'drawer exists below lg only')
  await gotoReady(page, '/')
  const menuButton = page.getByRole('button', { name: 'Open menu' })
  await menuButton.focus()
  await page.keyboard.press('Enter')

  const drawer = page.getByRole('dialog', { name: 'Menu' })
  await expect(drawer).toBeVisible()
  await expect(page.getByRole('button', { name: 'Close menu' })).toBeFocused()
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab')
    expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true)
  }
  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()
  await expect(menuButton).toBeFocused()
})

test('skip link moves focus to main content', async ({ page }) => {
  await gotoReady(page, '/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to main content' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main')).toBeFocused()
})

test('language toggle switches to Filipino and persists across reload', async ({ page }) => {
  await gotoReady(page, '/services')
  await page.getByRole('button', { name: 'FIL: Lumipat sa Filipino' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mga Serbisyo')
  await expect(page.locator('html')).toHaveAttribute('lang', 'fil')
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mga Serbisyo')
  await expect(page.getByRole('link', { name: 'Kumuha ng barangay clearance' })).toBeVisible()
})

test('dark mode toggle applies tokens and persists without a flash', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await gotoReady(page, '/')
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  const light = await bg()
  await page.getByRole('button', { name: 'Switch to dark mode' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  expect(await bg()).not.toBe(light)
  // theme-init.js applies the saved theme before React loads.
  await page.reload({ waitUntil: 'commit' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})
