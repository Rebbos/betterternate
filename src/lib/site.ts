export const REPO_URL = 'https://github.com/Rebbos/betterternate'
export const REPORT_URL = `${REPO_URL}/issues/new?template=data_correction.md`
export const BUDGET_URL = 'https://budget.bettergov.ph'
export const OSM_COPYRIGHT_URL = 'https://www.openstreetmap.org/copyright'

/** Site navigation. `primary` items show in the desktop header; all show in drawer + footer. */
export const NAV_ITEMS = [
  { to: '/services', key: 'nav.services', primary: true },
  { to: '/hotlines', key: 'nav.hotlines', primary: true },
  { to: '/government', key: 'nav.government', primary: true },
  { to: '/barangays', key: 'nav.barangays', primary: true },
  { to: '/tourism', key: 'nav.tourism', primary: true },
  { to: '/news', key: 'nav.news', primary: true },
  { to: '/transparency', key: 'nav.transparency', primary: false },
  { to: '/about', key: 'nav.about', primary: false },
  { to: '/contact', key: 'nav.contact', primary: false },
] as const
