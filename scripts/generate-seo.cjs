const fs = require('node:fs')
const path = require('node:path')

const metadataPath = path.join(__dirname, '..', 'src', 'data', 'seo-metadata.json')
const outputPath = path.join(__dirname, '..', 'public', 'seo-metadata.json')

const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))

for (const [lang, routes] of Object.entries(metadata)) {
  const seenTitles = new Set()
  const seenDescriptions = new Set()

  for (const [route, entry] of Object.entries(routes)) {
    if (entry.title.length > 60) {
      throw new Error(`${lang}/${route}: title exceeds 60 characters`)
    }
    if (entry.description.length > 155) {
      throw new Error(`${lang}/${route}: description exceeds 155 characters`)
    }
    if (/los\s+bañ?os/i.test(entry.title + entry.description)) {
      throw new Error(`${lang}/${route}: contains Los Baños`)
    }
    if (seenTitles.has(entry.title)) {
      throw new Error(`${lang}: duplicate title "${entry.title}"`)
    }
    if (seenDescriptions.has(entry.description)) {
      throw new Error(`${lang}: duplicate description "${entry.description}"`)
    }
    seenTitles.add(entry.title)
    seenDescriptions.add(entry.description)
  }
}

fs.writeFileSync(outputPath, `${JSON.stringify(metadata, null, 2)}\n`)
console.log(`SEO metadata: ${Object.values(metadata).reduce((n, routes) => n + Object.keys(routes).length, 0)} entries`)
