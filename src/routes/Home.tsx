import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Building2, FileText, LayoutGrid, MapPin, Phone, Search } from 'lucide-react'
import { Alert } from '@/components/ui/Alert'
import { CoastArt } from '@/components/layout/Logo'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Container, Section } from '@/components/ui/Container'
import { SampleBadge } from '@/components/ui/SampleBadge'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useSearch } from '@/hooks/useSearch'
import { getActiveAdvisory, getNewsPosts } from '@/lib/content'
import { formatDate } from '@/lib/format'

const QUICK_ACTIONS = [
  { to: '/services', key: 'services', Icon: LayoutGrid },
  { to: '/hotlines', key: 'hotlines', Icon: Phone },
  { to: '/government', key: 'government', Icon: Building2 },
  { to: '/tourism', key: 'tourism', Icon: MapPin },
  { to: '/transparency', key: 'transparency', Icon: FileText },
] as const

export default function Home() {
  const { t, i18n } = useTranslation()
  const { openSearch } = useSearch()
  const [query, setQuery] = useState('')
  usePageMeta()

  const advisory = getActiveAdvisory()
  const latest = getNewsPosts().slice(0, 3)

  return (
    <Container>
      {advisory && (
        <Alert tone="warning" title={advisory.title} className="mt-4">
          {advisory.summary}{' '}
          <Link to={`/news/${advisory.slug}`} className="font-medium underline">
            {t('home.readMore')}
          </Link>
        </Alert>
      )}

      <section
        aria-labelledby="home-title"
        className="mt-6 overflow-hidden rounded-lg bg-surface md:mt-10"
      >
        <div className="px-4 pt-8 sm:px-8 md:pt-12">
          <h1 id="home-title" className="text-3xl font-bold md:text-5xl">
            {t('home.title')}
          </h1>
          <p className="mt-2 max-w-prose text-muted md:text-lg">{t('site.tagline')}</p>

          <form
            role="search"
            className="mt-6 max-w-2xl"
            onSubmit={(e) => {
              e.preventDefault()
              openSearch(query)
            }}
          >
            <label htmlFor="home-search" className="mb-2 block text-lg font-semibold">
              {t('home.searchLabel')}
            </label>
            <div className="flex gap-2">
              <input
                id="home-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('home.searchPlaceholder')}
                className="block min-h-tap w-full min-w-0 rounded-md border border-muted bg-bg px-3 text-base text-text placeholder:text-muted"
              />
              <Button type="submit">
                <Search aria-hidden className="size-5" />
                <span className="max-sm:sr-only">{t('header.search')}</span>
              </Button>
            </div>
          </form>
        </div>
        <CoastArt className="mt-6 h-20 md:mt-4 md:h-36" />
      </section>

      <Section title={t('home.quickActions')}>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {QUICK_ACTIONS.map(({ to, key, Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex h-full min-h-24 flex-col gap-2 rounded-lg border border-border bg-bg p-4 shadow-sm hover:border-primary hover:shadow-md motion-safe:transition motion-safe:hover:-translate-y-0.5"
              >
                <Icon aria-hidden className="size-6 text-primary" />
                <span className="font-semibold">{t(`nav.${key}`)}</span>
                <span className="text-sm text-muted max-sm:hidden">{t(`home.actions.${key}`)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t('home.latestNews')}>
        <ul className="grid gap-4 md:grid-cols-3">
          {latest.map((n) => (
            <li key={n.slug}>
              <Card className="h-full">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted">
                  <time dateTime={n.date}>{formatDate(n.date, i18n.language)}</time>
                  <SampleBadge sample={n.sample} />
                </div>
                <h3 className="font-bold">
                  <Link to={`/news/${n.slug}`} className="underline hover:text-primary">
                    {n.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-muted">{n.summary}</p>
              </Card>
            </li>
          ))}
        </ul>
        <Link to="/news" className="mt-4 inline-flex min-h-tap items-center text-primary underline">
          {t('home.allNews')}
        </Link>
      </Section>
    </Container>
  )
}
