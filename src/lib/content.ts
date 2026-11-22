import type { Barangay, Hotline, NewsPost, Office, Official, Service, TourismSpot } from './schemas'

/*
 * Content is validated against the zod schemas at build time (npm run validate:content,
 * run by `npm run build`), so loaders only cast and keep zod out of the page bundle.
 * ponytail: eager globs put all content in one chunk; switch to lazy globs if /content grows large.
 */

type MdFile = { data: unknown; html: string }

const json = import.meta.glob<unknown>('/content/data/*.json', { eager: true, import: 'default' })
const serviceFiles = import.meta.glob<MdFile>('/content/services/*.md', {
  eager: true,
  import: 'default',
})
const newsFiles = import.meta.glob<MdFile>('/content/news/*.md', { eager: true, import: 'default' })

const data = <T>(name: string) => (json[`/content/data/${name}.json`] ?? []) as T[]
const fileSlug = (path: string) => path.slice(path.lastIndexOf('/') + 1, -'.md'.length)

export type ServiceWithBody = Service & { html: string }
export type NewsPostWithBody = NewsPost & { slug: string; html: string }

const services: ServiceWithBody[] = Object.values(serviceFiles)
  .map((f) => ({ ...(f.data as Service), html: f.html }))
  .sort((a, b) => a.title_en.localeCompare(b.title_en))

const news: NewsPostWithBody[] = Object.entries(newsFiles)
  .map(([path, f]) => ({ ...(f.data as NewsPost), slug: fileSlug(path), html: f.html }))
  .sort((a, b) => b.date.localeCompare(a.date)) // newest first

export const getServices = () => services
export const getService = (slug: string) => services.find((s) => s.slug === slug)

export const getNewsPosts = () => news
export const getNewsPost = (slug: string) => news.find((n) => n.slug === slug)

export const getHotlines = () => data<Hotline>('hotlines')
export const getOfficials = () => data<Official>('officials')
export const getOffices = () => data<Office>('offices')
export const getOffice = (slug: string) => getOffices().find((o) => o.slug === slug)
export const getBarangays = () => data<Barangay>('barangays')
export const getBarangay = (slug: string) => getBarangays().find((b) => b.slug === slug)
export const getTourismSpots = () => data<TourismSpot>('tourism')
