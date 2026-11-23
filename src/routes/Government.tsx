import { useTranslation } from 'react-i18next'
import { Clock, Mail, MapPin, Phone, UserRound } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Container, Section } from '@/components/ui/Container'
import { SampleBadge } from '@/components/ui/SampleBadge'
import { getOffice, getOffices, getOfficials } from '@/lib/content'
import { formatDate, telHref } from '@/lib/format'
import { useStructuredData } from '@/hooks/useStructuredData'
import { PRODUCTION_URL } from '@/lib/site'

const row = 'flex items-start gap-2'
const icon = 'mt-0.5 size-4 shrink-0 text-muted'

export default function Government() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  useStructuredData('government', {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: 'Municipality of Ternate',
    url: `${PRODUCTION_URL}/government`,
    description: 'Municipal government entity in Ternate, Cavite.',
    disambiguatingDescription:
      'Unofficial community portal; this record is not the official website of the Municipality of Ternate.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ternate',
      addressRegion: 'Cavite',
      addressCountry: 'PH',
    },
  })

  return (
    <Container className="pb-12">
      <PageHeader title={t('pages.government')} description={t('government.lead')} />

      <Section title={t('government.officials')} className="pb-0 md:pb-0">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {getOfficials().map((o) => (
            <li key={`${o.name}-${o.position}`}>
              <Card className="h-full text-sm">
                <div
                  aria-hidden
                  className="mb-3 flex size-14 items-center justify-center rounded-full bg-bg"
                >
                  <UserRound className="size-8 text-muted" />
                </div>
                <SampleBadge sample={o.sample} />
                <h3 className="mt-2 text-base font-bold">{o.name}</h3>
                <p>{o.position}</p>
                <p className="mt-1 text-muted">
                  {t('government.term', {
                    start: formatDate(o.term_start, lang),
                    end: formatDate(o.term_end, lang),
                  })}
                </p>
                <p className="mt-1 text-muted">{getOffice(o.office)?.name}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t('government.offices')} className="pb-0 md:pb-0">
        <ul className="grid gap-4 md:grid-cols-2">
          {getOffices().map((o) => (
            <li key={o.slug} id={o.slug}>
              <Card className="h-full space-y-2 text-sm">
                <SampleBadge sample={o.sample} />
                <h3 className="text-base font-bold">{o.name}</h3>
                {o.head && (
                  <p className={row}>
                    <UserRound aria-hidden className={icon} />
                    {o.head}
                  </p>
                )}
                <p className={row}>
                  <MapPin aria-hidden className={icon} />
                  {o.location}
                </p>
                <p className={row}>
                  <Clock aria-hidden className={icon} />
                  {o.hours}
                </p>
                {o.phone && (
                  <a href={telHref(o.phone)} className={`${row} min-h-tap items-center underline`}>
                    <Phone aria-hidden className={icon} />
                    {o.phone}
                  </a>
                )}
                {o.email && (
                  <a
                    href={`mailto:${o.email}`}
                    className={`${row} min-h-tap items-center underline`}
                  >
                    <Mail aria-hidden className={icon} />
                    {o.email}
                  </a>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </Section>
    </Container>
  )
}
