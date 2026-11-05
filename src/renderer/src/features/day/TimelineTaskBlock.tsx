import type { CSSProperties } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { minutesToTimeLabel } from '@shared/time'
import { useTaskSwatch } from '../../hooks/useTaskSwatch'
import type { TimelineBlock } from './timelineLayout'
import './TimelineTaskBlock.css'

const MIN_BLOCK_HEIGHT = 30

type TimelineTaskBlockProps = {
  block: TimelineBlock
  rowHeight: number
  onEdit: () => void
}

export function TimelineTaskBlock({ block, rowHeight, onEdit }: TimelineTaskBlockProps) {
  const swatch = useTaskSwatch(block.task.color)
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: block.task.id,
  })

  const widthPercent = 100 / block.columnCount
  const leftPercent = widthPercent * block.column

  const style: CSSProperties = {
    top: (block.startMinutes / 60) * rowHeight,
    height: Math.max((block.durationMinutes / 60) * rowHeight, MIN_BLOCK_HEIGHT),
    left: `calc(${leftPercent}% + 2px)`,
    width: `calc(${widthPercent}% - 4px)`,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.4 : undefined,
    zIndex: isDragging ? 10 : undefined,
    ...(swatch ? { background: swatch.bg, color: swatch.fg } : null),
  }

  return (
    <button
      ref={setNodeRef}
      type="button"
      className="timeline-block"
      style={style}
      onClick={onEdit}
      {...attributes}
      {...listeners}
    >
      <span className="timeline-block__time">{minutesToTimeLabel(block.startMinutes)}</span>
      <span
        className={
          block.task.done
            ? 'timeline-block__title timeline-block__title--done'
            : 'timeline-block__title'
        }
      >
        {block.task.title}
      </span>
    </button>
  )
}
