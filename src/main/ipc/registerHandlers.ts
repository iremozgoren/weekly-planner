import { ipcMain } from 'electron'
import { IpcChannels } from '@shared/ipc-channels'
import type { CreateTaskInput, SettingsPatch, UpdateTaskInput } from '@shared/types'
import * as tasksStore from '../store/tasksStore'
import * as settingsStore from '../store/settingsStore'
import { broadcastSettingsChanged, broadcastTasksChanged } from './broadcast'
import { getLaunchAtLoginStatus, setLaunchAtLoginStatus } from '../services/launchAtLogin'
import { createSettingsWindow } from '../windows/settingsWindow'

/** Wires every IPC channel from shared/ipc-channels.ts to a store action. Call once at startup. */
export function registerIpcHandlers(): void {
  ipcMain.handle(IpcChannels.tasksList, () => tasksStore.listTasks())

  ipcMain.handle(IpcChannels.taskCreate, (_event, input: CreateTaskInput) => {
    const task = tasksStore.createTask(input)
    broadcastTasksChanged()
    return task
  })

  ipcMain.handle(IpcChannels.taskUpdate, (_event, input: UpdateTaskInput) => {
    const task = tasksStore.updateTask(input)
    broadcastTasksChanged()
    return task
  })

  ipcMain.handle(IpcChannels.taskDelete, (_event, id: string) => {
    tasksStore.deleteTask(id)
    broadcastTasksChanged()
  })

  ipcMain.handle(IpcChannels.settingsGet, () => settingsStore.getSettings())

  ipcMain.handle(IpcChannels.settingsUpdate, (_event, patch: SettingsPatch) => {
    const settings = settingsStore.updateSettings(patch)
    broadcastSettingsChanged()
    return settings
  })

  ipcMain.handle(IpcChannels.launchAtLoginGet, () => getLaunchAtLoginStatus())

  ipcMain.handle(IpcChannels.launchAtLoginSet, (_event, enabled: boolean) => {
    const confirmed = setLaunchAtLoginStatus(enabled)
    // Keep settings.json's record in sync too, in case anything else ever reads it from there.
    settingsStore.updateSettings({ launchAtLogin: confirmed })
    broadcastSettingsChanged()
    return confirmed
  })

  ipcMain.handle(IpcChannels.settingsWindowOpen, () => {
    createSettingsWindow()
  })
}
