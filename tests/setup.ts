import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

// Browser-only setup; tests/functions run in the node environment.
if (typeof window !== 'undefined') {
  const { cleanup } = await import('@testing-library/react')
  await import('@/i18n')

  // RTL only auto-cleans when vitest globals are on; we import explicitly instead.
  afterEach(cleanup)

  // jsdom has no scrolling; ScrollRestoration calls this on every navigation.
  window.scrollTo = () => {}
}
