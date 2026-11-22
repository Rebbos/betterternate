import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Container, Section } from '@/components/ui/Container'
import { SampleBadge } from '@/components/ui/SampleBadge'
import { getBarangays } from '@/lib/content'

export default function Barangays() {
  const { t } = useTranslation()
  const barangays = getBarangays()

  return (
    <Container className="pb-12">
      <PageHeader
        title={t('pages.barangays')}
        description={t('barangays.lead', { total: barangays.length })}
      />
      <Section className="pb-0 md:pb-0">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {barangays.map((b) => (
            <li key={b.slug}>
              <Link
                to={`/barangays/${b.slug}`}
                className="flex min-h-14 items-center gap-3 rounded-lg border border-border bg-surface p-4 shadow-sm hover:border-primary"
              >
                <span className="mr-auto font-semibold">{b.name}</span>
                <SampleBadge sample={b.sample} />
                <ChevronRight aria-hidden className="size-5 text-muted" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </Container>
  )
}
