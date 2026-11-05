import { app } from 'electron'

/**
 * Always reads the real OS value instead of trusting settings.json — the
 * user can revoke "launch at login" from the OS directly without this app
 * ever running to notice (see CLAUDE.md § Platform specifics).
 */
export function getLaunchAtLoginStatus(): boolean {
  return app.getLoginItemSettings().openAtLogin
}

/** Sets the OS-level login item and returns the confirmed resulting state. */
export function setLaunchAtLoginStatus(enabled: boolean): boolean {
  app.setLoginItemSettings({ openAtLogin: enabled })
  return getLaunchAtLoginStatus()
}
