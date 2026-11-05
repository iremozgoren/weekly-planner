import { useEffect, useRef, useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { toDayKey, todayKey } from '@shared/date'
import { minutesToTimeLabel, nowMinutes } from '@shared/time'
import type { Task } from '@shared/types'
import { HOUR_DROPPABLE_PREFIX } from './dragPlacement'
import type { TimelineBlock } from './timelineLayout'
import { TimelineTaskBlock } from './TimelineTaskBlock'
import './HourlyTimeline.css'

const ROW_HEIGHT = 56
const HOURS = Array.from({ length: 24 }, (_, i) => i)
const WORKING_START_MINUTES = 7 * 60
const WORKING_END_MINUTES = 23 * 60

type HourlyTimelineProps = {
  date: Date
  blocks: TimelineBlock[]
  onEditTask: (task: Task) => void
}

export function HourlyTimeline({ date, blocks, onEditTask }: HourlyTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dayKey = toDayKey(date)
  const isToday = dayKey === todayKey()
  const [currentMinutes, setCurrentMinutes] = useState(() => nowMinutes())

  // Keep the "now" line accurate without needing second-level precision.
  useEffect(() => {
    if (!isToday) return undefined
    const interval = setInterval(() => setCurrentMinutes(nowMinutes()), 60_000)
    return () => clearInterval(interval)
  }, [isToday])

  // Scroll to the current time on open (today, within working hours),
  // otherwise to 07:00 — only when the viewed day changes, not every
  // "now" tick, so we never yank the user's own scroll position away.
  useEffect(() => {
    if (!containerRef.current) return
    const target =
      isToday && currentMinutes >= WORKING_START_MINUTES && currentMinutes <= WORKING_END_MINUTES
        ? currentMinutes
        : WORKING_START_MINUTES
    containerRef.current.scrollTop = (target / 60) * ROW_HEIGHT
    // Deliberately only re-running when the day changes — see comment above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayKey])

  return (
    <div className="hourly-timeline" ref={containerRef}>
      <div className="hourly-timeline__inner" style={{ height: HOURS.length * ROW_HEIGHT }}>
        {HOURS.map((hour) => (
          <HourRow key={hour} hour={hour} />
        ))}
        {isToday && <NowLine minutes={currentMinutes} />}
        {blocks.map((block) => (
          <TimelineTaskBlock
            key={block.task.id}
            block={block}
            rowHeight={ROW_HEIGHT}
            onEdit={() => onEditTask(block.task)}
          />
        ))}
      </div>
    </div>
  )
}

function HourRow({ hour }: { hour: number }) {
  const { setNodeRef, isOver } = useDroppable({ id: `${HOUR_DROPPABLE_PREFIX}${hour * 60}` })
  return (
    <div
      className="hour-row"
      style={{ height: ROW_HEIGHT }}
      data-over={isOver || undefined}
      ref={setNodeRef}
    >
      <span className="hour-row__label">{minutesToTimeLabel(hour * 60)}</span>
      <div className="hour-row__track" />
    </div>
  )
}

function NowLine({ minutes }: { minutes: number }) {
  return <div className="now-line" style={{ top: (minutes / 60) * ROW_HEIGHT }} />
}
