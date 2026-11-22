import { useRef, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { NAV_ITEMS } from '@/lib/site'

export const navLinkClass =
  'flex min-h-tap items-center rounded-md px-3 text-text hover:bg-surface aria-[current=page]:font-semibold aria-[current=page]:text-primary'

/**
 * Native modal <dialog>: the browser makes the page behind it inert (focus stays inside),
 * closes on Esc, and returns focus to the menu button.
 */
export default function MobileNav() {
  const { t } = useTranslation()
  const dialog = useRef<HTMLDialogElement>(null)
  const close = () => dialog.current?.close()

  // Modal <dialog> lets Tab escape to browser UI after the last item; wrap it instead.
  const trapTab = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== 'Tab') return
    const items = e.currentTarget.querySelectorAll<HTMLElement>('a[href], button')
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="sm"
        aria-label={t('header.openMenu')}
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        <Menu aria-hidden className="size-6" />
      </Button>

      <dialog
        ref={dialog}
        aria-labelledby="mobile-nav-title"
        // Click on the backdrop (outside the panel) closes.
        onClick={(e) => e.target === dialog.current && close()}
        onKeyDown={trapTab}
        className="m-0 ml-auto h-dvh max-h-none w-80 max-w-[85vw] bg-bg p-0 text-text shadow-md backdrop:bg-text/50 motion-safe:open:animate-slide-in"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <h2 id="mobile-nav-title" className="text-lg font-bold">
              {t('header.menu')}
            </h2>
            <Button variant="ghost" size="sm" aria-label={t('header.closeMenu')} onClick={close}>
              <X aria-hidden className="size-6" />
            </Button>
          </div>
          <nav aria-label={t('nav.label')} className="overflow-y-auto p-2">
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={navLinkClass} onClick={close}>
                    {t(item.key)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </dialog>
    </div>
  )
}
