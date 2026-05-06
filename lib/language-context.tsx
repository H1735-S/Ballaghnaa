'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Lang = 'ar' | 'en'

interface LanguageContextValue {
  lang: Lang
  isRtl: boolean
  t: (ar: string, en: string) => string
  setLang: (lang: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'ar',
  isRtl: true,
  t: (ar) => ar,
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    
    const saved = localStorage.getItem('lang') as Lang | null
    const initial: Lang = saved === 'ar' ? 'ar' : 'en'
    setLangState(initial)
    document.documentElement.dir = initial === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = initial
  }, [])

  const setLang = (next: Lang) => {
    setLangState(next)
    document.documentElement.dir  = next === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = next
    try { localStorage.setItem('lang', next) } catch {}
  }

  
  const t = (ar: string, en: string) => lang === 'ar' ? ar : en

  return (
    <LanguageContext.Provider value={{ lang, isRtl: lang === 'ar', t, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
