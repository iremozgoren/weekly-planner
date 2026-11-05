import { LABEL_SWATCHES } from '@shared/labels'
import type { Task } from '@shared/types'
import { useIsDarkMode } from '../../hooks/useIsDarkMode'
import './TaskCard.css'

type TaskCardProps = {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const isDark = useIsDarkMode()
  const swatch = task.color ? LABEL_SWATCHES[isDark ? 'dark' : 'light'][task.color] : null

  return (
    <div
      className="task-card"
      style={swatch ? { background: swatch.bg, color: swatch.fg } : undefined}
    >
      <span className={task.done ? 'task-card__title task-card__title--done' : 'task-card__title'}>
        {task.title}
      </span>
    </div>
  )
}
