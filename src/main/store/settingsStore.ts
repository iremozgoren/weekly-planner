import { join } from 'node:path'
import { app } from 'electron'
import type { Settings, SettingsPatch } from '@shared/types'
import { createDefaultSettings, SETTINGS_VERSION } from '@shared/defaults'
import {
  backupBeforeMigration,
  backupCorruptFile,
  readJsonFile,
  writeJsonFileAtomic,
} from './jsonFile'
import { createDebouncedWriter } from './debouncedWriter'
import { migrateSettings } from './migrations/settings'

function getFilePath(): string {
  return join(app.getPath('userData'), 'settings.json')
}

function isSettingsShape(value: unknown): value is Settings {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.version === 'number' && typeof v.theme === 'string' && typeof v.widget === 'object'
  )
}

let state: Settings = createDefaultSettings()
let initialized = false

const writer = createDebouncedWriter<Settings>((data) => writeJsonFileAtomic(getFilePath(), data))

/** Loads settings.json (or seeds defaults). Must run once before any other export is used. */
export async function initSettingsStore(): Promise<void> {
  const filePath = getFilePath()
  try {
    const raw = await readJsonFile<unknown>(filePath)
    if (raw === null) {
      state = createDefaultSettings()
    } else if (isSettingsShape(raw)) {
      if (raw.version < SETTINGS_VERSION) {
        backupBeforeMigration(filePath, raw.version)
      }
      state = migrateSettings(raw)
    } else {
      throw new Error('settings.json has an unexpected shape')
    }
  } catch (error) {
    console.error('[settingsStore] settings.json is unreadable, resetting to defaults:', error)
    backupCorruptFile(filePath)
    state = createDefaultSettings()
  }
  initialized = true
}

function assertInitialized(): void {
  if (!initialized) {
    throw new Error('settingsStore used before initSettingsStore() resolved')
  }
}

export function getSettings(): Settings {
  assertInitialized()
  return state
}

export function updateSettings(patch: SettingsPatch): Settings {
  assertInitialized()
  state = { ...state, ...patch }
  writer.writeDebounced(state)
  return state
}

/** Writes any pending debounced change immediately and waits for it. Call on before-quit. */
export async function flushSettingsStore(): Promise<void> {
  await writer.flush()
}
