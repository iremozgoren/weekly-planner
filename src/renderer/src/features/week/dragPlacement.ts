import type { Task } from '@shared/types'
import { DAY_DROPPABLE_PREFIX } from './DayColumn'

export type DropPlacement = { dayKey: string; order: number }

/**
 * Where a dropped task should land: which day, and what `order` value puts
 * it in the right spot. `order` is a float so inserting between two cards is
 * a midpoint computation, never a reindex of the whole column (see CLAUDE.md
 * § Task model).
 *
 * `overId` is either another task's id (insert next to it) or a day
 * column's droppable id (`day:<dayKey>`, dropped on empty space — append to
 * the end). `insertAfter` resolves "next to it" to before/after, decided by
 * the caller from the drag's live pointer position.
 *
 * Returns null when the drop doesn't actually change anything (dropped on
 * itself, or back in the same spot) — callers should skip the IPC call.
 */
export function computeDropPlacement(params: {
  tasks: Task[]
  activeId: string
  overId: string
  insertAfter: boolean
}): DropPlacement | null {
  const { tasks, activeId, overId, insertAfter } = params
  if (activeId === overId) return null

  const activeTask = tasks.find((task) => task.id === activeId)
  if (!activeTask) return null

  let destDayKey: string
  let overTaskId: string | null

  if (overId.startsWith(DAY_DROPPABLE_PREFIX)) {
    destDayKey = overId.slice(DAY_DROPPABLE_PREFIX.length)
    overTaskId = null
  } else {
    const overTask = tasks.find((task) => task.id === overId)
    if (!overTask) return null
    destDayKey = overTask.dayKey
    overTaskId = overTask.id
  }

  const siblings = tasks
    .filter((task) => task.dayKey === destDayKey && task.id !== activeId)
    .sort((a, b) => a.order - b.order)

  const insertIndex =
    overTaskId === null
      ? siblings.length
      : siblings.findIndex((task) => task.id === overTaskId) + (insertAfter ? 1 : 0)

  const prev = siblings[insertIndex - 1]
  const next = siblings[insertIndex]
  const order =
    prev && next ? (prev.order + next.order) / 2 : next ? next.order - 1 : prev ? prev.order + 1 : 0

  const isNoOp = destDayKey === activeTask.dayKey && Math.abs(order - activeTask.order) < 1e-9
  return isNoOp ? null : { dayKey: destDayKey, order }
}
