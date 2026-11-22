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
 * Stores one form submission in Postgres (Neon, connected via the Vercel Marketplace,
 * which sets DATABASE_URL). Local dev without a database logs the row instead.
 */
export async function insertSubmission(r: Row) {
  const url = process.env.DATABASE_URL
  if (!url) {
    if (process.env.VERCEL) throw new Error('DATABASE_URL is not set')
    console.info('[dev] DATABASE_URL not set, submission NOT stored:', r)
    return
  }
  const sql = neon(url)
  await sql`
    INSERT INTO submissions (type, category, message, name, email, page_url)
    VALUES (${r.type}, ${r.category}, ${r.message}, ${r.name ?? null}, ${r.email ?? null}, ${r.page_url ?? null})`
}
