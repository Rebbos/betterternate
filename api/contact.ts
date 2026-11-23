// API handler (served by netlify/functions/api.ts): POST /api/contact
import { handleSubmission } from '../server/submit.js'
import { contactSchema } from '../src/lib/forms.js'

export const POST = handleSubmission(contactSchema, (d) => ({
  type: 'contact',
  category: d.category,
  message: d.message,
  name: d.name,
  email: d.email,
  page_url: d.page_url,
}))
