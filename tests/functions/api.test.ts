// @vitest-environment node
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { onRequestPost as contact } from '../../functions/api/contact'
import { onRequestPost as feedback } from '../../functions/api/feedback'
import { onRequest as middleware } from '../../functions/api/_middleware'
import type { Env } from '../../server/submit'

type Ctx = Parameters<PagesFunction<Env>>[0]

let rows: unknown[][]
let siteverify: ReturnType<typeof vi.fn>

const env: Env = {
  TURNSTILE_SECRET_KEY: 'test-secret',
  DB: {
    prepare: () => ({
      bind: (...args: unknown[]) => ({ run: async () => void rows.push(args) }),
    }),
  } as unknown as D1Database,
}

// Mock Cloudflare siteverify: only the token "good" passes.
beforeEach(() => {
  rows = []
  siteverify = vi.fn(async (_url: string, init: RequestInit) => {
    const token = (init.body as FormData).get('response')
    return Response.json({ success: token === 'good' })
  })
  vi.stubGlobal('fetch', siteverify)
})
afterEach(() => vi.unstubAllGlobals())

function call(fn: PagesFunction<Env>, body: unknown) {
  const request = new Request('https://example.com/api/x', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.7' },
    body: JSON.stringify(body),
  })
  return fn({ request, env } as unknown as Ctx)
}

const validContact = {
  anonymous: false,
  name: 'John Doe',
  email: 'johndoe@example.com',
  category: 'question',
  message: 'When is the municipal hall open?',
}

test('missing token → 403, siteverify not called, nothing stored', async () => {
  const res = await call(contact, validContact)
  expect(res.status).toBe(403)
  expect(siteverify).not.toHaveBeenCalled()
  expect(rows).toHaveLength(0)
})

test('invalid token → 403, nothing stored', async () => {
  const res = await call(contact, { ...validContact, 'cf-turnstile-response': 'bad' })
  expect(res.status).toBe(403)
  expect(await res.json()).toEqual({ ok: false, error: 'verification_failed' })
  expect(rows).toHaveLength(0)
})

test('valid token → 200, siteverify gets secret + token + IP, row stored', async () => {
  const res = await call(contact, { ...validContact, 'cf-turnstile-response': 'good' })
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ ok: true })

  const [url, init] = siteverify.mock.calls[0]
  expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify')
  const sent = init.body as FormData
  expect(sent.get('secret')).toBe('test-secret')
  expect(sent.get('response')).toBe('good')
  expect(sent.get('remoteip')).toBe('203.0.113.7')

  expect(rows).toEqual([
    ['contact', 'question', validContact.message, 'John Doe', 'johndoe@example.com', null],
  ])
})

test('siteverify unreachable → 403 (fail closed)', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')))
  const res = await call(contact, { ...validContact, 'cf-turnstile-response': 'good' })
  expect(res.status).toBe(403)
})

test('valid token but bad fields → 400 listing the fields', async () => {
  const res = await call(contact, {
    ...validContact,
    email: 'not-an-email',
    message: 'short',
    'cf-turnstile-response': 'good',
  })
  expect(res.status).toBe(400)
  expect(await res.json()).toMatchObject({ error: 'invalid', fields: ['email', 'message'] })
  expect(rows).toHaveLength(0)
})

test('honeypot filled → rejected before verification', async () => {
  const res = await call(contact, {
    ...validContact,
    website: 'http://spam.example',
    'cf-turnstile-response': 'good',
  })
  expect(res.status).toBe(400)
  expect(siteverify).not.toHaveBeenCalled()
  expect(rows).toHaveLength(0)
})

test('anonymous contact never stores name or email', async () => {
  const res = await call(contact, {
    ...validContact,
    anonymous: true,
    'cf-turnstile-response': 'good',
  })
  expect(res.status).toBe(200)
  expect(rows[0]).toEqual(['contact', 'question', validContact.message, null, null, null])
})

test('non-anonymous contact requires an email', async () => {
  const res = await call(contact, { ...validContact, email: '', 'cf-turnstile-response': 'good' })
  expect(res.status).toBe(400)
})

test('feedback: valid → 200 and stored as helpful/not-helpful', async () => {
  const res = await call(feedback, {
    helpful: false,
    comment: 'Fees are missing',
    page_url: '/services/cedula',
    'cf-turnstile-response': 'good',
  })
  expect(res.status).toBe(200)
  expect(rows).toEqual([
    ['feedback', 'not-helpful', 'Fees are missing', null, null, '/services/cedula'],
  ])
})

test('feedback: missing token → 403', async () => {
  const res = await call(feedback, { helpful: true, page_url: '/' })
  expect(res.status).toBe(403)
})

test('non-JSON body → 400', async () => {
  const request = new Request('https://example.com/api/contact', { method: 'POST', body: 'x=1' })
  const res = await contact({ request, env } as unknown as Ctx)
  expect(res.status).toBe(400)
})

test('middleware: thrown errors become JSON 500 with security headers', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  const res = await middleware({
    next: () => Promise.reject(new Error('boom')),
  } as unknown as Parameters<PagesFunction>[0])
  expect(res.status).toBe(500)
  expect(await res.json()).toEqual({ ok: false, error: 'server_error' })
  expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff')
  expect(res.headers.get('Cache-Control')).toBe('no-store')
})
