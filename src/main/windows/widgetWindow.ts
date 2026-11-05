import { join } from 'node:path'
import { BrowserWindow, screen } from 'electron'
import { is } from '@electron-toolkit/utils'
import { getSettings, updateSettings } from '../store/settingsStore'
import { broadcastSettingsChanged } from '../ipc/broadcast'
import { isQuitting } from '../appState'
import { cornerPosition, nearestCorner, type Rect, type Size } from './widgetPosition'

const WIDGET_SIZE: Size = { width: 240, height: 300 }
/** Just big enough for the "Today"/"Bugün" pill text with comfortable padding. */
const WIDGET_COLLAPSED_SIZE: Size = { width: 112, height: 40 }
/** How long the widget must sit still after a drag before it snaps to a corner. */
const MOVE_SETTLE_MS = 300

let widgetWindow: BrowserWindow | null = null
let moveSettleTimer: NodeJS.Timeout | null = null

function getWidgetSize(): Size {
  return getSettings().widget.collapsed ? WIDGET_COLLAPSED_SIZE : WIDGET_SIZE
}

function workAreaForBounds(bounds: Rect): Rect {
  const center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }
  return screen.getDisplayNearestPoint(center).workArea
}

function snapToCorner(
  win: BrowserWindow,
  corner: Parameters<typeof cornerPosition>[0],
  animate: boolean,
): void {
  const workArea = workAreaForBounds(win.getBounds())
  const { widget } = getSettings()
  const { x, y } = cornerPosition(corner, getWidgetSize(), widget.offset, workArea)
  win.setPosition(Math.round(x), Math.round(y), animate)
}

export function createWidgetWindow(): BrowserWindow {
  if (widgetWindow) return widgetWindow

  const { widget } = getSettings()
  const initialWorkArea = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workArea
  const initialSize = getWidgetSize()
  const initialPosition = cornerPosition(widget.corner, initialSize, widget.offset, initialWorkArea)

  widgetWindow = new BrowserWindow({
    ...initialSize,
    x: Math.round(initialPosition.x),
    y: Math.round(initialPosition.y),
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    resizable: false,
    movable: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    fullscreenable: false,
    show: false,
    // macOS-only: an NSPanel-backed window that never takes app focus and
    // stays out of Mission Control / the window-switcher list.
    ...(process.platform === 'darwin' ? { type: 'panel' } : {}),
    // Frosted glass: macOS vibrancy blurs the desktop behind the window;
    // the card's own CSS background is a translucent overlay on top of
    // that blur (see styles/widget-global.css). 'popover' auto-adapts to
    // light/dark. Windows 11 22H2+ gets the acrylic equivalent — this is
    // set defensively and has NOT been visually verified on a real Windows
    // machine, same caveat as every other Windows-only feature so far.
    ...(process.platform === 'darwin' ? { vibrancy: 'popover', visualEffectState: 'active' } : {}),
    ...(process.platform === 'win32' ? { backgroundMaterial: 'acrylic' } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (process.platform === 'darwin') {
    widgetWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
    widgetWindow.setAlwaysOnTop(true, 'floating')
  }

  widgetWindow.on('ready-to-show', () => {
    if (getSettings().widget.visible) widgetWindow?.show()
  })

  // Same rationale as the main window: hide, don't destroy, unless this is
  // an actual app quit.
  widgetWindow.on('close', (event) => {
    if (isQuitting()) return
    event.preventDefault()
    widgetWindow?.hide()
  })

  widgetWindow.on('closed', () => {
    widgetWindow = null
    if (moveSettleTimer) clearTimeout(moveSettleTimer)
  })

  // The user can drag the widget anywhere; once it settles, snap it to
  // whichever corner it ended up closest to and remember that corner.
  widgetWindow.on('moved', () => {
    if (moveSettleTimer) clearTimeout(moveSettleTimer)
    moveSettleTimer = setTimeout(() => {
      if (!widgetWindow) return
      const bounds = widgetWindow.getBounds()
      const corner = nearestCorner(bounds, workAreaForBounds(bounds))
      snapToCorner(widgetWindow, corner, true)

      const current = getSettings()
      if (current.widget.corner !== corner) {
        updateSettings({ widget: { ...current.widget, corner } })
        broadcastSettingsChanged()
      }
    }, MOVE_SETTLE_MS)
  })

  // A display being added/removed/resized can leave the widget off-screen or
  // mid-screen; re-pin it to its stored corner on the (now current) nearest display.
  screen.on('display-metrics-changed', () => {
    if (!widgetWindow) return
    snapToCorner(widgetWindow, getSettings().widget.corner, false)
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    void widgetWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/widget.html`)
  } else {
    void widgetWindow.loadFile(join(__dirname, '../renderer/widget.html'))
  }

  return widgetWindow
}

export function getWidgetWindow(): BrowserWindow | null {
  return widgetWindow
}

/** Shows or hides the widget and persists the choice, so it reopens in the same state. */
export function setWidgetVisible(visible: boolean): void {
  if (!widgetWindow) return
  if (visible) {
    widgetWindow.show()
  } else {
    widgetWindow.hide()
  }

  const current = getSettings()
  if (current.widget.visible !== visible) {
    updateSettings({ widget: { ...current.widget, visible } })
    broadcastSettingsChanged()
  }
}

export function toggleWidgetWindow(): void {
  if (!widgetWindow) return
  setWidgetVisible(!widgetWindow.isVisible())
}

/**
 * Resizes the window to match the current collapsed/expanded setting and
 * repositions it so the same corner stays anchored (shrinking/growing a
 * window changes which x/y keeps e.g. its *bottom-right* edge fixed). Safe
 * to call any time settings might have changed the collapsed state or size
 * inputs (corner/offset) — recomputes from scratch, so a redundant call is
 * a harmless no-op.
 */
export function applyWidgetCollapsedState(): void {
  if (!widgetWindow) return
  const { widget } = getSettings()
  const size = getWidgetSize()
  const workArea = workAreaForBounds(widgetWindow.getBounds())
  const { x, y } = cornerPosition(widget.corner, size, widget.offset, workArea)
  widgetWindow.setBounds(
    { x: Math.round(x), y: Math.round(y), width: size.width, height: size.height },
    true,
  )
}
