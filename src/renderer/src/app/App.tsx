import { useEffect, useMemo, useState } from 'react'
import { addDays } from 'date-fns'
import { getWeekDays, goToNextWeek, goToPreviousWeek } from '@shared/date'
import { WeekGrid } from '../features/week/WeekGrid'
import { WeekNavigator } from '../features/week/WeekNavigator'
import { DayView } from '../features/day/DayView'
import { DayNavigator } from '../features/day/DayNavigator'
import { useTasksStore } from '../store/tasksStore'
import { useTranslation } from '../i18n/useTranslation'
import { IconButton } from '../components/ui/IconButton'
import { SegmentedControl } from '../components/ui/SegmentedControl'

type ViewMode = 'week' | 'day'

export function App() {
  const { t } = useTranslation()
  const init = useTasksStore((state) => state.init)
  const isLoading = useTasksStore((state) => state.isLoading)
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [selectedDate, setSelectedDate] = useState(() => new Date())

  useEffect(() => {
    void init()
  }, [init])

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate])

  function handleSelectDay(date: Date): void {
    setSelectedDate(date)
    setViewMode('day')
  }

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <h1 className="app-shell__title">{t('common.appName')}</h1>
        <div className="app-shell__header-center">
          {viewMode === 'week' ? (
            <WeekNavigator
              weekStart={weekDays[0]}
              weekEnd={weekDays[6]}
              onPrevious={() => setSelectedDate((date) => goToPreviousWeek(date))}
              onNext={() => setSelectedDate((date) => goToNextWeek(date))}
              onToday={() => setSelectedDate(new Date())}
            />
          ) : (
            <DayNavigator
              date={selectedDate}
              onPrevious={() => setSelectedDate((date) => addDays(date, -1))}
              onNext={() => setSelectedDate((date) => addDays(date, 1))}
              onToday={() => setSelectedDate(new Date())}
            />
          )}
        </div>
        <div className="app-shell__header-right">
          <SegmentedControl
            value={viewMode}
            options={[
              { value: 'week', label: t('view.week') },
              { value: 'day', label: t('view.day') },
            ]}
            onChange={setViewMode}
            aria-label={t('view.week')}
          />
          <IconButton
            aria-label={t('settings.title')}
            onClick={() => void window.api.openSettingsWindow()}
          >
            ⚙
          </IconButton>
        </div>
      </header>
      {isLoading ? (
        <p className="app-shell__loading">{t('common.loading')}</p>
      ) : viewMode === 'week' ? (
        <WeekGrid weekDays={weekDays} onSelectDay={handleSelectDay} />
      ) : (
        <DayView date={selectedDate} />
      )}
    </div>
  )
}
