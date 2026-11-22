// Renders the PWA PNG icons from public/favicon.svg using Playwright's Chromium.
// Run after changing the logo: node scripts/make-icons.mjs
import { readFileSync } from 'node:fs'
import { chromium } from '@playwright/test'

const svg = readFileSync('public/favicon.svg', 'utf8')
const browser = await chromium.launch()
const page = await browser.newPage()

async function render(file, size, maskable) {
  await page.setViewportSize({ width: size, height: size })
  // Maskable: full-bleed teal square with the mark inside the 80% safe zone.
  const html = maskable
    ? `<body style="margin:0;background:#0e6e73;display:grid;place-items:center;height:100vh">
         <div style="width:72%;height:72%">${svg}</div></body>`
    : `<body style="margin:0;background:transparent">${svg}</body>`
  await page.setContent(`<style>svg{width:100%;height:100%;display:block}</style>${html}`)
  await page.screenshot({ path: `public/${file}`, omitBackground: !maskable })
  console.log(`✓ public/${file}`)
}

await render('icon-192.png', 192, false)
await render('icon-512.png', 512, false)
await render('icon-maskable-512.png', 512, true)
await render('apple-touch-icon.png', 180, true)
await browser.close()
