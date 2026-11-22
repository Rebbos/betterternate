const fs = require('node:fs')
const path = require('node:path')

const domain = 'https://betterternate.netlify.app'
const root = path.join(__dirname, '..')

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
}

function readMarkdownFiles(relativeDir) {
  return fs
    .readdirSync(path.join(root, relativeDir))
    .filter((file) => file.endsWith('.md'))
    .map((file) => fs.readFileSync(path.join(root, relativeDir, file), 'utf8'))
}

function frontmatterValue(markdown, key) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return undefined
  const line = match[1].split(/\r?\n/).find((entry) => entry.startsWith(`${key}:`))
  return line?.slice(key.length + 1).trim().replace(/^['"]|['"]$/g)
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const routes = [
  '/',
  '/services',
  '/hotlines',
  '/government',
  '/barangays',
  '/transparency',
  '/tourism',
  '/news',
  '/contact',
  '/about',
]

const barangays = readJson('content/data/barangays.json')
for (const barangay of barangays) routes.push(`/barangays/${barangay.slug}`)

const services = readMarkdownFiles('content/services')
for (const markdown of services) {
  const slug = frontmatterValue(markdown, 'slug')
  if (slug) routes.push(`/services/${slug}`)
}

const newsDir = path.join(root, 'content/news')
for (const file of fs.readdirSync(newsDir).filter((entry) => entry.endsWith('.md'))) {
  routes.push(`/news/${file.slice(0, -3)}`)
}

const uniqueRoutes = [...new Set(routes)]
const urls = uniqueRoutes
  .map((route) => `  <url>\n    <loc>${escapeXml(`${domain}${route}`)}</loc>\n  </url>`)
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
fs.writeFileSync(path.join(root, 'public/sitemap.xml'), sitemap)
console.log(`Sitemap: ${uniqueRoutes.length} public routes -> public/sitemap.xml`)
