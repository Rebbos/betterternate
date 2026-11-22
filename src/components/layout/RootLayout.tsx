import { Outlet, ScrollRestoration } from 'react-router'
import BottomBar from './BottomBar'
import DisclaimerBanner from './DisclaimerBanner'
import Footer from './Footer'
import Header from './Header'
import SkipLink from './SkipLink'

// ponytail: no-op until the search dialog lands in Phase 5.
const openSearch = () => {}

export default function RootLayout() {
  return (
    // pb-16 keeps the footer clear of the fixed mobile BottomBar.
    <div className="flex min-h-dvh flex-col pb-16 md:pb-0">
      <SkipLink />
      <DisclaimerBanner />
      <Header onSearch={openSearch} />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
      <BottomBar onSearch={openSearch} />
      <ScrollRestoration />
    </div>
  )
}
