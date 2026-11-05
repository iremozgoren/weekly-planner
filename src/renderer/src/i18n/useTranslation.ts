import { useEffect } from 'react'
import { translate, type Locale, type TranslationKey } from '@shared/locales'
import { useSettingsStore } from '../store/settingsStore'
import { getDateFnsLocale } from './dateLocale'

type UseTranslationResult = {
  t: (key: TranslationKey) => string
  locale: Locale
  dateLocale: ReturnType<typeof getDateFnsLocale>
}

/**
 * `const { t } = useTranslation()` everywhere a component needs a string —
 * no component may hardcode user-facing text (see CLAUDE.md § i18n).
 *
 * Reactive: subscribes to the current locale (part of the shared settings
 * store), so every component using this re-renders when it changes (e.g.
 * from the Settings window). Also triggers the settings store's one-time
 * init — safe to call from every window, `init()` is idempotent, so no
 * window needs to remember to wire this up.
 */
export function useTranslation(): UseTranslationResult {
  const locale = useSettingsStore((state) => state.settings.locale)

  useEffect(() => {
    void useSettingsStore.getState().init()
  }, [])

  return {
    t: (key) => translate(locale, key),
    locale,
    dateLocale: getDateFnsLocale(locale),
  }
}
