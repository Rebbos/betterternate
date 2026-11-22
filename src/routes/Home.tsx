import { useTranslation } from 'react-i18next'
import { Container, Section } from '@/components/ui/Container'

export default function Home() {
  const { t } = useTranslation()
  return (
    <Container>
      <Section>
        <h1 className="mb-2 text-2xl font-bold md:text-3xl">{t('home.title')}</h1>
        <p className="text-muted">{t('home.placeholder')}</p>
      </Section>
    </Container>
  )
}
