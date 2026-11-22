/**
 * Validates everything in /content against src/lib/schemas.ts.
 * Usage: npm run validate:content   (exits 1 with readable errors on failure)
 * Optional arg: path to a content directory (defaults to ./content), used by tests.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { z } from 'zod'
import {
  barangaySchema,
  documentSchema,
  hotlineSchema,
  newsPostSchema,
  officeSchema,
  officialSchema,
  serviceSchema,
  tourismSpotSchema,
} from '../src/lib/schemas'
import { parseMarkdownFile } from './markdown'

const root = resolve(process.argv[2] ?? 'content')
const errors: string[] = []

const fail = (file: string, message: string) => errors.push(`✗ ${file}\n    ${message}`)

function check<T>(file: string, schema: z.ZodType<T>, value: unknown): T | undefined {
  const result = schema.safeParse(value)
  if (result.success) return result.data
  fail(file, z.prettifyError(result.error).replaceAll('\n', '\n    '))
}

function readJson(name: string): unknown {
  const file = join(root, 'data', `${name}.json`)
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch (e) {
    fail(`data/${name}.json`, (e as Error).message)
  }
}

function uniqueSlugs(label: string, items: { slug: string }[]) {
  const seen = new Set<string>()
  for (const { slug } of items) {
    if (seen.has(slug)) fail(label, `duplicate slug "${slug}"`)
    seen.add(slug)
  }
}

const markdownFiles = (dir: string) =>
  readdirSync(join(root, dir))
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({
      name: `${dir}/${f}`,
      file: f,
      ...parseMarkdownFile(readFileSync(join(root, dir, f), 'utf8')),
    }))

// JSON data files
const offices = check('data/offices.json', z.array(officeSchema), readJson('offices')) ?? []
const officials = check('data/officials.json', z.array(officialSchema), readJson('officials')) ?? []
const barangays = check('data/barangays.json', z.array(barangaySchema), readJson('barangays')) ?? []
const tourism = check('data/tourism.json', z.array(tourismSpotSchema), readJson('tourism')) ?? []
check('data/hotlines.json', z.array(hotlineSchema), readJson('hotlines'))
check('data/documents.json', z.array(documentSchema), readJson('documents'))

uniqueSlugs('data/offices.json', offices)
uniqueSlugs('data/barangays.json', barangays)
uniqueSlugs('data/tourism.json', tourism)

const officeSlugs = new Set(offices.map((o) => o.slug))
for (const o of officials) {
  if (!officeSlugs.has(o.office))
    fail('data/officials.json', `${o.name}: office "${o.office}" not found in offices.json`)
}

// Markdown: services + news
const services = markdownFiles('services').flatMap(({ name, file, data }) => {
  const s = check(name, serviceSchema, data)
  if (!s) return []
  if (basename(file, '.md') !== s.slug) fail(name, `filename must match slug "${s.slug}"`)
  if (!officeSlugs.has(s.office)) fail(name, `office "${s.office}" not found in offices.json`)
  return [s]
})
uniqueSlugs('content/services', services)

const news = markdownFiles('news').filter(({ name, data }) => check(name, newsPostSchema, data))

if (errors.length) {
  console.error(
    `Content validation failed (${errors.length} problem(s)):\n\n${errors.join('\n\n')}\n`,
  )
  process.exit(1)
}

console.log(
  `✓ Content valid: ${services.length} services, ${news.length} news, ${offices.length} offices, ` +
    `${officials.length} officials, ${barangays.length} barangays, ${tourism.length} tourism spots.`,
)
