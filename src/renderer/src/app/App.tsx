import { useEffect } from 'react'
import { WeekGrid } from '../features/week/WeekGrid'
import { useTasksStore } from '../store/tasksStore'
import { useTranslation } from '../i18n/useTranslation'

export function App() {
  const { t } = useTranslation()
  const init = useTasksStore((state) => state.init)
  const isLoading = useTasksStore((state) => state.isLoading)

  useEffect(() => {
    void init()
  }, [init])

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <h1>{t('common.appName')}</h1>
      </header>
      {isLoading ? <p className="app-shell__loading">{t('common.loading')}</p> : <WeekGrid />}
    </div>
  )
}
