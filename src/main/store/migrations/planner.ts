import type { PlannerData } from '@shared/types'
import { PLANNER_VERSION } from '@shared/defaults'

/**
 * One entry per released version, upgrading FROM that version TO the next.
 * Never edit a case once it has shipped — add a new one instead, and bump
 * PLANNER_VERSION in shared/defaults.ts alongside it.
 */
const migrations: Record<number, (data: PlannerData) => PlannerData> = {
  // v1 -> v2: added Task.schedule (hourly planning). Existing tasks stay
  // untimed (schedule: null) — nothing about them changes otherwise.
  1: (data) => ({
    version: 2,
    tasks: data.tasks.map((task) => ({ ...task, schedule: null })),
  }),
}

export function migratePlannerData(data: PlannerData): PlannerData {
  let current = data
  while (current.version < PLANNER_VERSION) {
    const migrate = migrations[current.version]
    if (!migrate) {
      throw new Error(`No migration registered from planner.json version ${current.version}`)
    }
    current = migrate(current)
  }
  return current
}
