import { useTranslation } from 'react-i18next'
import { ButtonLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function NotFound() {
  const { t } = useTranslation()
  usePageMeta(t('notFound.title'))
  return (
    <Container>
      <Section>
        <h1 className="mb-2 text-2xl font-bold md:text-3xl">{t('notFound.title')}</h1>
        <p className="mb-6 text-muted">{t('notFound.text')}</p>
        <ButtonLink to="/">{t('notFound.home')}</ButtonLink>
      </Section>
    </Container>
  )
}
