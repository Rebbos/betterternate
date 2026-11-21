// Turnstile verification + D1 insert in Phase 6.
export const onRequestPost: PagesFunction = () =>
  Response.json({ ok: false, error: 'not_implemented' }, { status: 501 })
