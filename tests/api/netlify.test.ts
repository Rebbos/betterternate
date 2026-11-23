// @vitest-environment node
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import type { Row } from '../../server/db'

const rows: Row[] = []
vi.mock('../../server/db', () => ({
  insertSubmission: vi.fn(async (r: Row) => void rows.push(r)),
}))

const { default: api, config } = await import('../../netlify/functions/api')

let siteverify: ReturnType<typeof vi.fn>
beforeEach(() => {
  rows.length = 0
  vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret')
  siteverify = vi.fn(async (_url: string, init: RequestInit) =>
    Response.json({ success: (init.body as FormData).get('response') === 'good' }),
  )
  vi.stubGlobal('fetch', siteverify)
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

const url = (path: string) => `https://example.netlify.app${path}`

test('config.path lists every API route', () => {
  expect([...config.path].sort()).toEqual(['/api/contact', '/api/feedback', '/api/health'])
})

test('GET /api/health → 200 ok', async () => {
  const res = await api(new Request(url('/api/health')))
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ ok: true })
})

test('unknown route or prototype key → 405, never a crash', async () => {
  expect((await api(new Request(url('/api/nope')))).status).toBe(405)
  expect((await api(new Request(url('/api/constructor')))).status).toBe(405)
})

test('wrong method → 405', async () => {
  expect((await api(new Request(url('/api/contact')))).status).toBe(405)
})

test('POST /api/feedback stores the row and passes the visitor IP to Turnstile', async () => {
  const res = await api(
    new Request(url('/api/feedback'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-nf-client-connection-ip': '203.0.113.9',
      },
      body: JSON.stringify({ helpful: true, page_url: '/', 'cf-turnstile-response': 'good' }),
    }),
  )
  expect(res.status).toBe(200)
  expect(rows).toHaveLength(1)
  expect((siteverify.mock.calls[0][1].body as FormData).get('remoteip')).toBe('203.0.113.9')
})
