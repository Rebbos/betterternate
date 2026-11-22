import { useOutletContext } from 'react-router'

export type LayoutContext = { openSearch: (query?: string) => void }

/** Opens the site search dialog (provided by RootLayout via <Outlet context>). */
export const useSearch = () => useOutletContext<LayoutContext>()
