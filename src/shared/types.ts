import type { LabelColor } from './labels'
import type { Locale } from './locales'

/**
 * `startMinutes`/`durationMinutes` are minutes since midnight — comparing
 * or sorting timed tasks is plain number comparison, no time parsing
 * anywhere a task is read. A discriminated null-or-both shape (rather than
 * two separately-nullable fields) makes "has a start time but no duration"
 * unrepresentable instead of merely discouraged.
 */
export type TaskSchedule = { startMinutes: number; durationMinutes: number } | null

/** A single task, keyed by the ISO day it belongs to (see CLAUDE.md § Task model). */
export type Task = {
  id: string
  title: string
  notes: string | null
  /** ISO date, e.g. "2026-11-05". Moving a task between days just rewrites this. */
  dayKey: string
  done: boolean
  color: LabelColor | null
  /** Float position within its day; a drop between two cards is a midpoint, not a reindex. */
  order: number
  /** null = untimed, stays in the day's plain list. Non-null = placed on the hourly timeline. */
  schedule: TaskSchedule
  createdAt: string
  updatedAt: string
}

/** The on-disk shape of planner.json. `version` drives the migration chain. */
export type PlannerData = {
  version: number
  tasks: Task[]
}

export type CreateTaskInput = {
  title: string
  dayKey: string
  notes?: string | null
  color?: LabelColor | null
  schedule?: TaskSchedule
}

export type TaskPatch = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>

export type UpdateTaskInput = {
  id: string
  patch: TaskPatch
}

export type ThemeMode = 'light' | 'dark' | 'system'

export type WidgetCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export type WidgetSettings = {
  visible: boolean
  corner: WidgetCorner
  offset: { x: number; y: number }
  /** Collapsed to a small "Today" pill instead of showing the full task list. */
  collapsed: boolean
}

/** The on-disk shape of settings.json. `version` drives the migration chain. */
export type Settings = {
  version: number
  theme: ThemeMode
  locale: Locale
  launchAtLogin: boolean
  widget: WidgetSettings
}

export type SettingsPatch = Partial<Omit<Settings, 'version'>>
