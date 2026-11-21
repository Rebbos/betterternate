import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Home from '@/routes/Home'

test('home renders its heading from i18n', () => {
  render(<Home />)
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Better Ternate')
})
