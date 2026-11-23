import { render, screen, waitFor, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { expect, test } from 'vitest'
import { routes } from '@/router'

const renderAt = (path: string) =>
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />)

test('home has hero search, quick actions, latest news', async () => {
  renderAt('/')
  expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Better Ternate')
  expect(screen.getByRole('searchbox', { name: 'What do you need?' })).toBeInTheDocument()
  const quick = within(screen.getByRole('region', { name: 'Quick links' }))
  for (const name of ['Services', 'Hotlines', 'Government', 'Tourism', 'Transparency'])
    expect(quick.getByRole('link', { name: new RegExp(`^${name}`) })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Latest news' })).toBeInTheDocument()
})

// One render per route: catches crashes and missing data across all pages.
test.each([
  ['/services', 'Services'],
  ['/services/barangay-clearance', 'Get a barangay clearance'],
  ['/hotlines', 'Hotlines'],
  ['/government', 'Government'],
  ['/barangays', 'Barangays'],
  ['/barangays/bucana', 'Barangay Bucana'],
  ['/transparency', 'Transparency'],
  ['/tourism', 'Tourism'],
  ['/news', 'News'],
  ['/news/2026-11-01-sample-town-event', 'Sample event: Town festival schedule'],
  ['/about', 'About'],
  ['/services/no-such-service', 'Page not found'],
])('%s renders "%s" and sets the page title', async (path, h1) => {
  renderAt(path)
  expect(await screen.findByRole('heading', { level: 1, name: h1 })).toBeInTheDocument()
  // The title is set in an effect; wait for it rather than racing the render.
  await waitFor(() => expect(document.title).toBe(`${h1} · Better Ternate`))
})

test('service detail shows sample fee, office, last verified, report link', async () => {
  renderAt('/services/barangay-clearance')
  await screen.findByRole('heading', { level: 1 })
  expect(screen.getAllByText('₱0.00 (sample)').length).toBeGreaterThan(0)
  expect(screen.getByText(/Last verified/)).toHaveTextContent('November 21, 2026')
  const aside = within(screen.getByRole('complementary', { name: 'Where to go' }))
  expect(aside.getByRole('link', { name: 'Report outdated info' })).toBeInTheDocument()
  expect(aside.getByText('Barangay Hall (your barangay)')).toBeInTheDocument()
  expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toHaveTextContent('Services')
})

test('hotlines are tap-to-call, emergency group first', async () => {
  renderAt('/hotlines')
  const headings = await screen.findAllByRole('heading', { level: 2 })
  expect(headings[0]).toHaveTextContent('Emergency')
  const call = screen.getAllByRole('link', { name: /^Call / })[0]
  expect(call).toHaveAttribute('href', 'tel:09000000000')
})
