/**
 * English translations — the source of truth. Every other locale must
 * provide exactly this set of keys (see CLAUDE.md § i18n): add a sibling
 * `locales/tr.ts` etc. of type `Translations` and register it in
 * `i18n/index.ts`, and a missing key becomes a type error instead of a
 * blank label at runtime.
 *
 * Keys are flat and namespaced (`week.*`, `task.*`, ...), mirroring
 * i18next's convention so migrating to i18next later is mechanical.
 */
const en = {
  'common.appName': 'Weekly Planner',
  'common.today': 'Today',
  'common.loading': 'Loading…',

  'week.previousWeek': 'Previous week',
  'week.nextWeek': 'Next week',
  'week.noTasks': 'No tasks',
}

export type Translations = typeof en
export type TranslationKey = keyof Translations

export default en
