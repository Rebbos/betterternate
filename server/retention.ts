/**
 * Data retention (Data Privacy Act, RA 10173): submissions hold names and emails, so we
 * keep them only as long as needed. Run daily by netlify/functions/purge-old.ts.
 * If you change RETENTION_DAYS, update the privacy notice (about.privacyForms) too.
 */
import { neon } from '@neondatabase/serverless'

export const RETENTION_DAYS = 180

/** Rows created before this moment are deleted. */
export const retentionCutoff = (now: Date, days = RETENTION_DAYS) =>
  new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

type Query = (text: string, params: unknown[]) => Promise<unknown[]>

/** Deletes submissions older than the retention period. Returns how many were deleted. */
export async function purgeOldSubmissions(query: Query, now = new Date()) {
  const rows = await query('DELETE FROM submissions WHERE created_at < $1 RETURNING id', [
    retentionCutoff(now).toISOString(),
  ])
  return rows.length
}

/** Connects with DATABASE_URL (or Netlify DB's variable) and purges. */
export async function runPurge(now = new Date()) {
  const url = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  const sql = neon(url)
  return purgeOldSubmissions((text, params) => sql.query(text, params) as Promise<unknown[]>, now)
}
