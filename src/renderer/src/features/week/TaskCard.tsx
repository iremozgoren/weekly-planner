import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '@shared/types'
import { minutesToTimeLabel } from '@shared/time'
import { useTaskSwatch } from '../../hooks/useTaskSwatch'
import { Checkbox } from '../../components/ui/Checkbox'
import { useTranslation } from '../../i18n/useTranslation'
import './TaskCard.css'

type TaskCardProps = {
  task: Task
  onEdit: () => void
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { t } = useTranslation()
  const swatch = useTaskSwatch(task.color)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : undefined,
    ...(swatch ? { background: swatch.bg, color: swatch.fg } : null),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="task-card"
      data-task-id={task.id}
      {...attributes}
      {...listeners}
    >
      <Checkbox
        checked={task.done}
        onChange={(done) => void window.api.tasks.update({ id: task.id, patch: { done } })}
        aria-label={t('task.markDone')}
      />
      <button type="button" className="task-card__title-button" onClick={onEdit}>
        {task.schedule && (
          <span className="task-card__time">{minutesToTimeLabel(task.schedule.startMinutes)}</span>
        )}
        <span
          className={task.done ? 'task-card__title task-card__title--done' : 'task-card__title'}
        >
          {task.title}
        </span>
      </button>
    </div>
  )
}
