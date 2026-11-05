import en, { type TranslationKey, type Translations } from './en'
import tr from './tr'

export type { TranslationKey, Translations }

export type Locale = 'en' | 'tr'

export const locales: Record<Locale, Translations> = { en, tr }

export function isLocale(value: string): value is Locale {
  return value === 'en' || value === 'tr'
}

export function translate(locale: Locale, key: TranslationKey): string {
  return locales[locale][key] ?? locales.en[key]
}
