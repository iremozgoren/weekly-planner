import { translate, type TranslationKey } from '@shared/locales'
import { getSettings } from './store/settingsStore'

/**
 * Tray and native menu labels are built from the same locale modules as the
 * renderer (see CLAUDE.md § i18n). Reads the current locale live from
 * settingsStore on every call, so it always reflects the latest change —
 * the tray menu itself is rebuilt by main/tray's refreshTrayMenu() whenever
 * settings change, so labels actually switch language immediately.
 */
export function t(key: TranslationKey): string {
  return translate(getSettings().locale, key)
}
