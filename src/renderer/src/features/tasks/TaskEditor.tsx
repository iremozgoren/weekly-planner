import { useRef, useState, type FormEvent } from 'react'
import type { LabelColor } from '@shared/labels'
import type { Task } from '@shared/types'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { useTranslation } from '../../i18n/useTranslation'
import { LabelPicker } from './LabelPicker'
import './TaskEditor.css'

export type TaskEditorProps =
  | { mode: 'create'; dayKey: string; onClose: () => void }
  | { mode: 'edit'; task: Task; onClose: () => void }

export function TaskEditor(props: TaskEditorProps) {
  const { t } = useTranslation()
  const [title, setTitle] = useState(props.mode === 'edit' ? props.task.title : '')
  const [notes, setNotes] = useState(props.mode === 'edit' ? (props.task.notes ?? '') : '')
  const [dayKey, setDayKey] = useState(props.mode === 'edit' ? props.task.dayKey : props.dayKey)
  const [color, setColor] = useState<LabelColor | null>(
    props.mode === 'edit' ? props.task.color : null,
  )
  const [isSaving, setIsSaving] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      titleInputRef.current?.focus()
      return
    }

    setIsSaving(true)
    try {
      const patch = { title: trimmedTitle, notes: notes.trim() || null, dayKey, color }
      if (props.mode === 'edit') {
        await window.api.tasks.update({ id: props.task.id, patch })
      } else {
        await window.api.tasks.create(patch)
      }
      props.onClose()
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(): Promise<void> {
    if (props.mode !== 'edit') return
    setIsSaving(true)
    try {
      await window.api.tasks.delete(props.task.id)
      props.onClose()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal
      title={props.mode === 'edit' ? t('task.editTask') : t('task.newTask')}
      onClose={props.onClose}
    >
      <form className="task-editor" onSubmit={handleSubmit}>
        <label className="task-editor__field">
          <span>{t('task.titleLabel')}</span>
          <input
            ref={titleInputRef}
            type="text"
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={t('task.titlePlaceholder')}
          />
        </label>

        <label className="task-editor__field">
          <span>{t('task.notesLabel')}</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={t('task.notesPlaceholder')}
            rows={3}
          />
        </label>

        <label className="task-editor__field">
          <span>{t('task.dayLabel')}</span>
          <input type="date" value={dayKey} onChange={(event) => setDayKey(event.target.value)} />
        </label>

        <div className="task-editor__field">
          <span>{t('task.colorLabel')}</span>
          <LabelPicker value={color} onChange={setColor} />
        </div>

        <div className="task-editor__actions">
          {props.mode === 'edit' ? (
            <Button variant="danger" onClick={handleDelete} disabled={isSaving}>
              {t('common.delete')}
            </Button>
          ) : (
            <span />
          )}
          <div className="task-editor__actions-right">
            <Button variant="secondary" onClick={props.onClose} disabled={isSaving}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" type="submit" disabled={isSaving}>
              {t('common.save')}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
