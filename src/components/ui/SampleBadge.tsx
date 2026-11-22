import { useTranslation } from 'react-i18next'
import { Badge } from './Badge'

/** Marks a placeholder record. Renders nothing unless `sample` is true. */
export function SampleBadge({ sample }: { sample?: boolean }) {
  const { t } = useTranslation()
  if (!sample) return null
  return (
    <Badge tone="warning" title={t('sample.hint')}>
      {t('sample.badge')}
    </Badge>
  )
}
