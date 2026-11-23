import { useLayoutEffect } from 'react'

export function useStructuredData(id: string, data: Record<string, unknown> | null) {
  const serialized = data ? JSON.stringify(data) : null

  useLayoutEffect(() => {
    const existing = document.head.querySelector<HTMLScriptElement>(`script[data-schema="${id}"]`)

    if (!serialized) {
      existing?.remove()
      return
    }

    const script =
      existing ??
      Object.assign(document.createElement('script'), {
        type: 'application/ld+json',
      })
    script.dataset.schema = id
    script.textContent = serialized
    if (!existing) document.head.append(script)

    return () => script.remove()
  }, [id, serialized])
}
