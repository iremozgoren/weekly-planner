import type { WidgetCorner } from '@shared/types'

/**
 * Pure corner/position math for the widget window, deliberately free of any
 * Electron import so it reads and tests like a plain function — the actual
 * `screen`/`BrowserWindow` calls live in widgetWindow.ts.
 */
export type Rect = { x: number; y: number; width: number; height: number }
export type Size = { width: number; height: number }
export type Offset = { x: number; y: number }

/** Where the widget should sit for a given corner, computed from the work area (not the full display). */
export function cornerPosition(
  corner: WidgetCorner,
  size: Size,
  offset: Offset,
  workArea: Rect,
): { x: number; y: number } {
  const left = workArea.x + offset.x
  const right = workArea.x + workArea.width - size.width - offset.x
  const top = workArea.y + offset.y
  const bottom = workArea.y + workArea.height - size.height - offset.y

  switch (corner) {
    case 'top-left':
      return { x: left, y: top }
    case 'top-right':
      return { x: right, y: top }
    case 'bottom-left':
      return { x: left, y: bottom }
    case 'bottom-right':
      return { x: right, y: bottom }
  }
}

/** Which corner of the work area the window's current position is closest to. */
export function nearestCorner(bounds: Rect, workArea: Rect): WidgetCorner {
  const centerX = bounds.x + bounds.width / 2
  const centerY = bounds.y + bounds.height / 2
  const workCenterX = workArea.x + workArea.width / 2
  const workCenterY = workArea.y + workArea.height / 2

  const isTop = centerY < workCenterY
  const isLeft = centerX < workCenterX

  if (isTop) return isLeft ? 'top-left' : 'top-right'
  return isLeft ? 'bottom-left' : 'bottom-right'
}
