import type { Task } from '@shared/types'
import { DEFAULT_DURATION_MINUTES } from '@shared/time'

/** Droppable id prefix for an hour row, e.g. "hour:480" for 08:00. */
export const HOUR_DROPPABLE_PREFIX = 'hour:'
/** Droppable id for the unscheduled strip itself (dropped on empty space, not a specific card). */
export const UNSCHEDULED_DROPPABLE_ID = 'unscheduled'

export type DayDropResult =
  | { kind: 'schedule'; startMinutes: number; durationMinutes: number }
  | { kind: 'unschedule'; order: number }
  | { kind: 'reorder'; order: number }

/**
 * Where a day-view drop should land. `tasks` is just this day's tasks.
 * Mirrors week/dragPlacement.ts's midpoint-order approach for the
 * unscheduled strip; scheduling onto an hour is simpler — there's no
 * "position within the hour" to resolve, dropping on an hour always means
 * "start at this hour," preserving whatever duration the task already had
 * (or the default, if it was unscheduled).
 */
export function computeDayDropResult(params: {
  tasks: Task[]
  activeId: string
  overId: string
  insertAfter: boolean
}): DayDropResult | null {
  const { tasks, activeId, overId, insertAfter } = params
  if (activeId === overId) return null

  const activeTask = tasks.find((task) => task.id === activeId)
  if (!activeTask) return null

  if (overId.startsWith(HOUR_DROPPABLE_PREFIX)) {
    const startMinutes = Number(overId.slice(HOUR_DROPPABLE_PREFIX.length))
    if (Number.isNaN(startMinutes)) return null
    const durationMinutes = activeTask.schedule?.durationMinutes ?? DEFAULT_DURATION_MINUTES
    return { kind: 'schedule', startMinutes, durationMinutes }
  }

  const overTask =
    overId === UNSCHEDULED_DROPPABLE_ID ? null : tasks.find((task) => task.id === overId)
  const overIsUnscheduledZone =
    overId === UNSCHEDULED_DROPPABLE_ID || (overTask != null && overTask.schedule === null)
  if (!overIsUnscheduledZone) return null

  const siblings = tasks
    .filter((task) => task.schedule === null && task.id !== activeId)
    .sort((a, b) => a.order - b.order)

  const insertIndex =
    overTask == null
      ? siblings.length
      : siblings.findIndex((t) => t.id === overTask.id) + (insertAfter ? 1 : 0)

  const prev = siblings[insertIndex - 1]
  const next = siblings[insertIndex]
  const order =
    prev && next ? (prev.order + next.order) / 2 : next ? next.order - 1 : prev ? prev.order + 1 : 0

  if (activeTask.schedule === null) {
    if (Math.abs(order - activeTask.order) < 1e-9) return null
    return { kind: 'reorder', order }
  }
  return { kind: 'unschedule', order }
}
