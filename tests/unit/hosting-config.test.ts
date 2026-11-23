// @vitest-environment node
/** vercel.json and netlify.toml must send the same security headers and SPA fallback. */
import { readFileSync } from 'node:fs'
import { expect, test } from 'vitest'

type Rules = Record<string, Record<string, string>>

const vercel = JSON.parse(readFileSync('vercel.json', 'utf8')) as {
  rewrites: { source: string; destination: string }[]
  headers: { source: string; headers: { key: string; value: string }[] }[]
}
const toml = readFileSync('netlify.toml', 'utf8')

// Vercel's /api headers are set by netlify/functions/api.ts on Netlify instead.
const vercelRules: Rules = Object.fromEntries(
  vercel.headers
    .filter((h) => !h.source.startsWith('/api/'))
    .map((h) => [
      h.source.replace('/(.*)', '/*'),
      Object.fromEntries(h.headers.map((x) => [x.key, x.value])),
    ]),
)

/** Reads the [[headers]] blocks of netlify.toml (flat `Key = "value"` lines only). */
function netlifyRules(): Rules {
  const rules: Rules = {}
  for (const block of toml.split('[[headers]]').slice(1)) {
    const body = block.split(/^\[\[(?!headers)/m)[0]
    const path = /for\s*=\s*"([^"]+)"/.exec(body)?.[1]
    const values = body.split('[headers.values]')[1] ?? ''
    if (!path) continue
    rules[path] = Object.fromEntries(
      [...values.matchAll(/^\s*([\w-]+)\s*=\s*"(.*)"\s*$/gm)].map((m) => [m[1], m[2]]),
    )
  }
  return rules
}

test('netlify.toml sends exactly the same headers as vercel.json', () => {
  expect(netlifyRules()).toEqual(vercelRules)
})

test('both hosts fall back to index.html for app routes, but not for /api', () => {
  expect(vercel.rewrites).toContainEqual({
    source: '/((?!api/).*)',
    destination: '/index.html',
  })
  expect(toml).toMatch(/from = "\/\*"\s+to = "\/index.html"\s+status = 200/)
  expect(readFileSync('netlify/functions/api.ts', 'utf8')).toMatch(/path: '\/api\/\*'/)
})
