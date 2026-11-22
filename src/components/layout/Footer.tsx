import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Container } from '@/components/ui/Container'
import { NAV_ITEMS, REPO_URL, REPORT_URL } from '@/lib/site'

const link = 'inline-flex min-h-tap items-center text-text underline hover:text-primary'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="border-t border-border bg-surface text-sm">
      <Container className="grid gap-8 py-8 sm:grid-cols-3">
        <div className="space-y-2">
          <p className="text-base font-bold">{t('site.name')}</p>
          <p className="text-muted">{t('site.tagline')}</p>
          <p className="text-muted">{t('disclaimer.text')}</p>
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
            <p className="text-muted">{t('footer.dataText')}</p>
          </div>
          <div>
            <h2 className="mb-1 font-bold">{t('footer.licenseHeading')}</h2>
            <p className="text-muted">{t('footer.licenseText')}</p>
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
    </footer>
  )
}
