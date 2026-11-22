import { useTranslation } from 'react-i18next'
import { ExternalLink, FileText } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/Alert'
import { Container, Section } from '@/components/ui/Container'
import { SampleBadge } from '@/components/ui/SampleBadge'
import { DOCUMENT_CATEGORIES } from '@/lib/categories'
import { getDocuments } from '@/lib/content'
import { BUDGET_URL } from '@/lib/site'

export default function Transparency() {
  const { t } = useTranslation()
  const docs = getDocuments()

  return (
    <Container className="pb-12">
      <PageHeader title={t('pages.transparency')} description={t('transparency.lead')} />

      <Alert tone="info" className="mt-6 max-w-2xl">
        {t('transparency.budgetNote')}{' '}
        <a href={BUDGET_URL} target="_blank" rel="noopener noreferrer" className="underline">
          {t('transparency.budgetLink')}
        </a>
      </Alert>

      {DOCUMENT_CATEGORIES.map((category) => {
        const items = docs.filter((d) => d.category === category)
        if (!items.length) return null
        return (
          <Section
            key={category}
            title={t(`transparency.categories.${category}`)}
            className="pb-0 md:pb-0"
          >
            <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
              {items.map((d) => (
                <li key={d.title}>
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-14 items-center gap-3 px-4 py-3 hover:bg-bg"
                  >
                    <FileText aria-hidden className="size-5 shrink-0 text-muted" />
                    <span className="mr-auto">
                      <span className="block font-medium underline">{d.title}</span>
                      <span className="text-sm text-muted">{d.year}</span>
                    </span>
                    <SampleBadge sample={d.sample} />
                    <ExternalLink aria-hidden className="size-4 shrink-0 text-muted" />
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )
      })}
    </Container>
  )
}
