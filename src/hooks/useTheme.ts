import { useState } from 'react'

type Theme = 'light' | 'dark'
const STORAGE_KEY = 'bt-theme' // also read by the inline script in index.html

function currentTheme(): Theme {
  const attr = document.documentElement.dataset.theme
  if (attr === 'light' || attr === 'dark') return attr
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(currentTheme)
  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // not persisted; still applies for this visit
    }
    setTheme(next)
  }
  return { theme, toggle }
}
