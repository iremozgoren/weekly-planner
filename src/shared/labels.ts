/**
 * The fixed pastel color palette tasks can be labeled with. Defined once here
 * so the picker UI, task cards and the widget all render the same swatches,
 * and so each color stays legible with its paired foreground text in both
 * light and dark theme (see CLAUDE.md § Theming and styling).
 */
export const LABEL_COLORS = ['rose', 'peach', 'sunflower', 'mint', 'sky', 'lavender'] as const

export type LabelColor = (typeof LABEL_COLORS)[number]

export type LabelSwatch = {
  bg: string
  fg: string
}

export const LABEL_SWATCHES: Record<'light' | 'dark', Record<LabelColor, LabelSwatch>> = {
  light: {
    rose: { bg: '#ffd9e3', fg: '#7a2340' },
    peach: { bg: '#ffe0c7', fg: '#7a3b12' },
    sunflower: { bg: '#fff1b8', fg: '#6b5900' },
    mint: { bg: '#d4f3e1', fg: '#1f6b47' },
    sky: { bg: '#d6ebff', fg: '#1b4f8a' },
    lavender: { bg: '#e7ddff', fg: '#4f3a8a' },
  },
  dark: {
    rose: { bg: '#4a2430', fg: '#ffd9e3' },
    peach: { bg: '#4a3420', fg: '#ffe0c7' },
    sunflower: { bg: '#423a14', fg: '#fff1b8' },
    mint: { bg: '#1f3a2c', fg: '#d4f3e1' },
    sky: { bg: '#1f3350', fg: '#d6ebff' },
    lavender: { bg: '#332a52', fg: '#e7ddff' },
  },
}
