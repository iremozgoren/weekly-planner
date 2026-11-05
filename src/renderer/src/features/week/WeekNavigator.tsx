import { format } from 'date-fns'
import { useTranslation } from '../../i18n/useTranslation'
import './WeekNavigator.css'

type WeekNavigatorProps = {
  weekStart: Date
  weekEnd: Date
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
}

export function WeekNavigator({
  weekStart,
  weekEnd,
  onPrevious,
  onNext,
  onToday,
}: WeekNavigatorProps) {
  const { t, dateLocale } = useTranslation()
  const sameMonth = weekStart.getMonth() === weekEnd.getMonth()
  const rangeLabel = sameMonth
    ? `${format(weekStart, 'MMM d', { locale: dateLocale })} – ${format(weekEnd, 'd, yyyy', { locale: dateLocale })}`
    : `${format(weekStart, 'MMM d', { locale: dateLocale })} – ${format(weekEnd, 'MMM d, yyyy', { locale: dateLocale })}`

  return (
    <div className="week-navigator">
      <button
        type="button"
        className="week-navigator__arrow"
        onClick={onPrevious}
        aria-label={t('week.previousWeek')}
      >
        ‹
      </button>
      <span className="week-navigator__range">{rangeLabel}</span>
      <button
        type="button"
        className="week-navigator__arrow"
        onClick={onNext}
        aria-label={t('week.nextWeek')}
      >
        ›
      </button>
      <button type="button" className="week-navigator__today" onClick={onToday}>
        {t('common.today')}
      </button>
    </div>
  )
}
