import { spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from 'vitest'

const run = (dir?: string) =>
  spawnSync(
    process.execPath,
    ['--import', 'tsx', 'scripts/validate-content.ts', ...(dir ? [dir] : [])],
    {
      encoding: 'utf8',
    },
  )

test('real /content passes validation', () => {
  const r = run()
  expect(r.stderr).toBe('')
  expect(r.status).toBe(0)
  expect(r.stdout).toContain('Content valid')
}, 20_000)

test('broken content fails with readable, file-specific errors', () => {
  const dir = mkdtempSync(join(tmpdir(), 'bt-content-'))
  try {
    cpSync('content', dir, { recursive: true })
    writeFileSync(
      join(dir, 'data', 'hotlines.json'),
      JSON.stringify([
        { name: 'X', agency: 'Y', numbers: [], type: 'pizza', available_24_7: true },
      ]),
    )
    writeFileSync(
      join(dir, 'services', 'cedula.md'),
      '---\nslug: not-cedula\ntitle_en: x\n---\nbody',
    )
    const r = run(dir)
    expect(r.status).toBe(1)
    expect(r.stderr).toContain('data/hotlines.json')
    expect(r.stderr).toContain('services/cedula.md')
    expect(r.stderr).toMatch(/type/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}, 20_000)
