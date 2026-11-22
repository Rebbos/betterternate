/**
 * Form schemas shared by the browser (src/components/forms) and the server
 * (api/). Keep this file free of DOM and server-only APIs.
 */
import { z } from 'zod'

export const CONTACT_CATEGORIES = [
  'question',
  'report-issue',
  'correction',
  'suggestion',
  'other',
] as const

/** Blank → undefined, so optional fields can be sent as "" by plain HTML forms. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => v || undefined)

const pagePath = z.string().startsWith('/').max(300)

export const contactSchema = z
  .object({
    anonymous: z.boolean(),
    name: optionalText(100),
    email: z
      .union([z.literal(''), z.email().max(254)])
      .optional()
      .transform((v) => v || undefined),
    category: z.enum(CONTACT_CATEGORIES),
    message: z.string().trim().min(10).max(2000),
    page_url: pagePath.optional(),
  })
  .refine((d) => d.anonymous || d.email, { path: ['email'], message: 'email required' })
  // Anonymous means anonymous: never store a name or email, even if one was sent.
  .transform((d) => (d.anonymous ? { ...d, name: undefined, email: undefined } : d))

export const feedbackSchema = z.object({
  helpful: z.boolean(),
  comment: optionalText(1000),
  page_url: pagePath,
})

export type ContactInput = z.input<typeof contactSchema>
export type FeedbackInput = z.input<typeof feedbackSchema>

/** Field name of the honeypot input; real people never fill it. */
export const HONEYPOT = 'website'
/** Body field carrying the Turnstile token (same name Turnstile uses in plain forms). */
export const TOKEN_FIELD = 'cf-turnstile-response'
