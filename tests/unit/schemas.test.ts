import { describe, expect, test } from 'vitest'
import {
  barangaySchema,
  hotlineSchema,
  newsPostSchema,
  serviceSchema,
  tourismSpotSchema,
} from '@/lib/schemas'

const service = {
  slug: 'barangay-clearance',
  title_en: 'Get a barangay clearance',
  title_fil: 'Kumuha ng barangay clearance',
  category: 'permits',
  office: 'barangay-hall',
  requirements: ['Valid ID'],
  steps: ['Go to the barangay hall.'],
  fees: [{ item: 'Fee (sample)', amount_php: 0 }],
  processing_time: 'Same day',
  schedule: 'Mon–Fri',
  last_verified: '2026-11-21',
  source_url: 'https://example.com/source',
  sample: true,
}

describe('serviceSchema', () => {
  test('accepts a valid service', () => {
    expect(serviceSchema.safeParse(service).success).toBe(true)
  })

  test.each([
    ['unknown category', { category: 'parking' }],
    ['non-ISO date', { last_verified: '21/11/2026' }],
    ['javascript: source url', { source_url: 'javascript:alert(1)' }],
    ['negative fee', { fees: [{ item: 'x', amount_php: -1 }] }],
    ['no steps', { steps: [] }],
    ['bad slug', { slug: 'Barangay Clearance' }],
  ])('rejects %s', (_, patch) => {
    expect(serviceSchema.safeParse({ ...service, ...patch }).success).toBe(false)
  })
})

test('hotline requires at least one well-formed number', () => {
  const base = { name: 'Police', agency: 'PNP', type: 'emergency', available_24_7: true }
  expect(hotlineSchema.safeParse({ ...base, numbers: ['0900-000-0000'] }).success).toBe(true)
  expect(hotlineSchema.safeParse({ ...base, numbers: [] }).success).toBe(false)
  expect(hotlineSchema.safeParse({ ...base, numbers: ['call me'] }).success).toBe(false)
})

test('barangay needs a 10-digit PSGC code and a verified flag', () => {
  const b = { slug: 'bucana', name: 'Bucana', psgc_code: '0402121003', verified: false }
  expect(barangaySchema.safeParse(b).success).toBe(true)
  expect(barangaySchema.safeParse({ ...b, psgc_code: '042121003' }).success).toBe(false)
  expect(barangaySchema.safeParse({ ...b, verified: undefined }).success).toBe(false)
})

test('tourism coordinates must be near Ternate (catches swapped lat/lng)', () => {
  const spot = {
    slug: 'sample-beach',
    name: 'Sample Beach',
    category: 'beach',
    description_en: 'x',
    description_fil: 'x',
    lat: 14.29,
    lng: 120.7,
  }
  expect(tourismSpotSchema.safeParse(spot).success).toBe(true)
  expect(tourismSpotSchema.safeParse({ ...spot, lat: 120.7, lng: 14.29 }).success).toBe(false)
})

test('news source_url is optional but must be http(s)', () => {
  const post = { title: 'T', date: '2026-11-20', category: 'advisory', summary: 'S' }
  expect(newsPostSchema.safeParse(post).success).toBe(true)
  expect(newsPostSchema.safeParse({ ...post, source_url: 'ftp://x.org' }).success).toBe(false)
})
