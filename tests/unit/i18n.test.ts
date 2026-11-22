import { expect, test } from 'vitest'
import en from '@/i18n/locales/en.json'
import fil from '@/i18n/locales/fil.json'

const keys = (o: object, prefix = ''): string[] =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  )

test('en and fil have the same keys', () => {
  expect(keys(fil).sort()).toEqual(keys(en).sort())
})
