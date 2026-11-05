import { useEffect, useMemo } from 'react'
import { todayKey } from '@shared/date'
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

  const todayTasks = useMemo(() => {
    const key = todayKey()
    return tasks.filter((task) => task.dayKey === key).sort((a, b) => a.order - b.order)
  }, [tasks])

  const doneCount = todayTasks.filter((task) => task.done).length

  function setCollapsed(collapsed: boolean): void {
    void window.api.settings.update({ widget: { ...widgetSettings, collapsed } })
  }

  if (widgetSettings.collapsed) {
    return (
      <button
        type="button"
        className="widget-app widget-app--collapsed"
        onClick={() => setCollapsed(false)}
        aria-label={t('widget.expand')}
      >
        {t('widget.title')}
      </button>
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
        <TodayList tasks={todayTasks} />
      </div>
    </div>
  )
}
