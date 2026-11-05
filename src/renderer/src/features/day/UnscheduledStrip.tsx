import { useDroppable } from '@dnd-kit/core'
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import type { Task } from '@shared/types'
import { useTranslation } from '../../i18n/useTranslation'
import { TaskCard } from '../week/TaskCard'
import { UNSCHEDULED_DROPPABLE_ID } from './dragPlacement'
import './UnscheduledStrip.css'

type UnscheduledStripProps = {
  tasks: Task[]
  onAddTask: () => void
  onEditTask: (task: Task) => void
}

export function UnscheduledStrip({ tasks, onAddTask, onEditTask }: UnscheduledStripProps) {
  const { t } = useTranslation()
  const { setNodeRef } = useDroppable({ id: UNSCHEDULED_DROPPABLE_ID })

  return (
    <div className="unscheduled-strip">
      <h2 className="unscheduled-strip__label">{t('day.unscheduled')}</h2>
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="unscheduled-strip__row" ref={setNodeRef}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={() => onEditTask(task)} />
          ))}
          <button type="button" className="unscheduled-strip__add" onClick={onAddTask}>
            <span>+</span> {t('week.addTask')}
          </button>
        </div>
      </SortableContext>
    </div>
  )
}
