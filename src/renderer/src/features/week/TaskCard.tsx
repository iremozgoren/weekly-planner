import { LABEL_SWATCHES } from '@shared/labels'
import type { Task } from '@shared/types'
import './TaskCard.css'

type TaskCardProps = {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  // Only the light swatch is used for now — proper light/dark swatch
  // switching lands with the theme system (step 6).
  const swatch = task.color ? LABEL_SWATCHES.light[task.color] : null

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
