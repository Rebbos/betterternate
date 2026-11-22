import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import PageHeader from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Container, Section } from '@/components/ui/Container'
import { SampleBadge } from '@/components/ui/SampleBadge'
import { getNewsPosts } from '@/lib/content'
import { formatDate } from '@/lib/format'

export default function News() {
  const { t, i18n } = useTranslation()

  return (
    <Container className="pb-12">
      <PageHeader title={t('pages.news')} description={t('news.lead')} />
      <Section className="max-w-3xl pb-0 md:pb-0">
        <ul className="divide-y divide-border">
          {getNewsPosts().map((n) => (
            <li key={n.slug} className="py-4">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
                <time dateTime={n.date}>{formatDate(n.date, i18n.language)}</time>
                <Badge tone={n.category === 'advisory' ? 'warning' : 'neutral'}>
                  {t(`news.categories.${n.category}`)}
                </Badge>
                <SampleBadge sample={n.sample} />
              </div>
              <h2 className="mt-1 text-lg font-bold">
                <Link to={`/news/${n.slug}`} className="underline hover:text-primary">
                  {n.title}
                </Link>
              </h2>
              <p className="mt-1 text-muted">{n.summary}</p>
            </li>
          ))}
        </ul>
      </Section>
    </Container>
  )
}
