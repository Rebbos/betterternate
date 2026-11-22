import Fuse from 'fuse.js'

/** Display order of result groups. */
export const SEARCH_TYPES = ['service', 'hotline', 'office', 'barangay', 'news', 'tourism'] as const
export type SearchType = (typeof SEARCH_TYPES)[number]

/** One row of public/search-index.json (built by scripts/build-search-index.ts). */
export type SearchEntry = {
  type: SearchType
  url: string
  title_en: string
  title_fil: string
  keywords: string[]
}

export function createSearcher(entries: SearchEntry[]) {
  const fuse = new Fuse(entries, {
    keys: [
      { name: 'title_en', weight: 2 },
      { name: 'title_fil', weight: 2 },
      { name: 'keywords', weight: 1 },
    ],
    threshold: 0.35, // tolerates typos like "sedula"
    ignoreLocation: true, // match words anywhere in long titles
  })
  return (query: string, limit = 20) =>
    query.trim() ? fuse.search(query.trim(), { limit }).map((r) => r.item) : []
}
