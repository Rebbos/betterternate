import { neon } from '@neondatabase/serverless'

export type Row = {
  type: 'contact' | 'feedback'
  category: string
  message: string
  name?: string
  email?: string
  page_url?: string
}

/**
 * Stores one form submission in Postgres (Neon). The Vercel Marketplace integration sets
 * DATABASE_URL; Netlify DB (also Neon) sets NETLIFY_DATABASE_URL. Either works.
 * Only `npm run dev` (BT_LOCAL_API) may run without a database: it logs the row instead.
 */
export async function insertSubmission(r: Row) {
  const url = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL
  if (!url) {
    if (!process.env.BT_LOCAL_API) throw new Error('DATABASE_URL is not set')
    console.info('[dev] DATABASE_URL not set, submission NOT stored:', r)
    return
  }
  const sql = neon(url)
  await sql`
    INSERT INTO submissions (type, category, message, name, email, page_url)
    VALUES (${r.type}, ${r.category}, ${r.message}, ${r.name ?? null}, ${r.email ?? null}, ${r.page_url ?? null})`
}
