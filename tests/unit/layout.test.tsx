import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, expect, test } from 'vitest'
import i18n from '@/i18n'
import { routes } from '@/router'

function renderAt(path: string) {
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />)
}

afterEach(async () => {
  await act(() => i18n.changeLanguage('en'))
  delete document.documentElement.dataset.theme
  localStorage.clear()
})

test('every page shows skip link, disclaimer, and main landmark', async () => {
  renderAt('/hotlines')
  expect(await screen.findByRole('heading', { level: 1, name: 'Hotlines' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute(
    'href',
    '#main',
  )
  expect(screen.getByRole('complementary', { name: 'Site notice' })).toHaveTextContent(
    /not affiliated with the Municipality of Ternate/,
  )
  expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
})

test('unknown routes render the 404 page', async () => {
  renderAt('/no-such-page')
  expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
})

test('language toggle switches to Filipino, updates <html lang>, and persists', async () => {
  renderAt('/')
  await screen.findByRole('heading', { level: 1 })
  await userEvent.click(screen.getByRole('button', { name: 'FIL: Lumipat sa Filipino' }))
  expect(document.documentElement.lang).toBe('fil')
  expect(localStorage.getItem('bt-lang')).toBe('fil')
  expect(
    screen.getByRole('link', { name: 'Lumaktaw sa pangunahing nilalaman' }),
  ).toBeInTheDocument()
})

test('theme toggle sets data-theme and persists', async () => {
  renderAt('/')
  await screen.findByRole('heading', { level: 1 })
  await userEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }))
  expect(document.documentElement.dataset.theme).toBe('dark')
  expect(localStorage.getItem('bt-theme')).toBe('dark')
  expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument()
})
