import type { ComponentType } from 'react'
import type { RouteObject } from 'react-router'
import RootLayout from '@/components/layout/RootLayout'

const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
})

export const routes: RouteObject[] = [
  {
    Component: RootLayout,
    // Shown only while the first page chunk loads; blank avoids a layout flash.
    HydrateFallback: () => null,
    children: [
      { index: true, lazy: page(() => import('@/routes/Home')) },
      { path: 'services', lazy: page(() => import('@/routes/Services')) },
      { path: 'services/:slug', lazy: page(() => import('@/routes/ServiceDetail')) },
      { path: 'hotlines', lazy: page(() => import('@/routes/Hotlines')) },
      { path: 'government', lazy: page(() => import('@/routes/Government')) },
      { path: 'barangays', lazy: page(() => import('@/routes/Barangays')) },
      { path: 'barangays/:slug', lazy: page(() => import('@/routes/BarangayDetail')) },
      { path: 'transparency', lazy: page(() => import('@/routes/Transparency')) },
      { path: 'tourism', lazy: page(() => import('@/routes/Tourism')) },
      { path: 'news', lazy: page(() => import('@/routes/News')) },
      { path: 'news/:slug', lazy: page(() => import('@/routes/NewsDetail')) },
      { path: 'contact', lazy: page(() => import('@/routes/Contact')) },
      { path: 'about', lazy: page(() => import('@/routes/About')) },
      // Dev-only; the import is dropped from production builds.
      ...(import.meta.env.DEV
        ? [{ path: 'dev/ui', lazy: page(() => import('@/routes/DevUi')) }]
        : []),
      { path: '*', lazy: page(() => import('@/routes/NotFound')) },
    ],
  },
]
