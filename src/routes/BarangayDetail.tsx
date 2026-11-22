import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import PageHeader from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/Alert'
import { Card } from '@/components/ui/Card'
import { Container, Section } from '@/components/ui/Container'
import { SampleBadge } from '@/components/ui/SampleBadge'
import { getBarangay } from '@/lib/content'
import { telHref } from '@/lib/format'
import { REPORT_URL } from '@/lib/site'
import NotFound from './NotFound'

export default function BarangayDetail() {
  const { t } = useTranslation()
  const b = getBarangay(useParams().slug ?? '')
  if (!b) return <NotFound />

  return (
    <Container className="pb-12">
      <PageHeader
        title={t('barangays.title', { name: b.name })}
        crumbs={[{ to: '/barangays', label: t('pages.barangays') }]}
      >
        <div className="mt-3">
          <SampleBadge sample={b.sample} />
        </div>
      </PageHeader>

      <Section className="max-w-2xl pb-0 md:pb-0">
        {!b.verified && (
          <Alert tone="warning" className="mb-4">
            {t('barangays.unverified')}{' '}
            <a href={REPORT_URL} target="_blank" rel="noopener noreferrer" className="underline">
              {t('footer.report')}
            </a>
          </Alert>
        )}
        <Card>
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr]">
            {b.captain && (
              <>
                <dt className="font-medium text-muted">{t('barangays.captain')}</dt>
                <dd>{b.captain}</dd>
              </>
            )}
            {b.hall_address && (
              <>
                <dt className="font-medium text-muted">{t('barangays.hall')}</dt>
                <dd>{b.hall_address}</dd>
              </>
            )}
            {b.hotline && (
              <>
                <dt className="font-medium text-muted">{t('barangays.hotline')}</dt>
                <dd>
                  <a
                    href={telHref(b.hotline)}
                    className="inline-flex min-h-tap items-center underline"
                  >
                    {b.hotline}
                  </a>
                </dd>
              </>
            )}
            <dt className="font-medium text-muted">{t('barangays.psgc')}</dt>
            <dd>{b.psgc_code}</dd>
          </dl>
        </Card>
      </Section>
    </Container>
  )
}
