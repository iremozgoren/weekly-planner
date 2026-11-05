/**
 * Whether the app is actually quitting, as opposed to a window merely being
 * closed. Windows intercept their own 'close' event and hide instead of
 * destroying themselves (see CLAUDE.md — closing a window keeps the app
 * alive in the tray); this flag is how they know to let a *real* quit
 * (tray "Quit", Cmd+Q, before-quit) proceed instead of hiding themselves.
 */
let quitting = false

export function isQuitting(): boolean {
  return quitting
}

export function setQuitting(value: boolean): void {
  quitting = value
}
