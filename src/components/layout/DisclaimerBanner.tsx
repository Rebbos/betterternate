import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Container } from '@/components/ui/Container'

export default function DisclaimerBanner() {
  const { t } = useTranslation()
  return (
    <aside aria-label={t('disclaimer.label')} className="border-b border-border bg-surface text-sm">
      <Container className="py-2">
        {t('disclaimer.text')}{' '}
        <Link to="/about#official-channels" className="font-medium text-primary underline">
          {t('disclaimer.link')}
        </Link>
      </Container>
    </aside>
  )
}
