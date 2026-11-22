import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import seoMetadata from '@/data/seo-metadata.json'

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.append(el)
  }
  el.content = content
}

function setLinkRel(key: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${key}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', key)
    document.head.append(el)
  }
  el.href = href
}

type SeoEntry = {
  title: string
  description: string
}

type SeoMetadata = {
  en: Record<string, SeoEntry>
  fil: Record<string, SeoEntry>
}

const metadata = seoMetadata as SeoMetadata

function routeKey(pathname: string) {
  if (pathname === '/') return 'home'
  if (/^\/services\/[^/]+/.test(pathname)) return 'service-detail'
  if (/^\/barangays\/[^/]+/.test(pathname)) return 'barangay-detail'
  if (/^\/news\/[^/]+/.test(pathname)) return 'news-detail'

  const known = [
    'services',
    'hotlines',
    'government',
    'barangays',
    'transparency',
    'tourism',
    'news',
    'contact',
    'about',
  ]
  const key = pathname.replace(/^\//, '').split('/')[0]
  return known.includes(key) ? key : 'not-found'
}

function titleWithinLimit(pageTitle: string, site: string) {
  const suffix = ` — ${site}`
  if (pageTitle.length + suffix.length <= 60) return `${pageTitle}${suffix}`
  if (suffix.length >= 60) return suffix.slice(0, 60).trimEnd()
  return `${pageTitle.slice(0, 60 - suffix.length).trimEnd()}${suffix}`
}

function descriptionWithinLimit(description: string) {
  return description.length <= 155 ? description : `${description.slice(0, 152).trimEnd()}...`
}

/**
 * Per-page <title>, description and Open Graph tags (updates the defaults in index.html).
 */
export function usePageMeta(title?: string, description?: string) {
  const { t, i18n } = useTranslation()
  const routeLocation = useLocation()
  const site = t('site.name')
  const lang = i18n.resolvedLanguage?.startsWith('fil') ? 'fil' : 'en'
  const route = routeKey(routeLocation.pathname)
  const routeMetadata = metadata[lang][route] ?? metadata.en[route]
  const pageTitle = title ?? routeMetadata?.title ?? site
  const fullTitle = pageTitle === site ? site : titleWithinLimit(pageTitle, site)
  const rawDescription = description ?? routeMetadata?.description ?? t('site.tagline')
  const desc = descriptionWithinLimit(rawDescription)

  useEffect(() => {
    document.title = fullTitle
    document.documentElement.lang = lang
    setMeta('name', 'description', desc)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:url', `${location.origin}${routeLocation.pathname}`)
    setLinkRel('canonical', `${location.origin}${routeLocation.pathname}`)
  }, [fullTitle, desc, lang, routeLocation.pathname])
}
