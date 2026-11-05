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
  'common.close': 'Close',
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.delete': 'Delete',
  'common.none': 'None',

  'week.previousWeek': 'Previous week',
  'week.nextWeek': 'Next week',
  'week.noTasks': 'No tasks',
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
}

export type Translations = typeof en
export type TranslationKey = keyof Translations

export default en
