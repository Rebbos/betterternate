import { useEffect, useRef } from 'react'

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  reset: (id: string) => void
  remove: (id: string) => void
}
declare global {
  interface Window {
    turnstile?: Turnstile
  }
}

export const TURNSTILE_SITE_KEY: string | undefined = import.meta.env.VITE_TURNSTILE_SITE_KEY

// Loaded once, and only when a form is actually shown.
let scriptPromise: Promise<Turnstile> | undefined
function loadTurnstile() {
  return (scriptPromise ??= new Promise<Turnstile>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    s.async = true
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile')))
    s.onerror = () => {
      scriptPromise = undefined
      reject(new Error('turnstile'))
    }
    document.head.append(s)
  }))
}

/**
 * Cloudflare Turnstile. Reports a token (or null when expired/failed) via onToken.
 * Change `resetKey` after every submit: tokens are single-use and expire after ~5 minutes.
 */
export function TurnstileWidget({
  onToken,
  onError,
  resetKey,
}: {
  onToken: (token: string | null) => void
  onError?: () => void
  resetKey: number
}) {
  const el = useRef<HTMLDivElement>(null)
  const widget = useRef<{ ts: Turnstile; id: string } | null>(null)
  // Latest callbacks without re-rendering the widget when parents re-render.
  const cb = useRef({ onToken, onError })
  useEffect(() => {
    cb.current = { onToken, onError }
  })

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return cb.current.onError?.()
    let cancelled = false
    loadTurnstile().then(
      (ts) => {
        if (cancelled || !el.current) return
        const id = ts.render(el.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'auto',
          size: 'flexible',
          callback: (token: string) => cb.current.onToken(token),
          'expired-callback': () => cb.current.onToken(null),
          'error-callback': () => {
            cb.current.onToken(null)
            cb.current.onError?.()
          },
        })
        widget.current = { ts, id }
      },
      () => !cancelled && cb.current.onError?.(),
    )
    return () => {
      cancelled = true
      if (widget.current) widget.current.ts.remove(widget.current.id)
      widget.current = null
    }
  }, [])

  useEffect(() => {
    if (resetKey && widget.current) {
      cb.current.onToken(null)
      widget.current.ts.reset(widget.current.id)
    }
  }, [resetKey])

  return <div ref={el} className="min-h-16" />
}
