import { format } from 'date-fns'
import { useTranslation } from '../../i18n/useTranslation'
// Reuses WeekNavigator's classes — same "‹ label › Today" shape, just a
// different granularity, not worth duplicating the CSS for.
import '../week/WeekNavigator.css'

type DayNavigatorProps = {
  date: Date
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
}

export function DayNavigator({ date, onPrevious, onNext, onToday }: DayNavigatorProps) {
  const { t, dateLocale } = useTranslation()
  const label = format(date, 'EEEE, MMM d', { locale: dateLocale })

  return (
    <div className="week-navigator">
      <button
        type="button"
        className="week-navigator__arrow"
        onClick={onPrevious}
        aria-label={t('day.previousDay')}
      >
        ‹
      </button>
      <span className="week-navigator__range">{label}</span>
      <button
        type="button"
        className="week-navigator__arrow"
        onClick={onNext}
        aria-label={t('day.nextDay')}
      >
        ›
      </button>
      <button type="button" className="week-navigator__today" onClick={onToday}>
        {t('common.today')}
      </button>
    </div>
  )
}
