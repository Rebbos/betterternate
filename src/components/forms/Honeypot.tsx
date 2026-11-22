import { useTranslation } from 'react-i18next'
import { HONEYPOT } from '@/lib/forms'

/** Off-screen field bots tend to fill. Hidden from people and screen readers; server rejects if set. */
export function Honeypot() {
  const { t } = useTranslation()
  return (
    <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
      <label>
        {t('forms.honeypot')}
        <input type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  )
}
