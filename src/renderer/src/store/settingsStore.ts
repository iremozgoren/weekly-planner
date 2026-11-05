import { create } from 'zustand'
import type { Settings } from '@shared/types'
import { createDefaultSettings } from '@shared/defaults'

type SettingsState = {
  settings: Settings
  isInitialized: boolean
  /** Loads the current settings and subscribes to live updates. Safe to call more than once. */
  init: () => Promise<void>
}

/**
 * The renderer's view of settings.json — main is the single source of truth
 * (see CLAUDE.md § Data flow), this store only ever replaces its state from
 * window.api.settings.get()/onChanged. Used by useTranslation (locale) and
 * the widget (collapsed/corner/visible), so changing anything in the
 * Settings window reaches every window through the same broadcast.
 */
export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: createDefaultSettings(),
  isInitialized: false,
  init: async () => {
    if (get().isInitialized) return
    set({ isInitialized: true })

    window.api.settings.onChanged((settings) => set({ settings }))
    const settings = await window.api.settings.get()
    set({ settings })
  },
}))
