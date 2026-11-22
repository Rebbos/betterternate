/**
 * Applies migrations/*.sql to the Postgres database in DATABASE_URL, in filename order,
 * once each (tracked in schema_migrations).
 * Usage: npm run db:migrate   (reads DATABASE_URL from the environment or .env.local)
 */
import { readdirSync, readFileSync } from 'node:fs'
import { neon } from '@neondatabase/serverless'

try {
  process.loadEnvFile('.env.local')
} catch {
  /* no .env.local: rely on the environment */
}
const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set (add it to .env.local or the environment).')
  process.exit(1)
}

const sql = neon(url)
await sql.query(
  'CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())',
)
const done = new Set(
  ((await sql.query('SELECT name FROM schema_migrations')) as { name: string }[]).map(
    (r) => r.name,
  ),
)

for (const file of readdirSync('migrations')
  .filter((f) => f.endsWith('.sql'))
  .sort()) {
  if (done.has(file)) {
    console.log(`· ${file} (already applied)`)
    continue
  }
  // The HTTP driver runs one statement per query; our migrations have no ';' inside strings.
  const statements = readFileSync(`migrations/${file}`, 'utf8')
    .split(';')
    .map((s) => s.replace(/--.*$/gm, '').trim())
    .filter(Boolean)
  for (const s of statements) await sql.query(s)
  await sql.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file])
  console.log(`✓ ${file}`)
}
