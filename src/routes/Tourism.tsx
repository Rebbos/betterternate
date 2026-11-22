import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExternalLink } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Container, Section } from '@/components/ui/Container'
import { SampleBadge } from '@/components/ui/SampleBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { getTourismSpots } from '@/lib/content'
import { pick } from '@/lib/format'

const TourismMap = lazy(() => import('@/components/TourismMap'))

const osmLink = (lat: number, lng: number) =>
  `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`

/** True once the element scrolls near the viewport (then stays true). */
function useNearViewport<T extends Element>() {
  const ref = useRef<T>(null)
  // No IntersectionObserver (old browsers, jsdom): just show the map.
  const [near, setNear] = useState(() => !('IntersectionObserver' in window))
  useEffect(() => {
    if (!ref.current || near) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), {
      rootMargin: '200px',
    })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [near])
  return [ref, near] as const
}

export default function Tourism() {
  const { t, i18n } = useTranslation()
  const spots = getTourismSpots()
  const [mapRef, showMap] = useNearViewport<HTMLDivElement>()

  return (
    <Container className="pb-12">
      <PageHeader title={t('pages.tourism')} description={t('tourism.lead')} />

      <Section className="pb-0 md:pb-0">
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {spots.map((s) => (
            <li key={s.slug}>
              <Card className="flex h-full flex-col">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="info">{t(`tourism.categories.${s.category}`)}</Badge>
                  <SampleBadge sample={s.sample} />
                </div>
                <h2 className="mt-2 text-lg font-bold">{s.name}</h2>
                <p className="mt-1 mb-3 text-sm text-muted">
                  {pick(i18n.language, s.description_en, s.description_fil)}
                </p>
                <a
                  href={osmLink(s.lat, s.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex min-h-tap items-center gap-2 text-sm text-primary underline"
                >
                  <ExternalLink aria-hidden className="size-4" />
                  {t('tourism.openMap')}
                </a>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t('tourism.map')} className="pb-0 md:pb-0">
        {/* Fixed height reserves space so the lazy map doesn't shift the layout. */}
        <div
          ref={mapRef}
          className="h-80 overflow-hidden rounded-lg border border-border md:h-[28rem]"
        >
          {showMap && (
            <Suspense fallback={<Skeleton className="size-full" />}>
              <TourismMap spots={spots} />
            </Suspense>
          )}
        </div>
      </Section>
    </Container>
  )
}
