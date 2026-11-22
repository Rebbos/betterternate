import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import fil from './locales/fil.json'

export const LANGUAGES = ['en', 'fil'] as const
const STORAGE_KEY = 'bt-lang'

function savedLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null // storage blocked (private mode etc.)
  }
}

const initial = savedLanguage() === 'fil' ? 'fil' : 'en'

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, fil: { translation: fil } },
  lng: initial,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

document.documentElement.lang = initial

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
  try {
    localStorage.setItem(STORAGE_KEY, lng)
  } catch {
    // not persisted; still works for this visit
  }
})

export default i18n
