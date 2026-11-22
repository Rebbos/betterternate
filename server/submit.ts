/**
 * Shared handler for public form endpoints (functions/api/contact.ts, feedback.ts).
 * Lives outside /functions so Pages doesn't turn it into a route.
 */
import type { z } from 'zod'
import { HONEYPOT, TOKEN_FIELD } from '../src/lib/forms'

export interface Env {
  DB: D1Database
  TURNSTILE_SECRET_KEY: string
}

export type Row = {
  type: 'contact' | 'feedback'
  category: string
  message: string
  name?: string
  email?: string
  page_url?: string
}

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const MAX_BODY_BYTES = 16 * 1024

const fail = (status: number, error: string, extra?: object) =>
  Response.json({ ok: false, error, ...extra }, { status })

/** Server-side Turnstile check. Tokens are single-use; the client must reset its widget after. */
export async function verifyTurnstile(token: string, secret: string, ip: string | null) {
  const body = new FormData()
  body.append('secret', secret)
  body.append('response', token)
  if (ip) body.append('remoteip', ip)
  try {
    const res = await fetch(SITEVERIFY, { method: 'POST', body })
    if (!res.ok) return false
    const data: { success?: boolean } = await res.json()
    return data.success === true
  } catch {
    return false
  }
}

export function handleSubmission<S extends z.ZodType>(
  schema: S,
  toRow: (data: z.output<S>) => Row,
): PagesFunction<Env> {
  return async ({ request, env }) => {
    if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES)
      return fail(413, 'too_large')

    let body: Record<string, unknown>
    try {
      const parsed: unknown = await request.json()
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw 0
      body = parsed as Record<string, unknown>
    } catch {
      return fail(400, 'invalid_json')
    }

    const { [TOKEN_FIELD]: token, [HONEYPOT]: honeypot, ...fields } = body
    if (honeypot) return fail(400, 'rejected')
    if (typeof token !== 'string' || !token) return fail(403, 'verification_failed')
    if (!env.TURNSTILE_SECRET_KEY) return fail(500, 'misconfigured')

    const ip = request.headers.get('CF-Connecting-IP')
    if (!(await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip)))
      return fail(403, 'verification_failed')

    const result = schema.safeParse(fields)
    if (!result.success)
      return fail(400, 'invalid', {
        fields: [...new Set(result.error.issues.map((i) => i.path[0]))],
      })

    const r = toRow(result.data)
    await env.DB.prepare(
      'INSERT INTO submissions (type, category, message, name, email, page_url) VALUES (?, ?, ?, ?, ?, ?)',
    )
      .bind(r.type, r.category, r.message, r.name ?? null, r.email ?? null, r.page_url ?? null)
      .run()

    return Response.json({ ok: true })
  }
}
