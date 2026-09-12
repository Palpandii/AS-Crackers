import { createContext, useContext, useEffect, useState } from 'react'
import { translations } from '../utils/translations.js'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('as_lang') || 'en')

  useEffect(() => {
    localStorage.setItem('as_lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const toggleLang = () => setLang((l) => (l === 'en' ? 'ta' : 'en'))

  // t('nav.home') style lookup with English fallback
  const t = (key) => {
    const dict = translations[lang] || translations.en
    return dict[key] ?? translations.en[key] ?? key
  }

  // pick localized field from a data object, e.g. pickField(product, 'name')
  const pickField = (obj, base) => {
    if (!obj) return ''
    return lang === 'ta' ? (obj[`${base}_ta`] ?? obj[`${base}_en`]) : obj[`${base}_en`]
  }

  // return both languages together, e.g. pickBoth(product, 'name') -> { en, ta }
  const pickBoth = (obj, base) => {
    if (!obj) return { en: '', ta: '' }
    return { en: obj[`${base}_en`] ?? '', ta: obj[`${base}_ta`] ?? obj[`${base}_en`] ?? '' }
  }

  // both-language version of a translation key, e.g. tBoth('products.filterAll')
  const tBoth = (key) => ({
    en: translations.en[key] ?? key,
    ta: translations.ta[key] ?? translations.en[key] ?? key,
  })

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, pickField, pickBoth, tBoth }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}