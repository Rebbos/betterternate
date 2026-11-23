// @vitest-environment node
import { afterEach, expect, test, vi } from 'vitest'
import {
  RETENTION_DAYS,
  purgeOldSubmissions,
  retentionCutoff,
  runPurge,
} from '../../server/retention'

afterEach(() => vi.unstubAllEnvs())

const now = new Date('2026-11-23T00:00:00Z')

test('cutoff is exactly RETENTION_DAYS before now', () => {
  expect(RETENTION_DAYS).toBe(180)
  expect(retentionCutoff(now).toISOString()).toBe('2026-05-27T00:00:00.000Z')
})

test('deletes only rows older than the cutoff, returns the count', async () => {
  const rows = [
    { id: 1, created_at: '2026-01-01T00:00:00Z' }, // old: deleted
    { id: 2, created_at: '2026-05-26T23:59:59Z' }, // just before cutoff: deleted
    { id: 3, created_at: '2026-05-27T00:00:00Z' }, // exactly at cutoff: kept
    { id: 4, created_at: '2026-11-20T00:00:00Z' }, // recent: kept
  ]
  // Fake database that applies the same rule as the SQL: created_at < $1.
  const query = vi.fn(async (text: string, [cutoff]: unknown[]) => {
    expect(text).toMatch(/^DELETE FROM submissions WHERE created_at < \$1/)
    return rows.filter((r) => new Date(r.created_at) < new Date(cutoff as string))
  })
  expect(await purgeOldSubmissions(query, now)).toBe(2)
  expect(query).toHaveBeenCalledOnce()
})

test('no database configured → throws instead of silently doing nothing', async () => {
  vi.stubEnv('DATABASE_URL', '')
  vi.stubEnv('NETLIFY_DATABASE_URL', '')
  await expect(runPurge(now)).rejects.toThrow('DATABASE_URL is not set')
})
