// Vercel Function: POST /api/feedback
import { handleSubmission } from '../server/submit.js'
import { feedbackSchema } from '../src/lib/forms.js'

export const POST = handleSubmission(feedbackSchema, (d) => ({
  type: 'feedback',
  category: d.helpful ? 'helpful' : 'not-helpful',
  message: d.comment ?? '',
  page_url: d.page_url,
}))
