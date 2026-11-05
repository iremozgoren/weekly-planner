import { useEffect, useState } from 'react'
import { Checkbox } from '../../components/ui/Checkbox'
import { useTranslation } from '../../i18n/useTranslation'
import './SettingsPanel.css'

export function SettingsPanel() {
  const { t } = useTranslation()
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
