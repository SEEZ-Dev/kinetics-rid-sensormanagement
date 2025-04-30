"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { en } from "@/i18n/en"
import { th } from "@/i18n/th"

type Language = "en" | "th"
type Translations = typeof en

interface LanguageContextType {
  language: Language
  t: (key: keyof typeof en) => string
  changeLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [translations, setTranslations] = useState<Translations>(en)

  useEffect(() => {
    // Check if there's a saved language preference in localStorage
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "th")) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // Update translations when language changes
    setTranslations(language === "en" ? en : th)
    localStorage.setItem("language", language)
  }, [language])

  const t = (key: keyof typeof en) => {
    return translations[key] || key
  }

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
  }

  return <LanguageContext.Provider value={{ language, t, changeLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
