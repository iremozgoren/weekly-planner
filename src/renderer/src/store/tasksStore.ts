import { create } from 'zustand'
import type { Task } from '@shared/types'

type TasksState = {
  tasks: Task[]
  isLoading: boolean
  isInitialized: boolean
  /** Loads the current tasks and subscribes to live updates. Safe to call more than once. */
  init: () => Promise<void>
}

/**
 * The renderer's view of the task list. Main is the single source of truth
 * (see CLAUDE.md § Data flow) — this store only ever replaces its state from
 * `window.api.tasks.list()` / `onChanged`, it never mutates `tasks` locally.
 */
export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  isLoading: true,
  isInitialized: false,
  init: async () => {
    if (get().isInitialized) return
    set({ isInitialized: true })

    window.api.tasks.onChanged((tasks) => set({ tasks }))
    const tasks = await window.api.tasks.list()
    set({ tasks, isLoading: false })
  },
}))
