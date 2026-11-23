import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { usePageMeta } from '@/hooks/usePageMeta'
import { PRODUCTION_URL } from '@/lib/site'

export type Crumb = { to: string; label: string }

/** Page <h1> + lead text + breadcrumbs (when `crumbs` given), and sets the page's meta tags. */
export default function PageHeader({
  title,
  description,
  crumbs,
  children,
}: {
  title: string
  description?: string
  crumbs?: Crumb[]
  children?: ReactNode
}) {
  const { t } = useTranslation()
  const breadcrumbItems = crumbs
    ? [
        { name: t('breadcrumb.home'), item: `${PRODUCTION_URL}/` },
        ...crumbs.map((crumb) => ({
          name: crumb.label,
          item: `${PRODUCTION_URL}${crumb.to}`,
        })),
        { name: title, item: `${PRODUCTION_URL}${window.location.pathname}` },
      ]
    : undefined
  usePageMeta(title, description, breadcrumbItems)

  return (
    <div className="pt-6 md:pt-10">
      {crumbs && (
        <nav aria-label={t('breadcrumb.label')} className="mb-3 text-sm">
          <ol className="flex flex-wrap items-center gap-1 text-muted">
            {[{ to: '/', label: t('breadcrumb.home') }, ...crumbs].map((c) => (
              <li key={c.to} className="flex items-center gap-1">
                <Link to={c.to} className="underline hover:text-primary">
                  {c.label}
                </Link>
                <ChevronRight aria-hidden className="size-4" />
              </li>
            ))}
            <li aria-current="page" className="text-text">
              {title}
            </li>
          </ol>
        </nav>
      )}
      <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
      {description && <p className="mt-2 max-w-prose text-muted">{description}</p>}
      {children}
    </div>
  )
}
