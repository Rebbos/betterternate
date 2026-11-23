/**
 * Netlify Function: serves every /api/* route by reusing the Vercel handlers in /api,
 * so both hosts run the same code. Add a new endpoint to /api, then list it in `routes`.
 */
import * as contact from '../../api/contact'
import * as feedback from '../../api/feedback'
import * as health from '../../api/health'

type Handler = (request: Request) => Response | Promise<Response>
const routes: Record<string, Partial<Record<string, Handler>>> = { contact, feedback, health }

/** Visitor IP from Netlify's context, passed on the header the shared handler reads. */
type Context = { ip?: string }

export default async (request: Request, context?: Context): Promise<Response> => {
  const name = new URL(request.url).pathname.replace(/^\/api\//, '').replace(/\/$/, '')
  const route = Object.hasOwn(routes, name) ? routes[name] : undefined
  let response: Response
  if (!route) response = Response.json({ ok: false, error: 'not_found' }, { status: 404 })
  else {
    const handler = route[request.method]
    if (!handler) response = new Response(null, { status: 405 })
    else {
      const headers = new Headers(request.headers)
      if (context?.ip && !headers.has('x-real-ip')) headers.set('x-real-ip', context.ip)
      response = await handler(new Request(request, { headers }))
    }
  }
  // Responses from a function can be mutable or not; copy before adding headers.
  const out = new Response(response.body, response)
  out.headers.set('Cache-Control', 'no-store')
  return out
}

export const config = { path: '/api/*' }
