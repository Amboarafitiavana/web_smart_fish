import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiSun, FiMoon, FiBell, FiCpu } from 'react-icons/fi'
import { useTheme } from '../contexts/ThemeContext'
import { Toggle, Select, Label } from '../components/ui/Field'
import Button from '../components/ui/Button'

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState({ critical: true, caution: true, healthy: false, weeklyDigest: true })
  const [units, setUnits] = useState('metric')
  const [language, setLanguage] = useState('en')

  const toggleNotif = (key) => setNotifications((n) => ({ ...n, [key]: !n[key] }))

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-xl font-semibold text-abyss-900 dark:text-mist-50">Settings</h1>
        <p className="mt-1 text-sm text-abyss-500 dark:text-mist-200/50">Manage preferences for your account and dashboard</p>
      </div>

      <section className="panel p-6">
        <h2 className="font-display text-sm font-semibold text-abyss-900 dark:text-mist-50">Appearance</h2>
        <p className="mt-1 text-xs text-abyss-500 dark:text-mist-200/50">Choose how Smart Fish looks on this device.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:w-72">
          <button
            onClick={() => setTheme('light')}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${theme === 'light' ? 'border-signal-500 bg-signal-500/5' : 'border-mist-200 dark:border-abyss-600'}`}
          >
            <FiSun className="h-5 w-5 text-caution-500" />
            <span className="text-xs font-medium text-abyss-700 dark:text-mist-100">Light</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${theme === 'dark' ? 'border-signal-500 bg-signal-500/5' : 'border-mist-200 dark:border-abyss-600'}`}
          >
            <FiMoon className="h-5 w-5 text-signal-500" />
            <span className="text-xs font-medium text-abyss-700 dark:text-mist-100">Dark</span>
          </button>
        </div>
      </section>

      <section className="panel p-6">
        <h2 className="font-display text-sm font-semibold text-abyss-900 dark:text-mist-50">User Preferences</h2>
        <p className="mt-1 text-xs text-abyss-500 dark:text-mist-200/50">Units and language used across the dashboard.</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Measurement Units</Label>
            <Select value={units} onChange={(e) => setUnits(e.target.value)}>
              <option value="metric">Metric (°C, mg/L, cm)</option>
              <option value="imperial">Imperial (°F, ppm, in)</option>
            </Select>
          </div>
          <div>
            <Label>Language</Label>
            <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="mg">Malagasy</option>
            </Select>
          </div>
        </div>
      </section>

      <section className="panel p-6">
        <div className="flex items-center gap-2">
          <FiBell className="h-4 w-4 text-abyss-500 dark:text-mist-200/50" />
          <h2 className="font-display text-sm font-semibold text-abyss-900 dark:text-mist-50">Notification Settings</h2>
        </div>
        <div className="mt-2 divide-y divide-mist-100 dark:divide-abyss-800">
          <Toggle checked={notifications.critical} onChange={() => toggleNotif('critical')} label="Critical alerts" description="Immediate push and email for critical readings" />
          <Toggle checked={notifications.caution} onChange={() => toggleNotif('caution')} label="Caution alerts" description="Notify when a sensor drifts outside ideal range" />
          <Toggle checked={notifications.healthy} onChange={() => toggleNotif('healthy')} label="Recovery updates" description="Notify when a sensor returns to healthy" />
          <Toggle checked={notifications.weeklyDigest} onChange={() => toggleNotif('weeklyDigest')} label="Weekly digest" description="A summary email every Monday morning" />
        </div>
      </section>

      <section className="panel p-6">
        <div className="flex items-center gap-2">
          <FiCpu className="h-4 w-4 text-abyss-500 dark:text-mist-200/50" />
          <h2 className="font-display text-sm font-semibold text-abyss-900 dark:text-mist-50">System Information</h2>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="eyebrow">Version</dt>
            <dd className="readout mt-1 text-abyss-800 dark:text-mist-50">1.4.0</dd>
          </div>
          <div>
            <dt className="eyebrow">Environment</dt>
            <dd className="mt-1 text-abyss-800 dark:text-mist-50">Frontend Demo</dd>
          </div>
          <div>
            <dt className="eyebrow">Connected Nodes</dt>
            <dd className="readout mt-1 text-abyss-800 dark:text-mist-50">4</dd>
          </div>
          <div>
            <dt className="eyebrow">API Status</dt>
            <dd className="mt-1 text-abyss-800 dark:text-mist-50">Not connected</dd>
          </div>
        </dl>
      </section>

      <div className="flex justify-end">
        <Button onClick={() => toast.success('Preferences saved')}>Save changes</Button>
      </div>
    </div>
  )
}
