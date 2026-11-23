// Netlify scheduled function: deletes form submissions older than the retention period.
// Runs only on the published production deploy, never on deploy previews.
import { RETENTION_DAYS, runPurge } from '../../server/retention.js'

export default async () => {
  const deleted = await runPurge()
  console.info(`[purge-old] deleted ${deleted} submission(s) older than ${RETENTION_DAYS} days`)
}

// Must be a literal: Netlify reads this statically at deploy time.
export const config = { schedule: '@daily' }
