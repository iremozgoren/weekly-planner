import { LABEL_COLORS, type LabelColor } from '@shared/labels'
import { ColorDot } from '../../components/ui/ColorDot'
import { useTranslation } from '../../i18n/useTranslation'
import './LabelPicker.css'

type LabelPickerProps = {
  value: LabelColor | null
  onChange: (color: LabelColor | null) => void
}

export function LabelPicker({ value, onChange }: LabelPickerProps) {
  const { t } = useTranslation()

  return (
    <div className="label-picker">
      <ColorDot
        color={null}
        selected={value === null}
        onClick={() => onChange(null)}
        aria-label={t('common.none')}
      />
      {LABEL_COLORS.map((color) => (
        <ColorDot
          key={color}
          color={color}
          selected={value === color}
          onClick={() => onChange(color)}
          aria-label={color}
        />
      ))}
    </div>
  )
}
