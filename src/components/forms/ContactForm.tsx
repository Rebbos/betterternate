import { useState, type FormEvent } from 'react'
import { flushSync } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/FormControls'
import { CONTACT_CATEGORIES, contactSchema, HONEYPOT, type ContactInput } from '@/lib/forms'
import { postForm, type SubmitError } from '@/lib/submit'
import { Honeypot } from './Honeypot'
import { TurnstileWidget } from './TurnstileWidget'

type Status = { kind: 'idle' } | { kind: 'success' } | { kind: 'error'; error: SubmitError }

export default function ContactForm() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const initialCategory = CONTACT_CATEGORIES.find((c) => c === params.get('category')) ?? 'question'
  const page = params.get('page')?.startsWith('/') ? params.get('page')! : undefined

  const [anonymous, setAnonymous] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [resetKey, setResetKey] = useState(0)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [widgetFailed, setWidgetFailed] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const input: ContactInput = {
      anonymous,
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      category: String(fd.get('category')) as ContactInput['category'],
      message: String(fd.get('message') ?? ''),
      page_url: page,
    }

    // Same schema the server uses; the server re-checks everything.
    const parsed = contactSchema.safeParse(input)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0])
        fieldErrors[field] ??= t(`contact.errors.${field}`)
      }
      // Render the errors now so the first invalid field exists to receive focus.
      flushSync(() => {
        setErrors(fieldErrors)
        setStatus({ kind: 'idle' })
      })
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    setErrors({})
    if (!token) return

    setBusy(true)
    try {
      await postForm('/api/contact', { ...input, [HONEYPOT]: fd.get(HONEYPOT) }, token)
      setStatus({ kind: 'success' })
      form.reset()
      setAnonymous(false)
    } catch (err) {
      setStatus({ kind: 'error', error: err as SubmitError })
    } finally {
      setBusy(false)
      setResetKey((k) => k + 1) // token is used up either way
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="max-w-xl space-y-5">
      <label className="flex min-h-tap cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-primary"
        />
        <span>
          <span className="block font-medium">{t('contact.anonymous')}</span>
          <span className="text-sm text-muted">{t('contact.anonymousHint')}</span>
        </span>
      </label>

      {!anonymous && (
        <>
          <Input
            name="name"
            label={t('contact.name')}
            hint={t('forms.optional')}
            autoComplete="name"
            maxLength={100}
          />
          <Input
            name="email"
            type="email"
            label={t('contact.email')}
            hint={t('contact.emailHint')}
            autoComplete="email"
            maxLength={254}
            error={errors.email}
          />
        </>
      )}

      <Select
        name="category"
        label={t('contact.category')}
        defaultValue={initialCategory}
        error={errors.category}
      >
        {CONTACT_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {t(`contact.categories.${c}`)}
          </option>
        ))}
      </Select>

      <Textarea
        name="message"
        label={t('contact.message')}
        hint={page ? t('contact.aboutPage', { page }) : t('contact.messageHint')}
        required
        maxLength={2000}
        rows={6}
        error={errors.message}
      />

      <Honeypot />

      <TurnstileWidget
        onToken={setToken}
        onError={() => setWidgetFailed(true)}
        resetKey={resetKey}
      />
      {widgetFailed && <Alert tone="warning">{t('forms.verificationUnavailable')}</Alert>}

      <p className="text-sm text-muted">
        {t('forms.privacy')}{' '}
        <Link to="/about#privacy" className="text-primary underline">
          {t('forms.privacyLink')}
        </Link>
      </p>

      <Button type="submit" disabled={!token || busy}>
        {busy ? t('forms.sending') : t('contact.submit')}
      </Button>
      {!token && !busy && <p className="text-sm text-muted">{t('forms.waitVerification')}</p>}

      <div role="status" aria-live="polite">
        {status.kind === 'success' && (
          <Alert tone="success" title={t('contact.successTitle')}>
            {t('contact.success')}
          </Alert>
        )}
        {status.kind === 'error' && (
          <Alert tone="danger" title={t('forms.errorTitle')}>
            {t(`forms.errors.${status.error}`)}
          </Alert>
        )}
      </div>
    </form>
  )
}
