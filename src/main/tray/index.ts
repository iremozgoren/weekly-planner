import { join } from 'node:path'
import { app, Menu, nativeImage, Tray } from 'electron'
import { t } from '../i18n'
import { setQuitting } from '../appState'
import { createMainWindow, getMainWindow } from '../windows/mainWindow'
import { getWidgetWindow, toggleWidgetWindow } from '../windows/widgetWindow'

let tray: Tray | null = null

function getTrayIconPath(): string {
  const fileName = process.platform === 'win32' ? 'tray.ico' : 'trayTemplate.png'
  // In dev, __dirname is out/main; resources/ sits at the project root.
  // TODO(packaging step): revisit once electron-builder packages the app —
  // this may need process.resourcesPath instead.
  return join(__dirname, '../../resources', fileName)
}

function openMainWindow(): void {
  const win = getMainWindow()
  if (win) {
    win.show()
    win.focus()
  } else {
    createMainWindow()
  }
}

function buildMenu(): Menu {
  const widgetVisible = getWidgetWindow()?.isVisible() ?? false

  return Menu.buildFromTemplate([
    {
      label: widgetVisible ? t('tray.hideWidget') : t('tray.showWidget'),
      click: () => {
        toggleWidgetWindow()
        tray?.setContextMenu(buildMenu())
      },
    },
    { label: t('tray.openMainWindow'), click: openMainWindow },
    { type: 'separator' },
    {
      label: t('tray.quit'),
      click: () => {
        setQuitting(true)
        app.quit()
      },
    },
  ])
}

export function createTray(): Tray {
  if (tray) return tray

  const icon = nativeImage.createFromPath(getTrayIconPath())
  if (process.platform === 'darwin') {
    icon.setTemplateImage(true)
  }

  tray = new Tray(icon)
  tray.setToolTip(t('common.appName'))
  tray.setContextMenu(buildMenu())

  return tray
}
