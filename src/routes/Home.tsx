import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation()
  return (
    <main className="min-h-dvh bg-bg p-4 text-text">
      <h1 className="text-2xl font-bold">{t('home.title')}</h1>
      <p className="text-muted">{t('home.placeholder')}</p>
    </main>
  )
}
