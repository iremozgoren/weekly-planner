import { enUS, tr } from 'date-fns/locale'
import type { Locale as DateFnsLocale } from 'date-fns'
import type { Locale } from '@shared/locales'

const dateLocales: Record<Locale, DateFnsLocale> = { en: enUS, tr }

/** The date-fns locale object matching the app's current UI locale (weekday/month names, etc). */
export function getDateFnsLocale(locale: Locale): DateFnsLocale {
  return dateLocales[locale]
}
