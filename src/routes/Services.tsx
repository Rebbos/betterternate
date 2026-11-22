import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router'
import PageHeader from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Container, Section } from '@/components/ui/Container'
import { SampleBadge } from '@/components/ui/SampleBadge'
import { getServices } from '@/lib/content'
import { pick } from '@/lib/format'
import { SERVICE_CATEGORIES } from '@/lib/categories'

const chip =
  'inline-flex min-h-tap items-center rounded-full border border-muted px-4 text-sm aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-contrast'

export default function Services() {
  const { t, i18n } = useTranslation()
  const [params, setParams] = useSearchParams()
  const active = params.get('category')
  const services = getServices()

  const groups = SERVICE_CATEGORIES.map((category) => ({
    category,
    items: services.filter((s) => s.category === category),
  })).filter((g) => g.items.length && (!active || g.category === active))

  const setFilter = (category: string | null) =>
    setParams(category ? { category } : {}, { replace: true, preventScrollReset: true })

  return (
    <Container className="pb-12">
      <PageHeader title={t('pages.services')} description={t('services.lead')} />

      <div role="group" aria-label={t('services.filter')} className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          className={chip}
          aria-pressed={!active}
          onClick={() => setFilter(null)}
        >
          {t('services.all')}
        </button>
        {SERVICE_CATEGORIES.filter((c) => services.some((s) => s.category === c)).map((c) => (
          <button
            key={c}
            type="button"
            className={chip}
            aria-pressed={active === c}
            onClick={() => setFilter(c)}
          >
            {t(`categories.${c}`)}
          </button>
        ))}
      </div>

      {groups.map((g) => (
        <Section key={g.category} title={t(`categories.${g.category}`)} className="pb-0 md:pb-0">
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {g.items.map((s) => (
              <li key={s.slug}>
                <Card className="h-full">
                  <SampleBadge sample={s.sample} />
                  <h3 className="mt-2 font-bold">
                    <Link to={`/services/${s.slug}`} className="underline hover:text-primary">
                      {pick(i18n.language, s.title_en, s.title_fil)}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {t('services.processingTime')}: {s.processing_time}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </Container>
  )
}
