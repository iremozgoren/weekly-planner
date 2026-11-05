import type { PlannerData, Settings } from './types'

export const PLANNER_VERSION = 2
export const SETTINGS_VERSION = 2

export function createDefaultPlannerData(): PlannerData {
  return { version: PLANNER_VERSION, tasks: [] }
}

export function createDefaultSettings(): Settings {
  return {
    version: SETTINGS_VERSION,
    theme: 'system',
    locale: 'en',
    launchAtLogin: false,
    widget: {
      visible: false,
      corner: 'top-right',
      offset: { x: 16, y: 16 },
      collapsed: false,
    },
  }
}
