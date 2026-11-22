import { z } from 'zod'
import { DOCUMENT_CATEGORIES, HOTLINE_TYPES, SERVICE_CATEGORIES } from './categories'

/** Placeholder record (John Doe / sample values) still waiting for real, verified data. */
const sample = z.boolean().optional()
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'use lowercase-kebab-case')
const text = z.string().trim().min(1)
const isoDate = z.iso.date() // YYYY-MM-DD
// http(s) only, so a content URL can never become a javascript: link.
const httpUrl = z.url({ protocol: /^https?$/ })
const phone = z.string().regex(/^[0-9+\-() ]{3,20}$/, 'digits, spaces, + - ( ) only')

export { SERVICE_CATEGORIES }

export const serviceSchema = z.object({
  slug,
  title_en: text,
  title_fil: text,
  category: z.enum(SERVICE_CATEGORIES),
  office: slug, // must match an Office slug (checked by validate:content)
  requirements: z.array(text),
  steps: z.array(text).min(1),
  fees: z.array(z.object({ item: text, amount_php: z.number().nonnegative() })),
  processing_time: text,
  schedule: text,
  last_verified: isoDate,
  source_url: httpUrl,
  /** Extra search terms (synonyms, Filipino words) not already in the titles. */
  keywords: z.array(text).optional(),
  sample,
})

export const hotlineSchema = z.object({
  name: text,
  agency: text,
  numbers: z.array(phone).min(1),
  type: z.enum(HOTLINE_TYPES),
  available_24_7: z.boolean(),
  sample,
})

export const officialSchema = z.object({
  name: text,
  position: text,
  term_start: isoDate,
  term_end: isoDate,
  office: slug, // must match an Office slug
  contact: z.object({ phone: phone.optional(), email: z.email().optional() }).optional(),
  sample,
})

export const officeSchema = z.object({
  slug,
  name: text,
  head: text.optional(),
  location: text,
  phone: phone.optional(),
  email: z.email().optional(),
  hours: text,
  sample,
})

export const barangaySchema = z.object({
  slug,
  name: text,
  captain: text.optional(),
  hall_address: text.optional(),
  hotline: phone.optional(),
  psgc_code: z.string().regex(/^\d{10}$/, '10-digit PSGC code'),
  /** true once a volunteer has confirmed the details against an official source. */
  verified: z.boolean(),
  sample,
})

export const tourismSpotSchema = z.object({
  slug,
  name: text,
  category: z.enum(['beach', 'nature', 'heritage', 'food', 'landmark']),
  description_en: text,
  description_fil: text,
  // Loose bounding box around Ternate, catches swapped or typo'd coordinates.
  lat: z.number().min(14.1).max(14.4),
  lng: z.number().min(120.55).max(120.85),
  image: z.string().optional(),
  sample,
})

export const newsPostSchema = z.object({
  title: text,
  date: isoDate,
  category: z.enum(['advisory', 'announcement', 'event']),
  summary: text,
  source_url: httpUrl.optional(),
  /** Advisories with a future `expires` date show in the home page banner. */
  expires: isoDate.optional(),
  sample,
})

export const documentSchema = z.object({
  title: text,
  category: z.enum(DOCUMENT_CATEGORIES),
  year: z.number().int().min(1990).max(2100),
  url: httpUrl,
  sample,
})

export type Service = z.infer<typeof serviceSchema>
export type Hotline = z.infer<typeof hotlineSchema>
export type Official = z.infer<typeof officialSchema>
export type Office = z.infer<typeof officeSchema>
export type Barangay = z.infer<typeof barangaySchema>
export type TourismSpot = z.infer<typeof tourismSpotSchema>
export type NewsPost = z.infer<typeof newsPostSchema>
export type PublicDocument = z.infer<typeof documentSchema>
