/**
 * Pure minutes-since-midnight helpers backing the day view's hourly
 * timeline. Using plain numbers (not "HH:mm" strings) for Task.schedule
 * means comparing/sorting timed tasks is just number comparison — no
 * parsing anywhere a task is read.
 */
export const MINUTES_PER_DAY = 1440
export const DEFAULT_DURATION_MINUTES = 60

/** "07:00" style 24-hour label. Deliberately locale-independent — see TaskEditor/HourlyTimeline. */
export function minutesToTimeLabel(minutes: number): string {
  const normalized = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY
  const h = Math.floor(normalized / 60)
  const m = normalized % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** Parses an `<input type="time">` value ("HH:MM"). Returns null if empty/invalid. */
export function timeLabelToMinutes(label: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(label)
  if (!match) return null
  const h = Number(match[1])
  const m = Number(match[2])
  if (h < 0 || h > 23 || m < 0 || m > 59) return null
  return h * 60 + m
}

export function nowMinutes(date: Date = new Date()): number {
  return date.getHours() * 60 + date.getMinutes()
}
