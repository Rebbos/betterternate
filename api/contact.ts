// Vercel Function: POST /api/contact
import { handleSubmission } from '../server/submit'
import { contactSchema } from '../src/lib/forms'

export const POST = handleSubmission(contactSchema, (d) => ({
  type: 'contact',
  category: d.category,
  message: d.message,
  name: d.name,
  email: d.email,
  page_url: d.page_url,
}))
