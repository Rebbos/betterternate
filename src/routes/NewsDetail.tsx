import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { ExternalLink } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Container } from '@/components/ui/Container'
import { SampleBadge } from '@/components/ui/SampleBadge'
import { getNewsPost } from '@/lib/content'
import { formatDate } from '@/lib/format'
import NotFound from './NotFound'

export default function NewsDetail() {
  const { t, i18n } = useTranslation()
  const post = getNewsPost(useParams().slug ?? '')
  if (!post) return <NotFound />

  return (
    <Container className="pb-12">
      <article>
        <PageHeader
          title={post.title}
          description={post.summary}
          crumbs={[{ to: '/news', label: t('pages.news') }]}
        >
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
            <time dateTime={post.date}>{formatDate(post.date, i18n.language)}</time>
            <Badge tone={post.category === 'advisory' ? 'warning' : 'neutral'}>
              {t(`news.categories.${post.category}`)}
            </Badge>
            <SampleBadge sample={post.sample} />
          </div>
        </PageHeader>
        {/* Rendered at build time with raw HTML disabled (scripts/markdown.ts). */}
        <div className="prose mt-8" dangerouslySetInnerHTML={{ __html: post.html }} />
        {post.source_url && (
          <a
            href={post.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-tap items-center gap-2 text-primary underline"
          >
            <ExternalLink aria-hidden className="size-4" />
            {t('news.source')}
          </a>
        )}
      </article>
    </Container>
  )
}
