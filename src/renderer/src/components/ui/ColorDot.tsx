import { LABEL_SWATCHES, type LabelColor } from '@shared/labels'
import { useIsDarkMode } from '../../hooks/useIsDarkMode'
import './ColorDot.css'

type ColorDotProps = {
  color: LabelColor | null
  selected: boolean
  onClick: () => void
  'aria-label': string
}

export function ColorDot({ color, selected, onClick, ...rest }: ColorDotProps) {
  const isDark = useIsDarkMode()
  const bg = color ? LABEL_SWATCHES[isDark ? 'dark' : 'light'][color].bg : 'transparent'

  return (
    <button
      type="button"
      className={selected ? 'color-dot color-dot--selected' : 'color-dot'}
      style={{ background: bg }}
      onClick={onClick}
      {...rest}
    />
  )
}
