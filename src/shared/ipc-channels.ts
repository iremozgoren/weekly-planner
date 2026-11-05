/**
 * Every IPC channel name used by the app, in one place. Neither side of the
 * bridge may use a string literal for a channel name — always go through
 * this object (see CLAUDE.md § Process boundaries).
 */
export const IpcChannels = {
  tasksList: 'tasks:list',
  /** Broadcast from main to every window whenever the task list changes. */
  tasksChanged: 'tasks:changed',
  taskCreate: 'task:create',
  taskUpdate: 'task:update',
  taskDelete: 'task:delete',

  settingsGet: 'settings:get',
  settingsUpdate: 'settings:update',
  /** Broadcast from main to every window whenever settings change. */
  settingsChanged: 'settings:changed',

  /** Always reads the real OS value (app.getLoginItemSettings()) — never trust the cached setting. */
  launchAtLoginGet: 'launch-at-login:get',
  launchAtLoginSet: 'launch-at-login:set',

  settingsWindowOpen: 'settings-window:open',
} as const

export type IpcChannelName = (typeof IpcChannels)[keyof typeof IpcChannels]
