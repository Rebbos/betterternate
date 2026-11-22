import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.append(el)
  }
  el.content = content
}

/**
 * Per-page <title>, description and Open Graph tags (updates the defaults in index.html).
 * ponytail: client-side only; social crawlers that don't run JS see the index.html
 * defaults. Prerender or a Pages Function can inject per-route tags if previews matter.
 */
export function usePageMeta(title?: string, description?: string) {
  const { t } = useTranslation()
  const site = t('site.name')
  const fullTitle = title ? `${title} · ${site}` : site
  const desc = description ?? t('site.tagline')

  useEffect(() => {
    document.title = fullTitle
    setMeta('name', 'description', desc)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:url', location.href)
  }, [fullTitle, desc])
}
