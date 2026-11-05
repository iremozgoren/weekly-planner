import { format } from 'date-fns'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { toDayKey } from '@shared/date'
import type { Task } from '@shared/types'
import { useTranslation } from '../../i18n/useTranslation'
import { TaskCard } from './TaskCard'
import './DayColumn.css'

type DayColumnProps = {
  date: Date
  tasks: Task[]
  isToday: boolean
  onAddTask: (dayKey: string) => void
  onEditTask: (task: Task) => void
  onSelectDay: (date: Date) => void
}

/** The droppable id prefix for a day column, as opposed to a specific task card's id. */
export const DAY_DROPPABLE_PREFIX = 'day:'

export function DayColumn({
  date,
  tasks,
  isToday,
  onAddTask,
  onEditTask,
  onSelectDay,
}: DayColumnProps) {
  const { t, dateLocale } = useTranslation()
  const dayKey = toDayKey(date)
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order)
  const { setNodeRef } = useDroppable({ id: `${DAY_DROPPABLE_PREFIX}${dayKey}` })
  const isEmpty = sortedTasks.length === 0

  return (
    <div className="day-column" data-today={isToday || undefined} data-day-key={dayKey}>
      <button type="button" className="day-column__header" onClick={() => onSelectDay(date)}>
        <span className="day-column__weekday">{format(date, 'EEE', { locale: dateLocale })}</span>
        <span className="day-column__date">{format(date, 'd', { locale: dateLocale })}</span>
      </button>
      <SortableContext
        items={sortedTasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="day-column__tasks" data-empty={isEmpty || undefined} ref={setNodeRef}>
          {isEmpty ? (
            <button
              type="button"
              className="day-column__empty-add"
              onClick={() => onAddTask(dayKey)}
            >
              <span className="day-column__empty-add-icon">+</span>
              <span>{t('week.addTask')}</span>
            </button>
          ) : (
            <>
              {sortedTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={() => onEditTask(task)} />
              ))}
              <button
                type="button"
                className="day-column__add-row"
                onClick={() => onAddTask(dayKey)}
              >
                <span className="day-column__add-row-icon">+</span>
                {t('week.addTask')}
              </button>
            </>
          )}
        </div>
      </SortableContext>
    </div>
  )
}
