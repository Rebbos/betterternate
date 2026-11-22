// @vitest-environment node
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import type { Row } from '../../server/db'

// Fake database: capture rows instead of talking to Postgres.
const rows: Row[] = []
vi.mock('../../server/db', () => ({
  insertSubmission: vi.fn(async (r: Row) => void rows.push(r)),
}))

const { POST: contact } = await import('../../api/contact')
const { POST: feedback } = await import('../../api/feedback')

let siteverify: ReturnType<typeof vi.fn>

// Mock Cloudflare siteverify: only the token "good" passes.
beforeEach(() => {
  rows.length = 0
  vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret')
  siteverify = vi.fn(async (_url: string, init: RequestInit) => {
    const token = (init.body as FormData).get('response')
    return Response.json({ success: token === 'good' })
  })
  vi.stubGlobal('fetch', siteverify)
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

const call = (fn: (r: Request) => Promise<Response>, body: unknown) =>
  fn(
    new Request('https://example.com/api/x', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-real-ip': '203.0.113.7' },
      body: JSON.stringify(body),
    }),
  )

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
    {
      type: 'contact',
      category: 'question',
      message: validContact.message,
      name: 'John Doe',
      email: 'johndoe@example.com',
      page_url: undefined,
    },
  ])
})

test('siteverify unreachable → 403 (fail closed)', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')))
  const res = await call(contact, { ...validContact, 'cf-turnstile-response': 'good' })
  expect(res.status).toBe(403)
})

test('missing server secret → 500 misconfigured, nothing stored', async () => {
  vi.stubEnv('TURNSTILE_SECRET_KEY', '')
  const res = await call(contact, { ...validContact, 'cf-turnstile-response': 'good' })
  expect(res.status).toBe(500)
  expect(rows).toHaveLength(0)
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
  expect(rows[0]).toMatchObject({ name: undefined, email: undefined })
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
    {
      type: 'feedback',
      category: 'not-helpful',
      message: 'Fees are missing',
      page_url: '/services/cedula',
    },
  ])
})

test('feedback: missing token → 403', async () => {
  const res = await call(feedback, { helpful: true, page_url: '/' })
  expect(res.status).toBe(403)
})

test('non-JSON body → 400', async () => {
  const res = await contact(
    new Request('https://example.com/api/contact', { method: 'POST', body: 'x=1' }),
  )
  expect(res.status).toBe(400)
})

test('database error → JSON 500, never a crash', async () => {
  const { insertSubmission } = await import('../../server/db')
  vi.mocked(insertSubmission).mockRejectedValueOnce(new Error('db down'))
  vi.spyOn(console, 'error').mockImplementation(() => {})
  const res = await call(contact, { ...validContact, 'cf-turnstile-response': 'good' })
  expect(res.status).toBe(500)
  expect(await res.json()).toEqual({ ok: false, error: 'server_error' })
})
