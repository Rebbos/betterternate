import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import PageHeader from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/Alert'
import { Container, Section } from '@/components/ui/Container'
import { REPO_URL, REPORT_URL } from '@/lib/site'

const ext = { target: '_blank', rel: 'noopener noreferrer', className: 'text-primary underline' }

export default function About() {
  const { t } = useTranslation()

  return (
    <Container className="max-w-3xl pb-12">
      <PageHeader title={t('pages.about')} description={t('about.lead')} />

      <Section title={t('about.purposeTitle')} className="pb-0 md:pb-0">
        <p>{t('about.purpose')}</p>
      </Section>

      <Section id="official-channels" title={t('about.officialTitle')} className="pb-0 md:pb-0">
        <Alert tone="warning">{t('disclaimer.text')}</Alert>
        <p className="mt-4">{t('about.official')}</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>{t('about.officialHall')}</li>
          <li>
            <Link to="/hotlines" className="text-primary underline">
              {t('about.officialHotlines')}
            </Link>
          </li>
          <li>
            <a href="https://www.gov.ph" {...ext}>
              {t('about.officialGovPh')}
            </a>
          </li>
        </ul>
        <p className="mt-3 text-sm text-muted">{t('about.officialPending')}</p>
      </Section>

      <Section title={t('about.sourcesTitle')} className="pb-0 md:pb-0">
        <p>{t('about.sources')}</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>{t('about.sourcePsgc')}</li>
          <li>{t('about.sourceVolunteers')}</li>
          <li>{t('about.sourceOsm')}</li>
        </ul>
      </Section>

      <Section title={t('about.contributeTitle')} className="pb-0 md:pb-0">
        <p>{t('about.contribute')}</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>
            <a href={REPORT_URL} {...ext}>
              {t('footer.report')}
            </a>
          </li>
          <li>
            <a href={REPO_URL} {...ext}>
              {t('footer.source')}
            </a>
          </li>
        </ul>
      </Section>

      <Section id="privacy" title={t('about.privacyTitle')} className="pb-0 md:pb-0">
        <div className="space-y-3">
          <p>{t('about.privacyIntro')}</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>{t('about.privacyStorage')}</li>
            <li>{t('about.privacyForms')}</li>
            <li>{t('about.privacyThirdParty')}</li>
            <li>{t('about.privacyRights')}</li>
          </ul>
        </div>
      </Section>
    </Container>
  )
}
