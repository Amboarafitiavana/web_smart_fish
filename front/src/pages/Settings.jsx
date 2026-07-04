import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiSun, FiMoon, FiBell, FiCpu } from 'react-icons/fi'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { AVAILABLE_LANGUAGES } from '../i18n/translations'
import { Toggle, Select, Label } from '../components/ui/Field'
import Button from '../components/ui/Button'

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const [notifications, setNotifications] = useState({ critical: true, caution: true, healthy: false, weeklyDigest: true })
  const [units, setUnits] = useState('metric')

  const toggleNotif = (key) => setNotifications((n) => ({ ...n, [key]: !n[key] }))

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-xl font-semibold text-abyss-900 dark:text-mist-50">{t('settings.title')}</h1>
        <p className="mt-1 text-sm text-abyss-500 dark:text-mist-200/50">{t('settings.subtitle')}</p>
      </div>

      <section className="panel p-6">
        <h2 className="font-display text-sm font-semibold text-abyss-900 dark:text-mist-50">{t('settings.appearance')}</h2>
        <p className="mt-1 text-xs text-abyss-500 dark:text-mist-200/50">{t('settings.appearanceDesc')}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:w-72">
          <button
            onClick={() => setTheme('light')}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${theme === 'light' ? 'border-signal-500 bg-signal-500/5' : 'border-mist-200 dark:border-abyss-600'}`}
          >
            <FiSun className="h-5 w-5 text-caution-500" />
            <span className="text-xs font-medium text-abyss-700 dark:text-mist-100">{t('settings.light')}</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${theme === 'dark' ? 'border-signal-500 bg-signal-500/5' : 'border-mist-200 dark:border-abyss-600'}`}
          >
            <FiMoon className="h-5 w-5 text-signal-500" />
            <span className="text-xs font-medium text-abyss-700 dark:text-mist-100">{t('settings.dark')}</span>
          </button>
        </div>
      </section>

      <section className="panel p-6">
        <h2 className="font-display text-sm font-semibold text-abyss-900 dark:text-mist-50">{t('settings.userPreferences')}</h2>
        <p className="mt-1 text-xs text-abyss-500 dark:text-mist-200/50">{t('settings.userPreferencesDesc')}</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>{t('settings.measurementUnits')}</Label>
            <Select value={units} onChange={(e) => setUnits(e.target.value)}>
              <option value="metric">{t('settings.metric')}</option>
              <option value="imperial">{t('settings.imperial')}</option>
            </Select>
          </div>
          <div>
            <Label>{t('settings.language')}</Label>
            <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
              {AVAILABLE_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </Select>
          </div>
        </div>
      </section>

      <section className="panel p-6">
        <div className="flex items-center gap-2">
          <FiBell className="h-4 w-4 text-abyss-500 dark:text-mist-200/50" />
          <h2 className="font-display text-sm font-semibold text-abyss-900 dark:text-mist-50">{t('settings.notificationSettings')}</h2>
        </div>
        <div className="mt-2 divide-y divide-mist-100 dark:divide-abyss-800">
          <Toggle checked={notifications.critical} onChange={() => toggleNotif('critical')} label={t('settings.criticalAlerts')} description={t('settings.criticalAlertsDesc')} />
          <Toggle checked={notifications.caution} onChange={() => toggleNotif('caution')} label={t('settings.cautionAlerts')} description={t('settings.cautionAlertsDesc')} />
          <Toggle checked={notifications.healthy} onChange={() => toggleNotif('healthy')} label={t('settings.recoveryUpdates')} description={t('settings.recoveryUpdatesDesc')} />
          <Toggle checked={notifications.weeklyDigest} onChange={() => toggleNotif('weeklyDigest')} label={t('settings.weeklyDigest')} description={t('settings.weeklyDigestDesc')} />
        </div>
      </section>

      <section className="panel p-6">
        <div className="flex items-center gap-2">
          <FiCpu className="h-4 w-4 text-abyss-500 dark:text-mist-200/50" />
          <h2 className="font-display text-sm font-semibold text-abyss-900 dark:text-mist-50">{t('settings.systemInformation')}</h2>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="eyebrow">{t('settings.version')}</dt>
            <dd className="readout mt-1 text-abyss-800 dark:text-mist-50">1.4.0</dd>
          </div>
          <div>
            <dt className="eyebrow">{t('settings.environment')}</dt>
            <dd className="mt-1 text-abyss-800 dark:text-mist-50">{t('settings.frontendDemo')}</dd>
          </div>
          <div>
            <dt className="eyebrow">{t('settings.connectedNodes')}</dt>
            <dd className="readout mt-1 text-abyss-800 dark:text-mist-50">4</dd>
          </div>
          <div>
            <dt className="eyebrow">{t('settings.apiStatus')}</dt>
            <dd className="mt-1 text-abyss-800 dark:text-mist-50">{t('settings.notConnected')}</dd>
          </div>
        </dl>
      </section>

      <div className="flex justify-end">
        <Button onClick={() => toast.success(t('settings.preferencesSaved'))}>{t('common.save')}</Button>
      </div>
    </div>
  )
}