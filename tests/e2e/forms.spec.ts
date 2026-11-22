import { expect, test, type Page } from '@playwright/test'

/**
 * Stub Turnstile (no network to Cloudflare in tests): render() immediately issues a token,
 * reset() issues a fresh one. Counts resets so we can assert tokens aren't reused.
 */
async function stubTurnstile(page: Page) {
  await page.route('https://challenges.cloudflare.com/**', (route) =>
    route.fulfill({
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

test('contact: sends token + fields, shows success, resets the widget', async ({ page }) => {
  await stubTurnstile(page)
  let body: Record<string, unknown> = {}
  await page.route('**/api/contact', async (route) => {
    body = route.request().postDataJSON()
    await route.fulfill({ json: { ok: true } })
  })

  await page.goto('/contact?category=correction&page=/services/cedula')
  await expect(page.getByRole('combobox', { name: 'Topic' })).toHaveValue('correction')
  await page.getByRole('textbox', { name: 'Email' }).fill('johndoe@example.com')
  await page.getByRole('textbox', { name: 'Message' }).fill('The cedula fee looks outdated.')
  await page.getByRole('button', { name: 'Send message' }).click()

  await expect(page.getByRole('status')).toContainText('Message sent')
  expect(body).toMatchObject({
    'cf-turnstile-response': 'token-1',
    category: 'correction',
    email: 'johndoe@example.com',
    page_url: '/services/cedula',
    website: '',
  })
  expect(await page.evaluate(() => (window as unknown as { __resets: number }).__resets)).toBe(1)
  await expect(page.getByRole('textbox', { name: 'Message' })).toHaveValue('')
})

test('contact: client validation blocks bad input and focuses the field', async ({ page }) => {
  await stubTurnstile(page)
  let called = false
  await page.route('**/api/contact', (route) => {
    called = true
    return route.fulfill({ json: { ok: true } })
  })
  await page.goto('/contact')
  await page.getByRole('textbox', { name: 'Message' }).fill('hi')
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByRole('textbox', { name: 'Email' })).toBeFocused()
  await expect(page.getByText('Write between 10 and 2,000 characters.')).toBeVisible()
  expect(called).toBe(false)
})

test('contact: anonymous hides name/email; server 403 shows an error', async ({ page }) => {
  await stubTurnstile(page)
  await page.route('**/api/contact', (route) =>
    route.fulfill({ status: 403, json: { ok: false, error: 'verification_failed' } }),
  )
  await page.goto('/contact')
  await page.getByRole('checkbox', { name: /Submit anonymously/ }).check()
  await expect(page.getByRole('textbox', { name: 'Email' })).toHaveCount(0)
  await page.getByRole('textbox', { name: 'Message' }).fill('Anonymous report about the site.')
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByRole('status')).toContainText('security check failed')
  // A fresh token arrives after the reset, so the person can retry.
  await expect(page.getByRole('button', { name: 'Send message' })).toBeEnabled()
})

test('service page feedback: Yes → optional comment → thanks', async ({ page }) => {
  await stubTurnstile(page)
  let body: Record<string, unknown> = {}
  await page.route('**/api/feedback', async (route) => {
    body = route.request().postDataJSON()
    await route.fulfill({ json: { ok: true } })
  })
  await page.goto('/services/cedula')
  await page.getByRole('button', { name: 'Yes' }).click()
  await page.getByRole('textbox', { name: /Anything to add/ }).fill('Clear steps.')
  await page.getByRole('button', { name: 'Send feedback' }).click()
  await expect(page.getByRole('status').filter({ hasText: 'Thanks' })).toBeVisible()
  expect(body).toMatchObject({
    helpful: true,
    comment: 'Clear steps.',
    page_url: '/services/cedula',
  })
})
