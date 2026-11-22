import { expect, test } from '@playwright/test'

for (const width of [360, 390, 768, 1440]) {
  test(`no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('/dev/ui')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBe(0)
  })
}

test('mobile drawer works with keyboard only', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const menuButton = page.getByRole('button', { name: 'Open menu' })
  await menuButton.focus()
  await page.keyboard.press('Enter')

  const drawer = page.getByRole('dialog', { name: 'Menu' })
  await expect(drawer).toBeVisible()
  await expect(page.getByRole('button', { name: 'Close menu' })).toBeFocused()

  // Focus stays inside the modal while tabbing through all links.
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab')
    const inside = await page.evaluate(() => !!document.activeElement?.closest('dialog'))
    expect(inside).toBe(true)
  }

  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()
  await expect(menuButton).toBeFocused()

  // Following a link closes the drawer and navigates.
  await menuButton.press('Enter')
  await drawer.getByRole('link', { name: 'Hotlines' }).press('Enter')
  await expect(page).toHaveURL(/\/hotlines$/)
  await expect(drawer).toBeHidden()
})

test('skip link moves focus to main content', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to main content' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main')).toBeFocused()
})
