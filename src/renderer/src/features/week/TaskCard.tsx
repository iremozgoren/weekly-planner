import { LABEL_SWATCHES } from '@shared/labels'
import type { Task } from '@shared/types'
import { useIsDarkMode } from '../../hooks/useIsDarkMode'
import { Checkbox } from '../../components/ui/Checkbox'
import { useTranslation } from '../../i18n/useTranslation'
import './TaskCard.css'

type TaskCardProps = {
  task: Task
  onEdit: () => void
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { t } = useTranslation()
  const isDark = useIsDarkMode()
  const swatch = task.color ? LABEL_SWATCHES[isDark ? 'dark' : 'light'][task.color] : null

  return (
    <div
      className="task-card"
      style={swatch ? { background: swatch.bg, color: swatch.fg } : undefined}
    >
      <Checkbox
        checked={task.done}
        onChange={(done) => void window.api.tasks.update({ id: task.id, patch: { done } })}
        aria-label={t('task.markDone')}
      />
      <button type="button" className="task-card__title-button" onClick={onEdit}>
        <span
          className={task.done ? 'task-card__title task-card__title--done' : 'task-card__title'}
        >
          {task.title}
        </span>
      </button>
    </div>
  )
}
