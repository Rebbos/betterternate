// Netlify Function: serves the same /api handlers that Vercel runs from /api.
import { POST as contact } from '../../api/contact.js'
import { POST as feedback } from '../../api/feedback.js'
import { GET as health } from '../../api/health.js'

type Handler = (req: Request) => Response | Promise<Response>

const routes: Record<string, Partial<Record<string, Handler>>> = {
  '/api/contact': { POST: contact },
  '/api/feedback': { POST: feedback },
  '/api/health': { GET: health },
}

export default async (req: Request) => {
  const handler = routes[new URL(req.url).pathname]?.[req.method]
  const res = handler
    ? await handler(req)
    : Response.json({ ok: false, error: 'method_not_allowed' }, { status: 405 })
  // API answers must never be cached. netlify.toml [[headers]] rules don't apply to
  // function responses, so set it here. Copy first: a Response's headers can be immutable.
  const out = new Response(res.body, res)
  out.headers.set('Cache-Control', 'no-store')
  return out
}

// Must be a literal: Netlify reads this statically at deploy time (keep in sync with routes).
export const config = { path: ['/api/contact', '/api/feedback', '/api/health'] }
