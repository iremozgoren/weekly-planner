import { useEffect, useState } from 'react'

const DARK_QUERY = '(prefers-color-scheme: dark)'

/**
 * Tracks the OS color scheme reactively. A stand-in until the full theme
 * system (step 6) lands with a `theme: 'light' | 'dark' | 'system'` setting
 * and a `[data-theme]` attribute — at that point this only needs to back the
 * `'system'` case, driven by `nativeTheme` instead of `matchMedia` so main
 * and every renderer agree on the same value.
 */
export function useIsDarkMode(): boolean {
  const [isDark, setIsDark] = useState(() => window.matchMedia(DARK_QUERY).matches)

  useEffect(() => {
    const query = window.matchMedia(DARK_QUERY)
    const listener = (event: MediaQueryListEvent): void => setIsDark(event.matches)
    query.addEventListener('change', listener)
    return () => query.removeEventListener('change', listener)
  }, [])

  return isDark
}
