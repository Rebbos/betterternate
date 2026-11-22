import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router'
import { Moon, Search, Sun } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { useTheme } from '@/hooks/useTheme'
import { NAV_ITEMS } from '@/lib/site'
import MobileNav, { navLinkClass } from './MobileNav'

export default function Header({ onSearch }: { onSearch: () => void }) {
  const { t, i18n } = useTranslation()
  const { theme, toggle } = useTheme()
  const nextLang = i18n.language === 'fil' ? 'en' : 'fil'

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg">
      <Container className="flex min-h-14 items-center gap-1">
        <Link to="/" className="mr-auto flex min-h-tap items-center text-lg font-bold">
          {t('site.name')}
        </Link>

        <nav aria-label={t('nav.label')} className="hidden lg:block">
          <ul className="flex gap-1">
            {NAV_ITEMS.filter((item) => item.primary).map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={navLinkClass}>
                  {t(item.key)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Button
          variant="ghost"
          size="sm"
          lang={nextLang}
          aria-label={t('header.switchLanguage')}
          onClick={() => i18n.changeLanguage(nextLang)}
        >
          {t('header.languageShort')}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          aria-label={t(theme === 'dark' ? 'header.themeToLight' : 'header.themeToDark')}
          onClick={toggle}
        >
          {theme === 'dark' ? (
            <Sun aria-hidden className="size-5" />
          ) : (
            <Moon aria-hidden className="size-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          aria-label={t('header.search')}
          onClick={onSearch}
          className="max-md:hidden"
        >
          <Search aria-hidden className="size-5" />
        </Button>
        <MobileNav />
      </Container>
    </header>
  )
}
