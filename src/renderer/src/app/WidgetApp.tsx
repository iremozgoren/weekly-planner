import { useEffect, useMemo } from 'react'
import { todayKey } from '@shared/date'
import { nowMinutes } from '@shared/time'
import { useTasksStore } from '../store/tasksStore'
import { useSettingsStore } from '../store/settingsStore'
import { useTranslation } from '../i18n/useTranslation'
import { TodayList } from '../features/widget/TodayList'
import { ProgressRing } from '../features/widget/ProgressRing'
import { IconButton } from '../components/ui/IconButton'
import './WidgetApp.css'

export function WidgetApp() {
  const { t } = useTranslation()
  const initTasks = useTasksStore((state) => state.init)
  const tasks = useTasksStore((state) => state.tasks)
  const initSettings = useSettingsStore((state) => state.init)
  const widgetSettings = useSettingsStore((state) => state.settings.widget)

  useEffect(() => {
    void initTasks()
    void initSettings()
  }, [initTasks, initSettings])

  // Timed tasks lead the list in chronological order; untimed ones follow
  // in their existing order — so "what's next" is always visible first.
  const todayTasks = useMemo(() => {
    const key = todayKey()
    return tasks
      .filter((task) => task.dayKey === key)
      .sort((a, b) => {
        const startA = a.schedule?.startMinutes ?? Infinity
        const startB = b.schedule?.startMinutes ?? Infinity
        return startA - startB || a.order - b.order
      })
  }, [tasks])

  const doneCount = todayTasks.filter((task) => task.done).length

  // The one task to call out: whichever timed, not-done task is happening
  // right now, or failing that, the next one coming up.
  const highlightedTaskId = useMemo(() => {
    const now = nowMinutes()
    const timed = todayTasks.filter((task) => task.schedule !== null && !task.done)
    const current = timed.find((task) => {
      const schedule = task.schedule
      return (
        schedule &&
        now >= schedule.startMinutes &&
        now < schedule.startMinutes + schedule.durationMinutes
      )
    })
    if (current) return current.id
    const next = timed.find((task) => (task.schedule?.startMinutes ?? -1) > now)
    return next?.id ?? null
  }, [todayTasks])

  function setCollapsed(collapsed: boolean): void {
    void window.api.settings.update({ widget: { ...widgetSettings, collapsed } })
  }

  if (widgetSettings.collapsed) {
    return (
      <div className="widget-app widget-app--collapsed">
        {/* The only drag region on the pill — Electron's -webkit-app-region:
            drag swallows clicks at the native OS level, even a plain click
            with no movement, so the clickable label below must opt out of
            it rather than share it (see CLAUDE.md § Theming and styling). */}
        <span className="widget-app__grip" aria-hidden="true">
          ⋮⋮
        </span>
        <button
          type="button"
          className="widget-app__collapsed-label"
          onClick={() => setCollapsed(false)}
          onDoubleClick={() => setCollapsed(false)}
          aria-label={t('widget.expand')}
        >
          {t('widget.title')}
        </button>
      </div>
    )
  }

  return (
    <div className="widget-app">
      <div className="widget-app__header">
        <span className="widget-app__title">{t('widget.title')}</span>
        <div className="widget-app__header-right">
          <ProgressRing done={doneCount} total={todayTasks.length} />
          <IconButton
            className="widget-app__collapse-button"
            aria-label={t('widget.collapse')}
            onClick={() => setCollapsed(true)}
          >
            –
          </IconButton>
        </div>
      </div>
      <div className="widget-app__body">
        <TodayList tasks={todayTasks} highlightedTaskId={highlightedTaskId} />
      </div>
    </div>
  )
}
