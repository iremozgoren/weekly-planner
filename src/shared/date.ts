import { addDays, addWeeks, format, parseISO, startOfWeek, subWeeks } from 'date-fns'

/** Weeks start on Monday throughout the app (see CLAUDE.md § Task model). */
export const WEEK_STARTS_ON = 1

const DAY_KEY_FORMAT = 'yyyy-MM-dd'

/** Converts a Date to the ISO day key tasks are stored under, e.g. "2026-11-05". */
export function toDayKey(date: Date): string {
  return format(date, DAY_KEY_FORMAT)
}

export function fromDayKey(dayKey: string): Date {
  return parseISO(dayKey)
}

export function todayKey(): string {
  return toDayKey(new Date())
}

export function getWeekStart(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: WEEK_STARTS_ON })
}

/** The 7 dates (Monday–Sunday) of the week containing `date`. */
export function getWeekDays(date: Date): Date[] {
  const start = getWeekStart(date)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function goToPreviousWeek(date: Date): Date {
  return subWeeks(date, 1)
}

export function goToNextWeek(date: Date): Date {
  return addWeeks(date, 1)
}
