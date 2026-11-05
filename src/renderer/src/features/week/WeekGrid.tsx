import { useMemo, useState } from 'react'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { toDayKey, todayKey } from '@shared/date'
import type { Task } from '@shared/types'
import { useTasksStore } from '../../store/tasksStore'
import { TaskEditor } from '../tasks/TaskEditor'
import { DayColumn } from './DayColumn'
import { TaskCardPreview } from './TaskCardPreview'
import { computeDropPlacement } from './dragPlacement'
import './WeekGrid.css'

// Omit<TaskEditorProps, 'onClose'> would collapse the discriminated union
// (Omit isn't distributive), so the two branches are spelled out directly.
type EditorState = { mode: 'create'; dayKey: string } | { mode: 'edit'; task: Task } | null

type WeekGridProps = {
  weekDays: Date[]
  onSelectDay: (date: Date) => void
}

export function WeekGrid({ weekDays, onSelectDay }: WeekGridProps) {
  const tasks = useTasksStore((state) => state.tasks)
  const [editorState, setEditorState] = useState<EditorState>(null)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const today = todayKey()

  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>()
    for (const task of tasks) {
      const bucket = map.get(task.dayKey)
      if (bucket) {
        bucket.push(task)
      } else {
        map.set(task.dayKey, [task])
      }
    }
    return map
  }, [tasks])

  const activeTask = activeTaskId ? (tasks.find((task) => task.id === activeTaskId) ?? null) : null

  function handleDragStart(event: DragStartEvent): void {
    setActiveTaskId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent): void {
    setActiveTaskId(null)
    const { active, over } = event
    if (!over) return

    // Decide "insert before" vs "insert after" the hovered card from which
    // half of it the dragged card's center ended up over.
    const activeRect = active.rect.current.translated ?? active.rect.current.initial
    const overRect = over.rect
    const insertAfter = Boolean(
      activeRect && overRect.top + overRect.height / 2 < activeRect.top + activeRect.height / 2,
    )

    const placement = computeDropPlacement({
      tasks,
      activeId: String(active.id),
      overId: String(over.id),
      insertAfter,
    })
    if (!placement) return

    void window.api.tasks.update({
      id: String(active.id),
      patch: { dayKey: placement.dayKey, order: placement.order },
    })
  }

  // Keying the columns by the week's first day replays the fade-in
  // animation whenever the visible week changes (collapses to no motion
  // under prefers-reduced-motion via --duration-base, see tokens.css).
  const weekKey = toDayKey(weekDays[0])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTaskId(null)}
    >
      <div className="week-grid">
        <div className="week-grid__columns" key={weekKey}>
          {weekDays.map((date) => {
            const dayKey = toDayKey(date)
            return (
              <DayColumn
                key={dayKey}
                date={date}
                tasks={tasksByDay.get(dayKey) ?? []}
                isToday={dayKey === today}
                onAddTask={(day) => setEditorState({ mode: 'create', dayKey: day })}
                onEditTask={(task) => setEditorState({ mode: 'edit', task })}
                onSelectDay={onSelectDay}
              />
            )
          })}
        </div>
        {editorState && <TaskEditor {...editorState} onClose={() => setEditorState(null)} />}
      </div>
      <DragOverlay>{activeTask && <TaskCardPreview task={activeTask} />}</DragOverlay>
    </DndContext>
  )
}
