import type { PlannerData } from '@shared/types'
import { PLANNER_VERSION } from '@shared/defaults'

/**
 * One entry per released version, upgrading FROM that version TO the next.
 * Never edit a case once it has shipped — add a new one instead, and bump
 * PLANNER_VERSION in shared/defaults.ts alongside it.
 *
 * Currently empty: version 1 is the first released shape.
 */
const migrations: Record<number, (data: PlannerData) => PlannerData> = {}

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
