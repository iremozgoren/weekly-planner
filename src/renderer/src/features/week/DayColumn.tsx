import { format } from 'date-fns'
import { toDayKey } from '@shared/date'
import type { Task } from '@shared/types'
import { useTranslation } from '../../i18n/useTranslation'
import { IconButton } from '../../components/ui/IconButton'
import { TaskCard } from './TaskCard'
import './DayColumn.css'

type DayColumnProps = {
  date: Date
  tasks: Task[]
  isToday: boolean
  onAddTask: (dayKey: string) => void
  onEditTask: (task: Task) => void
}

export function DayColumn({ date, tasks, isToday, onAddTask, onEditTask }: DayColumnProps) {
  const { t } = useTranslation()
  const dayKey = toDayKey(date)
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order)

  return (
    <div className="day-column" data-today={isToday || undefined} data-day-key={dayKey}>
      <div className="day-column__header">
        <span className="day-column__weekday">{format(date, 'EEE')}</span>
        <span className="day-column__date">{format(date, 'd')}</span>
      </div>
      <div className="day-column__tasks">
        {sortedTasks.length === 0 ? (
          <p className="day-column__empty">{t('week.noTasks')}</p>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={() => onEditTask(task)} />
          ))
        )}
      </div>
      <div className="day-column__footer">
        <IconButton aria-label={t('week.addTask')} onClick={() => onAddTask(dayKey)}>
          +
        </IconButton>
      </div>
    </div>
  )
}
