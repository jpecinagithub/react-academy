import { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import { en } from './en.js'
import { es } from './es.js'
import { useStore } from '../state/store.js'

const DICTS = { en, es }
export const SUPPORTED_LANGS = ['en', 'es']
const STORAGE_KEY = 'rfa-lang'

const LangContext = createContext(null)

function detectInitial() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'es') return saved
  } catch {
    /* ignore */
  }
  const nav = (navigator.language || 'en').toLowerCase()
  return nav.startsWith('es') ? 'es' : 'en'
}

export function LanguageProvider({ children }) {
  const lang = useStore((s) => s.lang)
  const setLangStore = useStore((s) => s.setLang)

  // Hydrate once from localStorage / navigator.
  useEffect(() => {
    setLangStore(detectInitial())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignore */
    }
  }, [lang])

  const setLang = useCallback(
    (l) => {
      if (SUPPORTED_LANGS.includes(l)) setLangStore(l)
    },
    [setLangStore],
  )

  // t(dict) — picks the current language from a local { en, es } object.
  // t('nav.home') — picks from the global chrome dicts.
  // t(path, vars) — {name} interpolation for global strings.
  const t = useCallback(
    (input, vars) => {
      let str
      if (typeof input === 'string') {
        str = input.split('.').reduce((acc, k) => acc?.[k], DICTS[lang]) ?? input
      } else if (input && typeof input === 'object') {
        str = input[lang] ?? input.en ?? ''
      } else {
        str = ''
      }
      if (typeof str === 'string' && vars) {
        return str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`)
      }
      return str
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>')
  return ctx
}
