import { useEffect, useMemo, useState } from 'react'
import { getWeekDays, goToNextWeek, goToPreviousWeek } from '@shared/date'
import { WeekGrid } from '../features/week/WeekGrid'
import { WeekNavigator } from '../features/week/WeekNavigator'
import { useTasksStore } from '../store/tasksStore'
import { useTranslation } from '../i18n/useTranslation'
import { IconButton } from '../components/ui/IconButton'

export function App() {
  const { t } = useTranslation()
  const init = useTasksStore((state) => state.init)
  const isLoading = useTasksStore((state) => state.isLoading)
  const [anchorDate, setAnchorDate] = useState(() => new Date())

  useEffect(() => {
    void init()
  }, [init])

  const weekDays = useMemo(() => getWeekDays(anchorDate), [anchorDate])

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <h1 className="app-shell__title">{t('common.appName')}</h1>
        <div className="app-shell__header-center">
          <WeekNavigator
            weekStart={weekDays[0]}
            weekEnd={weekDays[6]}
            onPrevious={() => setAnchorDate((date) => goToPreviousWeek(date))}
            onNext={() => setAnchorDate((date) => goToNextWeek(date))}
            onToday={() => setAnchorDate(new Date())}
          />
        </div>
        <IconButton
          aria-label={t('settings.title')}
          onClick={() => void window.api.openSettingsWindow()}
        >
          ⚙
        </IconButton>
      </header>
      {isLoading ? (
        <p className="app-shell__loading">{t('common.loading')}</p>
      ) : (
        <WeekGrid weekDays={weekDays} />
      )}
    </div>
  )
}
