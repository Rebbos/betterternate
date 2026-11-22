/**
 * Runs for /api/* only. Site-wide security headers (CSP etc.) live in public/_headers,
 * which Cloudflare applies to static assets without invoking a Function per request.
 */
export const onRequest: PagesFunction = async ({ next }) => {
  let res: Response
  try {
    res = await next()
  } catch (e) {
    console.error(e)
    res = Response.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
  res = new Response(res.body, res) // make headers mutable
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Cache-Control', 'no-store')
  return res
}
