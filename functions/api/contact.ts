import { handleSubmission } from '../../server/submit'
import { contactSchema } from '../../src/lib/forms'

export const onRequestPost = handleSubmission(contactSchema, (d) => ({
  type: 'contact',
  category: d.category,
  message: d.message,
  name: d.name,
  email: d.email,
  page_url: d.page_url,
}))
