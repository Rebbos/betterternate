import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import '@/i18n'

// RTL only auto-cleans when vitest globals are on; we import explicitly instead.
afterEach(cleanup)

// jsdom has no scrolling; ScrollRestoration calls this on every navigation.
window.scrollTo = () => {}
