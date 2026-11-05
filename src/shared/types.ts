import type { LabelColor } from './labels'

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
}

/** The on-disk shape of settings.json. `version` drives the migration chain. */
export type Settings = {
  version: number
  theme: ThemeMode
  locale: string
  launchAtLogin: boolean
  widget: WidgetSettings
}

export type SettingsPatch = Partial<Omit<Settings, 'version'>>
