import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/FormControls'
import { feedbackSchema, HONEYPOT, type FeedbackInput } from '@/lib/forms'
import { postForm, type SubmitError } from '@/lib/submit'
import { Honeypot } from './Honeypot'
import { TurnstileWidget } from './TurnstileWidget'

type Status = 'idle' | 'success' | SubmitError

export default function FeedbackForm({ helpful }: { helpful: boolean }) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [token, setToken] = useState<string | null>(null)
  const [resetKey, setResetKey] = useState(0)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [widgetFailed, setWidgetFailed] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const input: FeedbackInput = {
      helpful,
      comment: String(fd.get('comment') ?? ''),
      page_url: pathname,
    }
    if (!feedbackSchema.safeParse(input).success) return setStatus('invalid')
    if (!token) return
    setBusy(true)
    try {
      await postForm('/api/feedback', { ...input, [HONEYPOT]: fd.get(HONEYPOT) }, token)
      setStatus('success')
    } catch (err) {
      setStatus(err as SubmitError)
    } finally {
      setBusy(false)
      setResetKey((k) => k + 1)
    }
  }

  return (
    <div className="mt-4 space-y-4">
      {status !== 'success' && (
        <form noValidate onSubmit={onSubmit} className="space-y-4">
          <Textarea
            name="comment"
            label={t(helpful ? 'feedback.commentYes' : 'feedback.commentNo')}
            hint={t('feedback.commentHint')}
            maxLength={1000}
            rows={3}
          />
          <Honeypot />
          <TurnstileWidget
            onToken={setToken}
            onError={() => setWidgetFailed(true)}
            resetKey={resetKey}
          />
          {widgetFailed && <Alert tone="warning">{t('forms.verificationUnavailable')}</Alert>}
          <Button type="submit" disabled={!token || busy}>
            {busy ? t('forms.sending') : t('feedback.submit')}
          </Button>
        </form>
      )}
      {/* Stays mounted so the success message is announced when the form disappears. */}
      <div role="status" aria-live="polite">
        {status === 'success' && <Alert tone="success">{t('feedback.thanks')}</Alert>}
        {status !== 'success' && status !== 'idle' && (
          <Alert tone="danger" title={t('forms.errorTitle')}>
            {t(`forms.errors.${status}`)}
          </Alert>
        )}
      </div>
    </div>
  )
}
