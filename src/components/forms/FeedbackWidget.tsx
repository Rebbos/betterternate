import { lazy, Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// zod + Turnstile only download once someone actually answers.
const FeedbackForm = lazy(() => import('./FeedbackForm'))

/** "Was this page helpful?" Yes/No, then an optional comment protected by Turnstile. */
export function FeedbackWidget() {
  const { t } = useTranslation()
  const [helpful, setHelpful] = useState<boolean | null>(null)

  return (
    <section
      aria-labelledby="feedback-title"
      className="mt-10 max-w-xl rounded-lg border border-border bg-surface p-4"
    >
      <h2 id="feedback-title" className="font-bold">
        {t('feedback.question')}
      </h2>
      <div className="mt-3 flex gap-2">
        <Button
          variant="secondary"
          aria-pressed={helpful === true}
          onClick={() => setHelpful(true)}
          className="aria-pressed:border-primary aria-pressed:text-primary"
        >
          <ThumbsUp aria-hidden className="size-5" />
          {t('feedback.yes')}
        </Button>
        <Button
          variant="secondary"
          aria-pressed={helpful === false}
          onClick={() => setHelpful(false)}
          className="aria-pressed:border-primary aria-pressed:text-primary"
        >
          <ThumbsDown aria-hidden className="size-5" />
          {t('feedback.no')}
        </Button>
      </div>
      {helpful !== null && (
        <Suspense fallback={null}>
          <FeedbackForm helpful={helpful} />
        </Suspense>
      )}
    </section>
  )
}
