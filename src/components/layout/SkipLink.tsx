import { useTranslation } from 'react-i18next'

export default function SkipLink() {
  const { t } = useTranslation()
  return (
    <a
      href="#main"
      className="sr-only rounded-md bg-primary px-4 py-3 text-primary-contrast focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
    >
      {t('skipLink')}
    </a>
  )
}
