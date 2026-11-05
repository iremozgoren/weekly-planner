import { t } from './index'

/**
 * `const { t } = useTranslation()` everywhere a component needs a string —
 * no component may hardcode user-facing text (see CLAUDE.md § i18n).
 *
 * Not yet reactive to a locale change: locale switching lands in the
 * settings step, at which point this becomes a context consumer so
 * components re-render when the locale changes.
 */
export function useTranslation(): { t: typeof t } {
  return { t }
}
