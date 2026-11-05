import type { Task } from '@shared/types'

export type TimelineBlock = {
  task: Task
  startMinutes: number
  durationMinutes: number
  /** 0-based column index within its overlap group. */
  column: number
  /** How many columns its overlap group needs — width is 1/columnCount, all equal. */
  columnCount: number
}

/**
 * Lays out timed tasks for one day so overlapping ones sit side by side at
 * equal width, all visible and clickable (never stacked/hidden) — a greedy
 * interval-graph-coloring pass, the same approach calendar UIs commonly use:
 * walk tasks in start order, track which columns are currently "open"
 * (an earlier task whose time range hasn't ended yet), and give each task
 * the lowest column number not currently open. A run of mutually-touching
 * tasks (active never drops to empty) forms one "cluster"; every task in a
 * cluster shares that cluster's column count, so a later task reusing a
 * freed-up column still renders at the same width as its neighbors.
 */
export function layoutTimelineBlocks(tasks: Task[]): TimelineBlock[] {
  type Placed = { task: Task; start: number; end: number; column: number }

  const scheduled = tasks
    .filter((task) => task.schedule !== null)
    .map((task) => {
      const schedule = task.schedule
      if (!schedule) throw new Error('unreachable: filtered for non-null schedule above')
      return {
        task,
        start: schedule.startMinutes,
        end: schedule.startMinutes + schedule.durationMinutes,
      }
    })
    .sort((a, b) => a.start - b.start || a.task.id.localeCompare(b.task.id))

  let active: Placed[] = []
  let cluster: Placed[] = []
  const clusters: Placed[][] = []

  for (const event of scheduled) {
    active = active.filter((placed) => placed.end > event.start)
    if (active.length === 0 && cluster.length > 0) {
      clusters.push(cluster)
      cluster = []
    }

    const usedColumns = new Set(active.map((placed) => placed.column))
    let column = 0
    while (usedColumns.has(column)) column++

    const placed: Placed = { ...event, column }
    active.push(placed)
    cluster.push(placed)
  }
  if (cluster.length > 0) clusters.push(cluster)

  const result: TimelineBlock[] = []
  for (const group of clusters) {
    const columnCount = Math.max(...group.map((placed) => placed.column)) + 1
    for (const placed of group) {
      result.push({
        task: placed.task,
        startMinutes: placed.start,
        durationMinutes: placed.end - placed.start,
        column: placed.column,
        columnCount,
      })
    }
  }
  return result
}
