import { useMemo, useState } from 'react'
import { getWeekDays, goToNextWeek, goToPreviousWeek, toDayKey, todayKey } from '@shared/date'
import type { Task } from '@shared/types'
import { useTasksStore } from '../../store/tasksStore'
import { TaskEditor } from '../tasks/TaskEditor'
import { DayColumn } from './DayColumn'
import { WeekNavigator } from './WeekNavigator'
import './WeekGrid.css'

// Omit<TaskEditorProps, 'onClose'> would collapse the discriminated union
// (Omit isn't distributive), so the two branches are spelled out directly.
type EditorState = { mode: 'create'; dayKey: string } | { mode: 'edit'; task: Task } | null

export function WeekGrid() {
  const tasks = useTasksStore((state) => state.tasks)
  const [anchorDate, setAnchorDate] = useState(() => new Date())
  const [editorState, setEditorState] = useState<EditorState>(null)

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

  return (
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
  )
}
