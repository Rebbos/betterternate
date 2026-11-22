import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, ScrollRestoration } from 'react-router'
import { WifiOff } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { useOnline } from '@/hooks/useOnline'
import type { LayoutContext } from '@/hooks/useSearch'
import BottomBar from './BottomBar'
import DisclaimerBanner from './DisclaimerBanner'
import Footer from './Footer'
import Header from './Header'
import SkipLink from './SkipLink'

// Own chunk (with fuse.js): only downloaded the first time someone opens search.
const SearchDialog = lazy(() => import('@/components/search/SearchDialog'))

export default function RootLayout() {
  const { t } = useTranslation()
  const online = useOnline()
  // null = closed; a string = open with that initial query.
  const [search, setSearch] = useState<string | null>(null)
  const openSearch = useCallback((query = '') => setSearch(query), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setSearch((s) => s ?? '')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    // The Footer pads itself to stay clear of the fixed mobile BottomBar.
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <DisclaimerBanner />
      {!online && (
        <div role="status" className="bg-warning text-primary-contrast text-sm">
          <Container className="flex items-center gap-2 py-2">
            <WifiOff aria-hidden className="size-4 shrink-0" />
            {t('offline.banner')}
          </Container>
        </div>
      )}
      <Header onSearch={() => openSearch()} />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Outlet context={{ openSearch } satisfies LayoutContext} />
      </main>
      <Footer />
      <BottomBar onSearch={() => openSearch()} />
      {search !== null && (
        <Suspense fallback={null}>
          <SearchDialog initialQuery={search} onClose={() => setSearch(null)} />
        </Suspense>
      )}
      <ScrollRestoration />
    </div>
  )
}
