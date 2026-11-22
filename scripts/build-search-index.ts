/**
 * Builds public/search-index.json from /content (run by `npm run build` and `npm run dev`).
 * Each entry has EN + FIL titles plus keywords so searches work in either language.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { Barangay, Hotline, NewsPost, Office, Service, TourismSpot } from '../src/lib/schemas'
import type { SearchEntry } from '../src/lib/search'
import { parseMarkdownFile } from './markdown'

type Locale = Record<string, Record<string, unknown>>

export function buildSearchIndex(root = 'content', localeDir = 'src/i18n/locales'): SearchEntry[] {
  const json = <T>(name: string) =>
    JSON.parse(readFileSync(join(root, 'data', `${name}.json`), 'utf8')) as T[]
  const md = <T>(dir: string) =>
    readdirSync(join(root, dir))
      .filter((f) => f.endsWith('.md'))
      .map((f) => ({
        slug: f.slice(0, -3),
        data: parseMarkdownFile(readFileSync(join(root, dir, f), 'utf8')).data as T,
      }))

  // Category / type labels in both languages double as keywords ("buwis", "kalusugan", ...).
  const locales = ['en', 'fil'].map(
    (l) => JSON.parse(readFileSync(join(localeDir, `${l}.json`), 'utf8')) as Locale,
  )
  const labels = (group: string, sub: string | null, key: string) =>
    locales.map((l) => {
      const g = l[group] as Record<string, unknown>
      const scope = (sub ? g[sub] : g) as Record<string, string>
      return scope[key] ?? ''
    })

  const services = md<Service>('services').map(({ data: s }) => ({
    type: 'service' as const,
    url: `/services/${s.slug}`,
    title_en: s.title_en,
    title_fil: s.title_fil,
    keywords: [...labels('categories', null, s.category), ...(s.keywords ?? [])],
  }))

  const offices = json<Office>('offices').map((o) => ({
    type: 'office' as const,
    url: `/government#${o.slug}`,
    title_en: o.name,
    title_fil: o.name,
    keywords: o.head ? [o.head] : [],
  }))

  const hotlines = json<Hotline>('hotlines').map((h) => ({
    type: 'hotline' as const,
    url: '/hotlines',
    title_en: h.name,
    title_fil: h.name,
    keywords: [h.agency, ...labels('hotlines', 'types', h.type), ...h.numbers],
  }))

  const barangays = json<Barangay>('barangays').map((b) => ({
    type: 'barangay' as const,
    url: `/barangays/${b.slug}`,
    title_en: `Barangay ${b.name}`,
    title_fil: `Barangay ${b.name}`,
    keywords: [b.name],
  }))

  const news = md<NewsPost>('news').map(({ slug, data: n }) => ({
    type: 'news' as const,
    url: `/news/${slug}`,
    title_en: n.title,
    title_fil: n.title,
    keywords: [n.summary],
  }))

  const tourism = json<TourismSpot>('tourism').map((s) => ({
    type: 'tourism' as const,
    url: '/tourism',
    title_en: s.name,
    title_fil: s.name,
    keywords: labels('tourism', 'categories', s.category),
  }))

  return [...services, ...offices, ...hotlines, ...barangays, ...news, ...tourism]
}

// Run as a script (not when imported by tests).
if (import.meta.url === pathToFileURL(resolve(process.argv[1] ?? '')).href) {
  const index = buildSearchIndex()
  mkdirSync('public', { recursive: true })
  writeFileSync('public/search-index.json', JSON.stringify(index))
  console.log(`✓ Search index: ${index.length} entries → public/search-index.json`)
}
