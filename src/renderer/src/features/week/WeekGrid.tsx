import { useMemo, useState } from 'react'
import { getWeekDays, goToNextWeek, goToPreviousWeek, toDayKey, todayKey } from '@shared/date'
import { useTasksStore } from '../../store/tasksStore'
import { DayColumn } from './DayColumn'
import { WeekNavigator } from './WeekNavigator'
import './WeekGrid.css'

export function WeekGrid() {
  const tasks = useTasksStore((state) => state.tasks)
  const [anchorDate, setAnchorDate] = useState(() => new Date())

  const weekDays = useMemo(() => getWeekDays(anchorDate), [anchorDate])
  const today = todayKey()

  const tasksByDay = useMemo(() => {
    const map = new Map<string, typeof tasks>()
    for (const task of tasks) {
      const bucket = map.get(task.dayKey)
      if (bucket) {
        bucket.push(task)
      } else {
        map.set(task.dayKey, [task])
      }
    }
    return map
  }, [tasks])

  return (
    <div className="week-grid">
      <WeekNavigator
        weekStart={weekDays[0]}
        weekEnd={weekDays[6]}
        onPrevious={() => setAnchorDate((date) => goToPreviousWeek(date))}
        onNext={() => setAnchorDate((date) => goToNextWeek(date))}
        onToday={() => setAnchorDate(new Date())}
      />
      <div className="week-grid__columns">
        {weekDays.map((date) => {
          const dayKey = toDayKey(date)
          return (
            <DayColumn
              key={dayKey}
              date={date}
              tasks={tasksByDay.get(dayKey) ?? []}
              isToday={dayKey === today}
            />
          )
        })}
      </div>
    </div>
  )
}
