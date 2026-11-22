import { useTranslation } from 'react-i18next'
import { Container, Section } from '@/components/ui/Container'

/** Temporary page body until Phase 4 builds the real page. */
export default function PagePlaceholder({
  titleKey,
  detail,
}: {
  titleKey: string
  detail?: string
}) {
  const { t } = useTranslation()
  return (
    <Container>
      <Section>
        <h1 className="mb-2 text-2xl font-bold md:text-3xl">{t(titleKey)}</h1>
        {detail && <p className="mb-2 text-sm text-muted">{detail}</p>}
        <p className="text-muted">{t('pages.comingSoon')}</p>
      </Section>
    </Container>
  )
}
