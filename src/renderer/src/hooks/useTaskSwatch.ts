import { LABEL_SWATCHES, type LabelColor } from '@shared/labels'
import { useIsDarkMode } from './useIsDarkMode'

/** The light/dark-appropriate swatch for a task's color, or null for an uncolored task. */
export function useTaskSwatch(color: LabelColor | null) {
  const isDark = useIsDarkMode()
  return color ? LABEL_SWATCHES[isDark ? 'dark' : 'light'][color] : null
}
