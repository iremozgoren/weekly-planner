import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import { app } from 'electron'
import type { CreateTaskInput, PlannerData, Task, UpdateTaskInput } from '@shared/types'
import { createDefaultPlannerData, PLANNER_VERSION } from '@shared/defaults'
import {
  backupBeforeMigration,
  backupCorruptFile,
  readJsonFile,
  writeJsonFileAtomic,
} from './jsonFile'
import { createDebouncedWriter } from './debouncedWriter'
import { migratePlannerData } from './migrations/planner'

function getFilePath(): string {
  return join(app.getPath('userData'), 'planner.json')
}

function isPlannerDataShape(value: unknown): value is PlannerData {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return typeof v.version === 'number' && Array.isArray(v.tasks)
}

let state: PlannerData = createDefaultPlannerData()
let initialized = false

const writer = createDebouncedWriter<PlannerData>((data) =>
  writeJsonFileAtomic(getFilePath(), data),
)

/** Loads planner.json (or seeds defaults). Must run once before any other export is used. */
export async function initTasksStore(): Promise<void> {
  const filePath = getFilePath()
  try {
    const raw = await readJsonFile<unknown>(filePath)
    if (raw === null) {
      state = createDefaultPlannerData()
    } else if (isPlannerDataShape(raw)) {
      if (raw.version < PLANNER_VERSION) {
        backupBeforeMigration(filePath, raw.version)
      }
      state = migratePlannerData(raw)
    } else {
      throw new Error('planner.json has an unexpected shape')
    }
  } catch (error) {
    console.error('[tasksStore] planner.json is unreadable, resetting to defaults:', error)
    backupCorruptFile(filePath)
    state = createDefaultPlannerData()
  }
  initialized = true
}

function assertInitialized(): void {
  if (!initialized) {
    throw new Error('tasksStore used before initTasksStore() resolved')
  }
}

function persist(): void {
  writer.writeDebounced(state)
}

export function listTasks(): Task[] {
  assertInitialized()
  return state.tasks
}

export function createTask(input: CreateTaskInput): Task {
  assertInitialized()
  const now = new Date().toISOString()
  const siblingOrders = state.tasks.filter((t) => t.dayKey === input.dayKey).map((t) => t.order)
  const order = siblingOrders.length > 0 ? Math.max(...siblingOrders) + 1 : 0

  const task: Task = {
    id: randomUUID(),
    title: input.title,
    notes: input.notes ?? null,
    dayKey: input.dayKey,
    done: false,
    color: input.color ?? null,
    order,
    schedule: input.schedule ?? null,
    createdAt: now,
    updatedAt: now,
  }

  state = { ...state, tasks: [...state.tasks, task] }
  persist()
  return task
}

export function updateTask(input: UpdateTaskInput): Task {
  assertInitialized()
  const index = state.tasks.findIndex((t) => t.id === input.id)
  if (index === -1) {
    throw new Error(`Task not found: ${input.id}`)
  }

  const updated: Task = {
    ...state.tasks[index],
    ...input.patch,
    updatedAt: new Date().toISOString(),
  }
  const tasks = [...state.tasks]
  tasks[index] = updated
  state = { ...state, tasks }
  persist()
  return updated
}

export function deleteTask(id: string): void {
  assertInitialized()
  state = { ...state, tasks: state.tasks.filter((t) => t.id !== id) }
  persist()
}

/** Writes any pending debounced change immediately and waits for it. Call on before-quit. */
export async function flushTasksStore(): Promise<void> {
  await writer.flush()
}
