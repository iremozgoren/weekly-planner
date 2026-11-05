import en, { type TranslationKey, type Translations } from './locales/en'

export type { TranslationKey }

export type Locale = 'en'

const locales: Record<Locale, Translations> = { en }

let currentLocale: Locale = 'en'

export function setLocale(locale: Locale): void {
  currentLocale = locale
}

export function getLocale(): Locale {
  return currentLocale
}

export function t(key: TranslationKey): string {
  return locales[currentLocale][key]
}
