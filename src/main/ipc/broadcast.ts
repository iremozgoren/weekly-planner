import { BrowserWindow } from 'electron'
import { IpcChannels } from '@shared/ipc-channels'
import { listTasks } from '../store/tasksStore'
import { getSettings } from '../store/settingsStore'

/**
 * Pushes the current state to every open window. This is what keeps the
 * widget and main window in sync — the widget just subscribes to the same
 * broadcast, it is never special-cased (see CLAUDE.md § Data flow).
 */
export function broadcastTasksChanged(): void {
  const tasks = listTasks()
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send(IpcChannels.tasksChanged, tasks)
  }
}

export function broadcastSettingsChanged(): void {
  const settings = getSettings()
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send(IpcChannels.settingsChanged, settings)
  }
}
