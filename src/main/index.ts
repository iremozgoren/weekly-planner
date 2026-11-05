import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createMainWindow } from './windows/mainWindow'
import { createWidgetWindow } from './windows/widgetWindow'
import { initTasksStore, flushTasksStore } from './store/tasksStore'
import { initSettingsStore, flushSettingsStore } from './store/settingsStore'
import { registerIpcHandlers } from './ipc/registerHandlers'

// Only one instance of the app may run at a time; a second launch focuses the first.
const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    const win = BrowserWindow.getAllWindows()[0]
    if (win) {
      if (win.isMinimized()) win.restore()
      win.show()
      win.focus()
    }
  })

  void app.whenReady().then(async () => {
    electronApp.setAppUserModelId('com.weeklyplanner.app')

    app.on('browser-window-created', (_event, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    // Stores must be loaded before any window can ask for data over IPC.
    await Promise.all([initTasksStore(), initSettingsStore()])
    registerIpcHandlers()

    createMainWindow()
    // TODO(tray step): respect settings.widget.visible and let the tray
    // toggle it; for now it's always shown so it can be built and tested.
    createWidgetWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow()
      }
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  // Debounced writes may still be pending when the user quits; flush them
  // before the process actually exits instead of risking a lost write.
  let isQuitting = false
  app.on('before-quit', (event) => {
    if (isQuitting) return
    isQuitting = true
    event.preventDefault()
    void Promise.all([flushTasksStore(), flushSettingsStore()]).finally(() => {
      app.quit()
    })
  })
}
