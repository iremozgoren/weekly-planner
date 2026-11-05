import { nowMinutes, minutesToTimeLabel } from '@shared/time'
import type { Task } from '@shared/types'
import { Checkbox } from '../../components/ui/Checkbox'
import { useTaskSwatch } from '../../hooks/useTaskSwatch'
import { useTranslation } from '../../i18n/useTranslation'
import './TodayList.css'

type TodayTaskRowProps = {
  task: Task
  highlight: 'now' | 'next' | null
}

function TodayTaskRow({ task, highlight }: TodayTaskRowProps) {
  const { t } = useTranslation()
  const swatch = useTaskSwatch(task.color)

  return (
    <div className="today-row" data-highlight={highlight ?? undefined}>
      <span
        className="today-row__dot"
        style={{ background: swatch?.bg ?? 'var(--color-border)' }}
      />
      <Checkbox
        checked={task.done}
        onChange={(done) => void window.api.tasks.update({ id: task.id, patch: { done } })}
        aria-label={t('task.markDone')}
      />
      {task.schedule && (
        <span className="today-row__time">{minutesToTimeLabel(task.schedule.startMinutes)}</span>
      )}
      <span className={task.done ? 'today-row__title today-row__title--done' : 'today-row__title'}>
        {task.title}
      </span>
      {highlight && (
        <span className="today-row__sr-only">
          {highlight === 'now' ? t('task.happeningNow') : t('task.upNext')}
        </span>
      )}
    </div>
  )
}

type TodayListProps = {
  tasks: Task[]
  highlightedTaskId: string | null
}

export function TodayList({ tasks, highlightedTaskId }: TodayListProps) {
  const { t } = useTranslation()

  if (tasks.length === 0) {
    return <p className="today-list__empty">{t('widget.empty')}</p>
  }

  const now = nowMinutes()

  return (
    <div className="today-list">
      {tasks.map((task) => {
        let highlight: 'now' | 'next' | null = null
        if (task.id === highlightedTaskId && task.schedule) {
          highlight = now >= task.schedule.startMinutes ? 'now' : 'next'
        }
        return <TodayTaskRow key={task.id} task={task} highlight={highlight} />
      })}
    </div>
  )
}
