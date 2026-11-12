'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { translations } from './translations'
import { pageTranslations } from './pageTranslations'

const LanguageContext = createContext(null)

const DEFAULT_LANG = 'bn'
const STORAGE_KEY = 'zapy_lang'

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(DEFAULT_LANG)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'bn' || saved === 'en') {
        setLang(saved)
      }
    } catch (_) {}
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch (_) {}
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'bn' ? 'bn' : 'en'
    }
  }, [lang, ready])

  const t = {
    ...(translations[lang] || translations.bn),
    ...(pageTranslations[lang] || pageTranslations.bn),
  }

  const toggleLang = () => setLang((prev) => (prev === 'bn' ? 'en' : 'bn'))
  const setLanguage = (next) => {
    if (next === 'bn' || next === 'en') setLang(next)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, toggleLang, t, ready }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
}
