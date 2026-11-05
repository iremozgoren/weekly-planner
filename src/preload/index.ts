import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'
import { IpcChannels } from '../shared/ipc-channels'
import type {
  CreateTaskInput,
  Settings,
  SettingsPatch,
  Task,
  UpdateTaskInput,
} from '../shared/types'

// This is the only surface the renderer may use to reach the main process.
// Real IPC commands are added here as the app grows — the renderer must
// never see raw `ipcRenderer` (see CLAUDE.md § Process boundaries).
const api = {
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  tasks: {
    list: (): Promise<Task[]> => ipcRenderer.invoke(IpcChannels.tasksList),
    create: (input: CreateTaskInput): Promise<Task> =>
      ipcRenderer.invoke(IpcChannels.taskCreate, input),
    update: (input: UpdateTaskInput): Promise<Task> =>
      ipcRenderer.invoke(IpcChannels.taskUpdate, input),
    delete: (id: string): Promise<void> => ipcRenderer.invoke(IpcChannels.taskDelete, id),
    /** Fires whenever the task list changes in any window. Returns an unsubscribe function. */
    onChanged: (callback: (tasks: Task[]) => void): (() => void) => {
      const listener = (_event: IpcRendererEvent, tasks: Task[]): void => callback(tasks)
      ipcRenderer.on(IpcChannels.tasksChanged, listener)
      return () => ipcRenderer.removeListener(IpcChannels.tasksChanged, listener)
    },
  },
  settings: {
    get: (): Promise<Settings> => ipcRenderer.invoke(IpcChannels.settingsGet),
    update: (patch: SettingsPatch): Promise<Settings> =>
      ipcRenderer.invoke(IpcChannels.settingsUpdate, patch),
    /** Fires whenever settings change in any window. Returns an unsubscribe function. */
    onChanged: (callback: (settings: Settings) => void): (() => void) => {
      const listener = (_event: IpcRendererEvent, settings: Settings): void => callback(settings)
      ipcRenderer.on(IpcChannels.settingsChanged, listener)
      return () => ipcRenderer.removeListener(IpcChannels.settingsChanged, listener)
    },
    /** Always the real OS value — see CLAUDE.md § Platform specifics. */
    getLaunchAtLogin: (): Promise<boolean> => ipcRenderer.invoke(IpcChannels.launchAtLoginGet),
    setLaunchAtLogin: (enabled: boolean): Promise<boolean> =>
      ipcRenderer.invoke(IpcChannels.launchAtLoginSet, enabled),
  },
  openSettingsWindow: (): Promise<void> => ipcRenderer.invoke(IpcChannels.settingsWindowOpen),
}

// contextIsolation is always on for every window in this app (see CLAUDE.md) —
// fail loudly instead of silently exposing `api` on an unisolated window.
if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled')
}
contextBridge.exposeInMainWorld('api', api)

export type Api = typeof api
