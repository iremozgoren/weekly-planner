import type { Task } from '@shared/types'
import { Checkbox } from '../../components/ui/Checkbox'
import { useTaskSwatch } from '../../hooks/useTaskSwatch'
import { useTranslation } from '../../i18n/useTranslation'
import './TodayList.css'

function TodayTaskRow({ task }: { task: Task }) {
  const { t } = useTranslation()
  const swatch = useTaskSwatch(task.color)

  return (
    <div className="today-row">
      <span
        className="today-row__dot"
        style={{ background: swatch?.bg ?? 'var(--color-border)' }}
      />
      <Checkbox
        checked={task.done}
        onChange={(done) => void window.api.tasks.update({ id: task.id, patch: { done } })}
        aria-label={t('task.markDone')}
      />
      <span className={task.done ? 'today-row__title today-row__title--done' : 'today-row__title'}>
        {task.title}
      </span>
    </div>
  )
}

export function TodayList({ tasks }: { tasks: Task[] }) {
  const { t } = useTranslation()

  if (tasks.length === 0) {
    return <p className="today-list__empty">{t('widget.empty')}</p>
  }

  return (
    <div className="today-list">
      {tasks.map((task) => (
        <TodayTaskRow key={task.id} task={task} />
      ))}
    </div>
  )
}
