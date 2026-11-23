import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'
import { CalendarCheck, Clock, ExternalLink, Hourglass, MapPin, Phone } from 'lucide-react'
import { FeedbackWidget } from '@/components/forms/FeedbackWidget'
import PageHeader from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Container, Section } from '@/components/ui/Container'
import { SampleBadge } from '@/components/ui/SampleBadge'
import { getOffice, getService } from '@/lib/content'
import { formatDate, formatPeso, pick, telHref } from '@/lib/format'
import NotFound from './NotFound'
import { useStructuredData } from '@/hooks/useStructuredData'
import { PRODUCTION_URL } from '@/lib/site'

export default function ServiceDetail() {
  const { t, i18n } = useTranslation()
  const service = getService(useParams().slug ?? '')
  const lang = i18n.language
  useStructuredData(
    'service-detail',
    service
      ? {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: pick(lang, service.title_en, service.title_fil),
          description:
            service.steps[0] ?? 'Information about a government service in Ternate, Cavite.',
          url: `${PRODUCTION_URL}/services/${service.slug}`,
          areaServed: {
            '@type': 'AdministrativeArea',
            name: 'Ternate, Cavite',
          },
        }
      : null,
  )

  if (!service) return <NotFound />

  const office = getOffice(service.office)
  const sampleSuffix = service.sample ? ` ${t('sample.suffix')}` : ''

  return (
    <Container className="pb-12">
      <PageHeader
        title={pick(lang, service.title_en, service.title_fil)}
        crumbs={[{ to: '/services', label: t('pages.services') }]}
      >
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
          <SampleBadge sample={service.sample} />
          <span>{t(`categories.${service.category}`)}</span>
        </div>
      </PageHeader>

      <div className="grid gap-x-10 lg:grid-cols-[1fr_20rem]">
        <div>
          {service.requirements.length > 0 && (
            <Section title={t('services.requirements')} className="pb-0 md:pb-0">
              <ul className="space-y-2">
                {service.requirements.map((r) => (
                  <li key={r}>
                    {/* Native checkbox: lets people tick items off while gathering documents. */}
                    <label className="flex min-h-tap cursor-pointer items-start gap-3">
                      <input type="checkbox" className="mt-1 size-5 shrink-0 accent-primary" />
                      <span>{r}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Section title={t('services.steps')} className="pb-0 md:pb-0">
            <ol className="space-y-3">
              {service.steps.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span
                    aria-hidden
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-contrast"
                  >
                    {i + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </Section>

          {service.fees.length > 0 && (
            <Section title={t('services.fees')} className="pb-0 md:pb-0">
              {/* Table on sm+, stacked cards below (labels come from data-label). */}
              <table className="w-full text-left max-sm:block">
                <thead className="max-sm:sr-only">
                  <tr className="border-b border-border">
                    <th scope="col" className="py-2 pr-4">
                      {t('services.feeItem')}
                    </th>
                    <th scope="col" className="py-2">
                      {t('services.feeAmount')}
                    </th>
                  </tr>
                </thead>
                <tbody className="max-sm:block max-sm:space-y-2">
                  {service.fees.map((f) => (
                    <tr
                      key={f.item}
                      className="border-b border-border max-sm:block max-sm:rounded-md max-sm:border max-sm:bg-surface max-sm:p-3"
                    >
                      <td
                        data-label={t('services.feeItem')}
                        className="py-2 pr-4 max-sm:block max-sm:py-0 max-sm:before:block max-sm:before:text-xs max-sm:before:text-muted max-sm:before:content-[attr(data-label)]"
                      >
                        {f.item}
                      </td>
                      <td
                        data-label={t('services.feeAmount')}
                        className="py-2 font-semibold max-sm:mt-2 max-sm:block max-sm:py-0 max-sm:before:block max-sm:before:text-xs max-sm:before:font-normal max-sm:before:text-muted max-sm:before:content-[attr(data-label)]"
                      >
                        {formatPeso(f.amount_php)}
                        {sampleSuffix}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          )}

          {service.html && (
            <Section title={t('services.notes')} className="pb-0 md:pb-0">
              {/* Rendered at build time with raw HTML disabled (scripts/markdown.ts). */}
              <div className="prose" dangerouslySetInnerHTML={{ __html: service.html }} />
            </Section>
          )}
        </div>

        <aside aria-label={t('services.whereToGo')} className="pt-8 md:pt-12">
          <Card className="space-y-3 text-sm">
            <h2 className="text-lg font-bold">{t('services.whereToGo')}</h2>
            {office && (
              <>
                <p className="font-semibold">{office.name}</p>
                <p className="flex gap-2">
                  <MapPin aria-hidden className="size-5 shrink-0 text-muted" />
                  {office.location}
                </p>
                {office.phone && (
                  <a
                    href={telHref(office.phone)}
                    className="flex min-h-tap items-center gap-2 underline"
                  >
                    <Phone aria-hidden className="size-5 shrink-0 text-muted" />
                    {office.phone}
                  </a>
                )}
              </>
            )}
            <p className="flex gap-2">
              <Clock aria-hidden className="size-5 shrink-0 text-muted" />
              <span>
                <span className="block font-medium">{t('services.schedule')}</span>
                {service.schedule}
              </span>
            </p>
            <p className="flex gap-2">
              <Hourglass aria-hidden className="size-5 shrink-0 text-muted" />
              <span>
                <span className="block font-medium">{t('services.processingTime')}</span>
                {service.processing_time}
              </span>
            </p>
            <p className="flex gap-2">
              <CalendarCheck aria-hidden className="size-5 shrink-0 text-muted" />
              <span>
                {t('services.lastVerified')}:{' '}
                <time dateTime={service.last_verified}>
                  {formatDate(service.last_verified, lang)}
                </time>
              </span>
            </p>
            <div className="border-t border-border pt-3">
              <a
                href={service.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-tap items-center gap-2 underline"
              >
                <ExternalLink aria-hidden className="size-4" />
                {t('services.source')}
              </a>
              <Link
                to={`/contact?category=correction&page=/services/${service.slug}`}
                className="flex min-h-tap items-center gap-2 text-primary underline"
              >
                {t('footer.report')}
              </Link>
            </div>
          </Card>
        </aside>
      </div>
      <FeedbackWidget />
    </Container>
  )
}
