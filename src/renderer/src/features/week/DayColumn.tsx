import { format } from 'date-fns'
import { toDayKey } from '@shared/date'
import type { Task } from '@shared/types'
import { useTranslation } from '../../i18n/useTranslation'
import { TaskCard } from './TaskCard'
import './DayColumn.css'

type DayColumnProps = {
  date: Date
  tasks: Task[]
  isToday: boolean
}

export function DayColumn({ date, tasks, isToday }: DayColumnProps) {
  const { t } = useTranslation()
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order)

  return (
    <div className="day-column" data-today={isToday || undefined} data-day-key={toDayKey(date)}>
      <div className="day-column__header">
        <span className="day-column__weekday">{format(date, 'EEE')}</span>
        <span className="day-column__date">{format(date, 'd')}</span>
      </div>
      <div className="day-column__tasks">
        {sortedTasks.length === 0 ? (
          <p className="day-column__empty">{t('week.noTasks')}</p>
        ) : (
          sortedTasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  )
}
