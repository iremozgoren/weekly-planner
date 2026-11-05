import en, { type TranslationKey } from '@shared/locales/en'

/**
 * Tray and native menu labels are built from the same locale module as the
 * renderer (see CLAUDE.md § i18n) — this is the main-process-side lookup.
 * No reactive locale switching yet (same caveat as the renderer's
 * useTranslation): rebuilding the tray menu after a locale change is the
 * settings step's job.
 */
export function t(key: TranslationKey): string {
  return en[key]
}
