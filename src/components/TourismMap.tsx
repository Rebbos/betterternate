import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { TourismSpot } from '@/lib/schemas'
import { OSM_COPYRIGHT_URL } from '@/lib/site'

/** Leaflet + OpenStreetMap. Loaded lazily (own chunk) by the Tourism page. */
export default function TourismMap({ spots }: { spots: TourismSpot[] }) {
  const { t } = useTranslation()
  const el = useRef<HTMLDivElement>(null)
  const attribution = `&copy; <a href="${OSM_COPYRIGHT_URL}">OpenStreetMap</a> ${t('tourism.osmContributors')}`

  useEffect(() => {
    if (!el.current) return
    // Marker colour comes from the design token, so a theme swap recolours the map too.
    const color = getComputedStyle(document.documentElement).getPropertyValue('--bt-primary').trim()
    const map = L.map(el.current, { scrollWheelZoom: false })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution,
    }).addTo(map)
    for (const s of spots) {
      // Text node, not an HTML string: Leaflet popups would otherwise render content as HTML.
      const label = document.createElement('strong')
      label.textContent = s.name
      L.circleMarker([s.lat, s.lng], { radius: 9, color, fillColor: color, fillOpacity: 0.8 })
        .bindPopup(label)
        .addTo(map)
    }
    map.fitBounds(L.latLngBounds(spots.map((s) => [s.lat, s.lng])), {
      padding: [32, 32],
      maxZoom: 14,
    })
    return () => {
      map.remove()
    }
  }, [spots, attribution])

  return <div ref={el} className="size-full" />
}
