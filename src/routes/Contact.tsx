import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import PageHeader from '@/components/layout/PageHeader'
import ContactForm from '@/components/forms/ContactForm'
import { Alert } from '@/components/ui/Alert'
import { Container, Section } from '@/components/ui/Container'

export default function Contact() {
  const { t } = useTranslation()
  return (
    <Container className="pb-12">
      <PageHeader title={t('pages.contact')} description={t('contact.lead')} />
      <Alert tone="warning" className="mt-6 max-w-xl">
        {t('contact.notOfficial')}{' '}
        <Link to="/hotlines" className="underline">
          {t('nav.hotlines')}
        </Link>
      </Alert>
      <Section className="pt-6 md:pt-8">
        <ContactForm />
      </Section>
    </Container>
  )
}
