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

export default (req: Request) => {
  const handler = routes[new URL(req.url).pathname]?.[req.method]
  return handler
    ? handler(req)
    : Response.json({ ok: false, error: 'method_not_allowed' }, { status: 405 })
}

export const config = { path: Object.keys(routes) }
