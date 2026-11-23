// API handler (served by netlify/functions/api.ts): GET /api/health (uptime checks)
export const GET = () => Response.json({ ok: true })
