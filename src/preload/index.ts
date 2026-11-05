import { contextBridge } from 'electron'

// This is the only surface the renderer may use to reach the main process.
// Real IPC commands (tasks, settings, ...) are added here in later steps —
// the renderer must never see raw `ipcRenderer`.
const api = {
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
}

// contextIsolation is always on for every window in this app (see CLAUDE.md) —
// fail loudly instead of silently exposing `api` on an unisolated window.
if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled')
}
contextBridge.exposeInMainWorld('api', api)

export type Api = typeof api
