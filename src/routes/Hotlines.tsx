import { useTranslation } from 'react-i18next'
import { Phone } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Container, Section } from '@/components/ui/Container'
import { SampleBadge } from '@/components/ui/SampleBadge'
import { getHotlines } from '@/lib/content'
import { HOTLINE_TYPES } from '@/lib/categories'
import { telHref } from '@/lib/format'

export default function Hotlines() {
  const { t } = useTranslation()
  const hotlines = getHotlines()

  return (
    <Container className="pb-12">
      <PageHeader title={t('pages.hotlines')} description={t('hotlines.lead')} />

      {HOTLINE_TYPES.map((type) => {
        const items = hotlines.filter((h) => h.type === type)
        if (!items.length) return null
        return (
          <Section key={type} title={t(`hotlines.types.${type}`)} className="pb-0 md:pb-0">
            <ul className="grid gap-3 md:grid-cols-2">
              {items.map((h) => (
                <li
                  key={h.name}
                  className="rounded-lg border border-border bg-surface p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{h.name}</h3>
                    {h.available_24_7 && <Badge tone="success">{t('hotlines.always')}</Badge>}
                    <SampleBadge sample={h.sample} />
                  </div>
                  <p className="text-sm text-muted">{h.agency}</p>
                  <div className="mt-3 flex flex-col gap-2">
                    {h.numbers.map((n) => (
                      <a
                        key={n}
                        href={telHref(n)}
                        aria-label={t('hotlines.call', { name: h.name, number: n })}
                        className={`flex min-h-14 items-center justify-center gap-2 rounded-md px-4 text-lg font-semibold ${
                          type === 'emergency'
                            ? 'bg-danger text-primary-contrast'
                            : 'bg-primary text-primary-contrast'
                        }`}
                      >
                        <Phone aria-hidden className="size-5" />
                        {n}
                      </a>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        )
      })}
    </Container>
  )
}
