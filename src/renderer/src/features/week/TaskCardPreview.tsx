import type { Task } from '@shared/types'
import { useTaskSwatch } from '../../hooks/useTaskSwatch'
import './TaskCard.css'

/**
 * A static, non-interactive replica of TaskCard, used only inside
 * `<DragOverlay>` — the overlay renders a copy that follows the pointer
 * while the real card (still mounted, dimmed via `isDragging`) stays put
 * until the drop actually commits a new position.
 */
export function TaskCardPreview({ task }: { task: Task }) {
  const swatch = useTaskSwatch(task.color)
  const style = swatch ? { background: swatch.bg, color: swatch.fg } : undefined

  return (
    <div className="task-card task-card--overlay" style={style}>
      <span className={task.done ? 'task-card__title task-card__title--done' : 'task-card__title'}>
        {task.title}
      </span>
    </div>
  )
}
