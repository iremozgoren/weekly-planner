import { useEffect, useMemo } from 'react'
import { todayKey } from '@shared/date'
import { useTasksStore } from '../store/tasksStore'
import { useTranslation } from '../i18n/useTranslation'
import { TodayList } from '../features/widget/TodayList'
import { ProgressRing } from '../features/widget/ProgressRing'
import './WidgetApp.css'

export function WidgetApp() {
  const { t } = useTranslation()
  const init = useTasksStore((state) => state.init)
  const tasks = useTasksStore((state) => state.tasks)

  useEffect(() => {
    void init()
  }, [init])

  const todayTasks = useMemo(() => {
    const key = todayKey()
    return tasks.filter((task) => task.dayKey === key).sort((a, b) => a.order - b.order)
  }, [tasks])

  const doneCount = todayTasks.filter((task) => task.done).length

  return (
    <div className="widget-app">
      <div className="widget-app__header">
        <span className="widget-app__title">{t('widget.title')}</span>
        <ProgressRing done={doneCount} total={todayTasks.length} />
      </div>
      <div className="widget-app__body">
        <TodayList tasks={todayTasks} />
      </div>
    </div>
  )
}
