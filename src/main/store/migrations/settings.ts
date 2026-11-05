import type { Settings } from '@shared/types'
import { SETTINGS_VERSION } from '@shared/defaults'

/**
 * One entry per released version, upgrading FROM that version TO the next.
 * Never edit a case once it has shipped — add a new one instead, and bump
 * SETTINGS_VERSION in shared/defaults.ts alongside it.
 */
const migrations: Record<number, (data: Settings) => Settings> = {
  // v1 -> v2: added widget.collapsed (the widget can shrink to a "Today" pill).
  1: (data) => ({
    ...data,
    version: 2,
    widget: { ...data.widget, collapsed: false },
  }),
}

export function migrateSettings(data: Settings): Settings {
  let current = data
  while (current.version < SETTINGS_VERSION) {
    const migrate = migrations[current.version]
    if (!migrate) {
      throw new Error(`No migration registered from settings.json version ${current.version}`)
    }
    current = migrate(current)
  }
  return current
}
