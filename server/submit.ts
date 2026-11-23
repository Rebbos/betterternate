/**
 * Shared handler for the public form endpoints (api/contact.ts, api/feedback.ts), used on
 * Vercel directly and on Netlify via netlify/functions/api.ts.
 * Lives outside /api so Vercel doesn't turn it into a route.
 */
import type { z } from 'zod'
import { HONEYPOT, TOKEN_FIELD } from '../src/lib/forms'
import { insertSubmission, type Row } from './db'

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
    return false // fail closed: if Cloudflare can't be reached, nothing gets in
  }
}

/** Builds a POST handler: size → JSON → honeypot → Turnstile → schema → store. */
export function handleSubmission<S extends z.ZodType>(
  schema: S,
  toRow: (data: z.output<S>) => Row,
) {
  return async (request: Request): Promise<Response> => {
    try {
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
      const secret = process.env.TURNSTILE_SECRET_KEY
      if (!secret) return fail(500, 'misconfigured')

      // Visitor IP: Vercel sets x-real-ip; netlify/functions/api.ts copies Netlify's in.
      const ip = request.headers.get('x-real-ip')
      if (!(await verifyTurnstile(token, secret, ip))) return fail(403, 'verification_failed')

      const result = schema.safeParse(fields)
      if (!result.success)
        return fail(400, 'invalid', {
          fields: [...new Set(result.error.issues.map((i) => i.path[0]))],
        })

      await insertSubmission(toRow(result.data))
      return Response.json({ ok: true })
    } catch (e) {
      console.error(e)
      return fail(500, 'server_error')
    }
  }
}
