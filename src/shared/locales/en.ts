/**
 * English translations — the source of truth. Every other locale must
 * provide exactly this set of keys (see CLAUDE.md § i18n): add a sibling
 * `locales/xx.ts` of type `Translations` and register it in
 * `shared/locales/index.ts`, and a missing key becomes a type error
 * instead of a blank label at runtime.
 *
 * Keys are flat and namespaced (`week.*`, `task.*`, ...), mirroring
 * i18next's convention so migrating to i18next later is mechanical.
 *
 * Lives in shared/, not renderer/, because the main process reads from it
 * too — tray and native menu labels are built from the same locale modules
 * as the UI (see CLAUDE.md § i18n), not a separate copy of the strings.
 */
const en = {
  'common.appName': 'Weekly Planner',
  'common.today': 'Today',
  'common.loading': 'Loading…',
  'common.close': 'Close',
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.delete': 'Delete',
  'common.none': 'None',

  'week.previousWeek': 'Previous week',
  'week.nextWeek': 'Next week',
  'week.addTask': 'Add task',

  'task.newTask': 'New task',
  'task.editTask': 'Edit task',
  'task.titleLabel': 'Title',
  'task.titlePlaceholder': 'What do you need to do?',
  'task.notesLabel': 'Notes',
  'task.notesPlaceholder': 'Notes (optional)',
  'task.dayLabel': 'Day',
  'task.colorLabel': 'Color',
  'task.markDone': 'Mark done',

  'widget.title': 'Today',
  'widget.empty': 'Nothing planned for today.',
  'widget.collapse': 'Collapse',
  'widget.expand': 'Expand widget',

  'tray.showWidget': 'Show Widget',
  'tray.hideWidget': 'Hide Widget',
  'tray.openMainWindow': 'Open Main Window',
  'tray.quit': 'Quit',

  'settings.title': 'Settings',
  'settings.language': 'Language',
  'settings.launchAtLogin': 'Launch at login',
  'settings.launchAtLoginDescription': 'Automatically start Weekly Planner when you log in.',
}

export type Translations = typeof en
export type TranslationKey = keyof Translations

export default en
