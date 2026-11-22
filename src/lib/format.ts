const locale = (lang: string) => (lang === 'fil' ? 'fil-PH' : 'en-PH')

/** "2026-11-20" → "November 20, 2026" (or "Nobyembre 20, 2026"). Parsed as a local date. */
export const formatDate = (iso: string, lang: string) =>
  new Intl.DateTimeFormat(locale(lang), { dateStyle: 'long' }).format(new Date(`${iso}T00:00:00`))

export const formatPeso = (amount: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)

/** "0900-000-0000" → "tel:09000000000" */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

/** Pick the Filipino variant when the UI is in Filipino. */
export const pick = <T>(lang: string, en: T, fil: T) => (lang === 'fil' ? fil : en)
