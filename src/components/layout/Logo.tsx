import { cn } from '@/lib/cn'

/**
 * Better Ternate mark: sun over mountain and sea. Deliberately NOT the municipal seal.
 * Decorative (aria-hidden); the visible site name next to it carries the meaning.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn('shrink-0', className)}>
      <rect width="32" height="32" rx="9" className="fill-primary" />
      <circle cx="22" cy="10.5" r="3.5" className="fill-primary-contrast" />
      <path
        d="M3 22.5 10.5 13l4.5 5.5 3-3.5L29 24v5H3Z"
        className="fill-primary-contrast"
        opacity="0.45"
      />
      <path
        d="M3 23.5c2.2-1.8 4.3-1.8 6.5 0s4.3 1.8 6.5 0 4.3-1.8 6.5 0 4.3 1.8 6.5 0V29H3Z"
        className="fill-primary-contrast"
      />
    </svg>
  )
}

/** Wide coastal scene (mountains, sun, sea) for the home hero. Decorative. */
export function CoastArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 220"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
      className={cn('block w-full', className)}
    >
      <circle cx="930" cy="112" r="36" className="fill-warning" opacity="0.22" />
      <path
        d="M0 170 110 118 190 140 300 72 380 122 450 98 540 150 640 108 720 136 820 60 930 128 1010 104 1100 140 1200 118V220H0Z"
        className="fill-primary"
        opacity="0.16"
      />
      <path
        d="M0 182 140 140 230 160 330 112 420 152 520 132 600 166 700 150 800 168 900 140 1000 166 1200 150V220H0Z"
        className="fill-primary"
        opacity="0.28"
      />
      <rect y="176" width="1200" height="44" className="fill-info" opacity="0.2" />
      <path
        d="M0 190q25-8 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0M0 206q25-8 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0"
        fill="none"
        className="stroke-primary"
        strokeWidth="2"
        opacity="0.35"
      />
    </svg>
  )
}

/** Wave edge that tops the footer band. Decorative. */
export function WaveEdge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      aria-hidden
      className={cn('block h-4 w-full md:h-6', className)}
    >
      <path
        d="M0 12q50-12 100 0t100 0 100 0 100 0 100 0 100 0 100 0 100 0 100 0 100 0 100 0 100 0V24H0Z"
        className="fill-inverse-bg"
      />
    </svg>
  )
}
