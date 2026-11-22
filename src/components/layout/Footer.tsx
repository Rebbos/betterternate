import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Container } from '@/components/ui/Container'
import { NAV_ITEMS, REPO_URL, REPORT_URL } from '@/lib/site'
import { LogoMark, WaveEdge } from './Logo'

const link =
  'inline-flex min-h-tap items-center text-inverse-text underline underline-offset-2 hover:no-underline'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="bt-inverse mt-8 text-sm">
      <WaveEdge />
      <div className="bg-inverse-bg text-inverse-text">
        {/* Extra bottom padding on mobile keeps content clear of the fixed BottomBar. */}
        <Container className="grid gap-8 py-10 max-md:pb-28 sm:grid-cols-3">
          <div className="space-y-2">
            <p className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight">
              <LogoMark className="size-8" />
              {t('site.name')}
            </p>
            <p className="text-inverse-muted">{t('site.tagline')}</p>
            <p className="text-inverse-muted">{t('disclaimer.text')}</p>
          </div>

          <nav aria-labelledby="footer-links">
            <h2 id="footer-links" className="mb-2 font-bold">
              {t('footer.linksHeading')}
            </h2>
            <ul className="grid grid-cols-2 gap-x-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={link}>
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4">
            <div>
              <h2 className="mb-1 font-bold">{t('footer.dataHeading')}</h2>
              <p className="text-inverse-muted">{t('footer.dataText')}</p>
            </div>
            <div>
              <h2 className="mb-1 font-bold">{t('footer.licenseHeading')}</h2>
              <p className="text-inverse-muted">{t('footer.licenseText')}</p>
            </div>
            <ul>
              <li>
                <a href={REPORT_URL} className={link} target="_blank" rel="noopener noreferrer">
                  {t('footer.report')}
                </a>
              </li>
              <li>
                <a href={REPO_URL} className={link} target="_blank" rel="noopener noreferrer">
                  {t('footer.source')}
                </a>
              </li>
            </ul>
          </div>
        </Container>
      </div>
    </footer>
  )
}
