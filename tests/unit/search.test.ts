import { expect, test } from 'vitest'
import { buildSearchIndex } from '../../scripts/build-search-index'
import { createSearcher } from '@/lib/search'

const index = buildSearchIndex()
const search = createSearcher(index)
const top = (q: string) => search(q)[0]?.url

test('index covers every content type', () => {
  const types = new Set(index.map((e) => e.type))
  expect([...types].sort()).toEqual(['barangay', 'hotline', 'news', 'office', 'service', 'tourism'])
})

test.each([
  // English
  ['barangay clearance', '/services/barangay-clearance'],
  ['business permit', '/services/business-permit'],
  ['birth certificate', '/services/birth-certificate'],
  ['police', '/hotlines'],
  ['san juan', '/barangays/san-juan-i'],
  // Filipino
  ['amilyar', '/services/real-property-tax'],
  ['tulong medikal', '/services/medical-assistance'],
  ['kapanganakan', '/services/birth-certificate'],
  ['buwis', '/services/cedula'],
  // Typo
  ['sedula', '/services/cedula'],
])('"%s" → %s', (query, url) => {
  const urls = search(query)
    .slice(0, 3)
    .map((e) => e.url)
  expect(urls).toContain(url)
})

test('blank query returns nothing', () => {
  expect(top('   ')).toBeUndefined()
})
