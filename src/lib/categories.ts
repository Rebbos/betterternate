// Zod-free so pages can import these without pulling the schema library into the bundle.

export const SERVICE_CATEGORIES = [
  'business',
  'civil-registry',
  'health',
  'social-welfare',
  'taxes-payments',
  'permits',
  'agriculture-fisheries',
  'education',
  'waste-management',
  'disaster-preparedness',
] as const

/** Emergency first: this is also the display order on /hotlines. */
export const HOTLINE_TYPES = ['emergency', 'health', 'utility', 'barangay'] as const

export const DOCUMENT_CATEGORIES = ['budget', 'procurement', 'ordinance', 'report'] as const
