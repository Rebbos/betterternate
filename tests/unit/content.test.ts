import { expect, test } from 'vitest'
import { parseMarkdownFile } from '../../scripts/markdown'
import {
  getBarangay,
  getBarangays,
  getHotlines,
  getNewsPost,
  getNewsPosts,
  getOffices,
  getOfficials,
  getService,
  getServices,
  getTourismSpots,
} from '@/lib/content'

test('loads all seed content', () => {
  expect(getServices()).toHaveLength(6)
  expect(getNewsPosts()).toHaveLength(3)
  expect(getBarangays()).toHaveLength(10)
  expect(getTourismSpots()).toHaveLength(4)
  expect(getHotlines().length).toBeGreaterThan(0)
  expect(getOffices().length).toBeGreaterThan(0)
  expect(getOfficials().length).toBeGreaterThan(0)
})

test('every placeholder person/contact record is flagged sample', () => {
  const all = [
    ...getServices(),
    ...getNewsPosts(),
    ...getHotlines(),
    ...getOffices(),
    ...getOfficials(),
    ...getBarangays(),
    ...getTourismSpots(),
  ]
  expect(all.every((r) => r.sample === true)).toBe(true)
})

test('service lookup includes rendered markdown body', () => {
  const s = getService('barangay-clearance')
  expect(s?.title_fil).toBe('Kumuha ng barangay clearance')
  expect(s?.html).toContain('<strong>Sample content.</strong>')
  expect(getService('nope')).toBeUndefined()
})

test('news is newest first and slugged by filename', () => {
  const dates = getNewsPosts().map((n) => n.date)
  expect(dates).toEqual([...dates].sort().reverse())
  expect(getNewsPost('2026-11-01-sample-town-event')?.html).toContain('<table>')
})

test('barangay lookup by slug', () => {
  expect(getBarangay('bucana')?.psgc_code).toBe('0402121003')
})

test('markdown rendering escapes raw HTML and drops javascript: links', () => {
  const { data, html } = parseMarkdownFile(
    '---\ntitle: X\n---\n<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n[click](javascript:alert(1))',
  )
  expect(data).toEqual({ title: 'X' })
  expect(html).not.toContain('<script')
  expect(html).not.toContain('<img')
  expect(html).not.toContain('href="javascript:')
  expect(html).toContain('&lt;script&gt;')
})

test('markdown without frontmatter still renders', () => {
  expect(parseMarkdownFile('# Hi').html).toBe('<h1>Hi</h1>\n')
})
