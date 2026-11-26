// Vercel Cron (vercel.json "crons"): GET /api/purge-old, daily. Deletes submissions older
// than the retention period. Netlify runs the same purge via netlify/functions/purge-old.ts.
import { RETENTION_DAYS, runPurge } from '../server/retention.js'

export const GET = async (request: Request) => {
  // Vercel sends "Authorization: Bearer $CRON_SECRET". No secret set → refuse everyone.
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`)
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  try {
    const deleted = await runPurge()
    console.info(`[purge-old] deleted ${deleted} submission(s) older than ${RETENTION_DAYS} days`)
    return Response.json({ ok: true, deleted })
  } catch (e) {
    console.error(e)
    return Response.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}
