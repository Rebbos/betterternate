import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { createSearcher, SEARCH_TYPES, type SearchEntry } from '@/lib/search'

// Module-level cache: the index is fetched once per page load (and precached by the service worker).
let indexPromise: Promise<SearchEntry[]> | undefined
const loadIndex = () =>
  (indexPromise ??= fetch('/search-index.json').then((r) => {
    if (!r.ok) throw new Error(String(r.status))
    return r.json() as Promise<SearchEntry[]>
  })).catch((e) => {
    indexPromise = undefined // allow a retry next time the dialog opens
    throw e
  })

/**
 * Command-palette search. Combobox pattern: focus stays in the input, arrow keys move the
 * active option (aria-activedescendant), Enter opens it, Esc closes (native <dialog>).
 */
export default function SearchDialog({
  initialQuery,
  onClose,
}: {
  initialQuery: string
  onClose: () => void
}) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dialog = useRef<HTMLDialogElement>(null)
  const [query, setQuery] = useState(initialQuery)
  const [active, setActive] = useState(0)
  const [entries, setEntries] = useState<SearchEntry[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    dialog.current?.showModal()
    loadIndex().then(setEntries, () => setFailed(true))
  }, [])

  const search = useMemo(() => createSearcher(entries ?? []), [entries])
  const results = search(query)
  // Group by type, then flatten back so arrow-key order matches what's on screen.
  const groups = SEARCH_TYPES.map((type) => ({
    type,
    items: results.filter((r) => r.type === type),
  })).filter((g) => g.items.length)
  const ordered = groups.flatMap((g) => g.items)
  const fil = i18n.language === 'fil'

  const go = (entry: SearchEntry | undefined) => {
    if (!entry) return
    dialog.current?.close()
    navigate(entry.url)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const last = ordered.length - 1
    if (e.key === 'ArrowDown') setActive((i) => (i >= last ? 0 : i + 1))
    else if (e.key === 'ArrowUp') setActive((i) => (i <= 0 ? last : i - 1))
    else if (e.key === 'Enter') go(ordered[active])
    // type="search" eats the first Esc to clear the text; close in one press instead.
    else if (e.key === 'Escape') dialog.current?.close()
    else return
    e.preventDefault()
  }

  useEffect(() => {
    document.getElementById(`search-opt-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  let status = ''
  if (failed) status = t('search.failed')
  else if (!entries) status = t('search.loading')
  else if (query.trim()) status = t('search.count', { count: ordered.length })

  return (
    <dialog
      ref={dialog}
      aria-labelledby="search-title"
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && dialog.current.close()}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-text shadow-md backdrop:bg-text/50 md:mx-auto md:mt-[10vh] md:h-auto md:max-h-[75vh] md:max-w-xl md:rounded-lg"
    >
      <div className="flex h-full max-h-[inherit] flex-col">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <h2 id="search-title" className="sr-only">
            {t('search.title')}
          </h2>
          <Search aria-hidden className="size-5 shrink-0 text-muted" />
          <input
            type="search"
            role="combobox"
            aria-label={t('search.label')}
            aria-expanded={ordered.length > 0}
            aria-controls="search-results"
            aria-autocomplete="list"
            aria-activedescendant={ordered.length ? `search-opt-${active}` : undefined}
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
            placeholder={t('home.searchPlaceholder')}
            className="min-h-tap w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted"
          />
          <Button
            variant="ghost"
            size="sm"
            aria-label={t('search.close')}
            onClick={() => dialog.current?.close()}
          >
            <X aria-hidden className="size-5" />
          </Button>
        </div>

        <div
          id="search-results"
          role="listbox"
          aria-label={t('search.results')}
          className="flex-1 overflow-y-auto p-2"
        >
          {groups.map((g) => (
            <div
              key={g.type}
              role="group"
              aria-labelledby={`search-group-${g.type}`}
              className="mb-2"
            >
              <div
                id={`search-group-${g.type}`}
                role="presentation"
                className="px-3 py-1 text-xs font-semibold tracking-wide text-muted uppercase"
              >
                {t(`search.types.${g.type}`)}
              </div>
              {g.items.map((item) => {
                const i = ordered.indexOf(item)
                return (
                  <div
                    key={`${item.url}-${item.title_en}`}
                    id={`search-opt-${i}`}
                    role="option"
                    aria-selected={i === active}
                    onClick={() => go(item)}
                    onMouseMove={() => setActive(i)}
                    className={cn(
                      'flex min-h-tap cursor-pointer items-center rounded-md px-3 py-2',
                      i === active && 'bg-primary text-primary-contrast',
                    )}
                  >
                    {fil ? item.title_fil : item.title_en}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <p role="status" className="border-t border-border px-4 py-2 text-sm text-muted">
          {status || t('search.hint')}
        </p>
      </div>
    </dialog>
  )
}
