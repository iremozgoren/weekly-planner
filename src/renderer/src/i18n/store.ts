import { create } from 'zustand'
import type { Locale } from '@shared/locales'

type I18nState = {
  locale: Locale
  isInitialized: boolean
  /** Loads the current locale and subscribes to live updates. Safe to call more than once. */
  init: () => Promise<void>
}

/**
 * The renderer's view of the current locale — settings.locale is the single
 * source of truth in main (see CLAUDE.md § Data flow), this store only ever
 * replaces its state from window.api.settings.get()/onChanged. Changing the
 * locale in the Settings window goes through the existing settings update
 * path, so every window's i18n re-renders from the very same broadcast that
 * already keeps theme/launchAtLogin/widget settings in sync.
 */
export const useI18nStore = create<I18nState>((set, get) => ({
  locale: 'en',
  isInitialized: false,
  init: async () => {
    if (get().isInitialized) return
    set({ isInitialized: true })

    window.api.settings.onChanged((settings) => set({ locale: settings.locale }))
    const settings = await window.api.settings.get()
    set({ locale: settings.locale })
  },
}))
