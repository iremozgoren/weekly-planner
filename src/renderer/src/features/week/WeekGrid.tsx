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
import { getWeekDays, goToNextWeek, goToPreviousWeek, toDayKey, todayKey } from '@shared/date'
import type { Task } from '@shared/types'
import { useTasksStore } from '../../store/tasksStore'
import { TaskEditor } from '../tasks/TaskEditor'
import { DayColumn } from './DayColumn'
import { WeekNavigator } from './WeekNavigator'
import { TaskCardPreview } from './TaskCardPreview'
import { computeDropPlacement } from './dragPlacement'
import './WeekGrid.css'

// Omit<TaskEditorProps, 'onClose'> would collapse the discriminated union
// (Omit isn't distributive), so the two branches are spelled out directly.
type EditorState = { mode: 'create'; dayKey: string } | { mode: 'edit'; task: Task } | null

export function WeekGrid() {
  const tasks = useTasksStore((state) => state.tasks)
  const [anchorDate, setAnchorDate] = useState(() => new Date())
  const [editorState, setEditorState] = useState<EditorState>(null)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const weekDays = useMemo(() => getWeekDays(anchorDate), [anchorDate])
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTaskId(null)}
    >
      <div className="week-grid">
        <WeekNavigator
          weekStart={weekDays[0]}
          weekEnd={weekDays[6]}
          onPrevious={() => setAnchorDate((date) => goToPreviousWeek(date))}
          onNext={() => setAnchorDate((date) => goToNextWeek(date))}
          onToday={() => setAnchorDate(new Date())}
        />
        <div className="week-grid__columns">
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
