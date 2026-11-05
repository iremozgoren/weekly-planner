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
import { toDayKey } from '@shared/date'
import type { Task } from '@shared/types'
import { useTasksStore } from '../../store/tasksStore'
import { TaskEditor } from '../tasks/TaskEditor'
import { TaskCardPreview } from '../week/TaskCardPreview'
import { UnscheduledStrip } from './UnscheduledStrip'
import { HourlyTimeline } from './HourlyTimeline'
import { computeDayDropResult } from './dragPlacement'
import { layoutTimelineBlocks } from './timelineLayout'
import './DayView.css'

type EditorState = { mode: 'create'; dayKey: string } | { mode: 'edit'; task: Task } | null

type DayViewProps = {
  date: Date
}

export function DayView({ date }: DayViewProps) {
  const tasks = useTasksStore((state) => state.tasks)
  const [editorState, setEditorState] = useState<EditorState>(null)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const dayKey = toDayKey(date)
  const dayTasks = useMemo(() => tasks.filter((task) => task.dayKey === dayKey), [tasks, dayKey])
  const unscheduledTasks = useMemo(
    () => dayTasks.filter((task) => task.schedule === null).sort((a, b) => a.order - b.order),
    [dayTasks],
  )
  const timelineBlocks = useMemo(() => layoutTimelineBlocks(dayTasks), [dayTasks])

  const activeTask = activeTaskId
    ? (dayTasks.find((task) => task.id === activeTaskId) ?? null)
    : null

  function handleDragStart(event: DragStartEvent): void {
    setActiveTaskId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent): void {
    setActiveTaskId(null)
    const { active, over } = event
    if (!over) return

    const activeRect = active.rect.current.translated ?? active.rect.current.initial
    const overRect = over.rect
    const insertAfter = Boolean(
      activeRect && overRect.top + overRect.height / 2 < activeRect.top + activeRect.height / 2,
    )

    const result = computeDayDropResult({
      tasks: dayTasks,
      activeId: String(active.id),
      overId: String(over.id),
      insertAfter,
    })
    if (!result) return

    const id = String(active.id)
    if (result.kind === 'schedule') {
      void window.api.tasks.update({
        id,
        patch: {
          schedule: { startMinutes: result.startMinutes, durationMinutes: result.durationMinutes },
        },
      })
    } else if (result.kind === 'unschedule') {
      void window.api.tasks.update({ id, patch: { schedule: null, order: result.order } })
    } else {
      void window.api.tasks.update({ id, patch: { order: result.order } })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTaskId(null)}
    >
      <div className="day-view">
        <UnscheduledStrip
          tasks={unscheduledTasks}
          onAddTask={() => setEditorState({ mode: 'create', dayKey })}
          onEditTask={(task) => setEditorState({ mode: 'edit', task })}
        />
        <HourlyTimeline
          date={date}
          blocks={timelineBlocks}
          onEditTask={(task) => setEditorState({ mode: 'edit', task })}
        />
        {editorState && <TaskEditor {...editorState} onClose={() => setEditorState(null)} />}
      </div>
      <DragOverlay>{activeTask && <TaskCardPreview task={activeTask} />}</DragOverlay>
    </DndContext>
  )
}
