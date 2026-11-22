import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'
import { LayoutGrid, Phone, Search } from 'lucide-react'

const item =
  'flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs text-text aria-[current=page]:font-semibold aria-[current=page]:text-primary'

/** Mobile-only (< md) thumb bar. */
export default function BottomBar({ onSearch }: { onSearch: () => void }) {
  const { t } = useTranslation()
  return (
    <nav
      aria-label={t('bottomBar.label')}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-3">
        <li>
          <NavLink to="/hotlines" className={item}>
            <Phone aria-hidden className="size-5" />
            {t('nav.hotlines')}
          </NavLink>
        </li>
        <li>
          <NavLink to="/services" className={item}>
            <LayoutGrid aria-hidden className="size-5" />
            {t('nav.services')}
          </NavLink>
        </li>
        <li>
          <button type="button" onClick={onSearch} className={`${item} w-full`}>
            <Search aria-hidden className="size-5" />
            {t('header.search')}
          </button>
        </li>
      </ul>
    </nav>
  )
}
