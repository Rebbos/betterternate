import { useTranslation } from 'react-i18next'
import { ButtonLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'

export default function NotFound() {
  const { t } = useTranslation()
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
