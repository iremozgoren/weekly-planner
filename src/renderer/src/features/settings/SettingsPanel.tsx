import { useEffect, useState } from 'react'
import type { Locale } from '@shared/locales'
import { Checkbox } from '../../components/ui/Checkbox'
import { useTranslation } from '../../i18n/useTranslation'
import './SettingsPanel.css'

// Language names are shown as endonyms (each language's own name for
// itself), not translated — a standard convention so a user can always
// find their language regardless of the UI's current locale.
const LANGUAGE_LABELS: Record<Locale, string> = { en: 'English', tr: 'Türkçe' }
const LANGUAGES: Locale[] = ['en', 'tr']

export function SettingsPanel() {
  const { t, locale } = useTranslation()
  const [launchAtLogin, setLaunchAtLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    void window.api.settings.getLaunchAtLogin().then((value) => {
      setLaunchAtLogin(value)
      setIsLoading(false)
    })
  }, [])

  async function handleToggle(value: boolean): Promise<void> {
    // Optimistic; corrected below by whatever the OS actually confirms.
    setLaunchAtLogin(value)
    const confirmed = await window.api.settings.setLaunchAtLogin(value)
    setLaunchAtLogin(confirmed)
  }

  return (
    <div className="settings-panel">
      <h1 className="settings-panel__title">{t('settings.title')}</h1>

      <div className="settings-panel__row">
        <div className="settings-panel__row-text">
          <span className="settings-panel__row-label">{t('settings.language')}</span>
        </div>
        <div
          className="settings-panel__segmented"
          role="radiogroup"
          aria-label={t('settings.language')}
        >
          {LANGUAGES.map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={locale === option}
              className="settings-panel__segment"
              data-active={locale === option || undefined}
              onClick={() => void window.api.settings.update({ locale: option })}
            >
              {LANGUAGE_LABELS[option]}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-panel__row">
        <div className="settings-panel__row-text">
          <span className="settings-panel__row-label">{t('settings.launchAtLogin')}</span>
          <span className="settings-panel__row-description">
            {t('settings.launchAtLoginDescription')}
          </span>
        </div>
        <Checkbox
          checked={launchAtLogin}
          onChange={(value) => void handleToggle(value)}
          disabled={isLoading}
          aria-label={t('settings.launchAtLogin')}
        />
      </div>
    </div>
  )
}
