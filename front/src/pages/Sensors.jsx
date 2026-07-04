import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiWifi } from 'react-icons/fi'
import { PONDS, getAllSnapshots } from '../utils/mockData'
import { SENSOR_ICONS } from '../utils/sensorIcons'
import StatusBadge from '../components/ui/StatusBadge'
import SearchInput from '../components/ui/SearchInput'
import { useDebounce } from '../hooks/useDebounce'
import { EmptyState } from '../components/ui/StateViews'
import { SensorCardSkeleton } from '../components/ui/Loading'
import { useLanguage } from '../contexts/LanguageContext'

export default function Sensors() {
  const { t } = useLanguage()
  const [search, setSearch] = useState('')
  const debounced = useDebounce(search, 200)
  const [loading] = useState(false)

  const allSensors = useMemo(
    () => PONDS.flatMap((pond, i) => getAllSnapshots(i + 1).map((s) => ({ ...s, pond: pond.name }))),
    []
  )

  const filtered = allSensors.filter(
    (s) =>
      s.name.toLowerCase().includes(debounced.toLowerCase()) ||
      s.pond.toLowerCase().includes(debounced.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-xl font-semibold text-abyss-900 dark:text-mist-50">{t('sensorsPage.title')}</h1>
          <p className="mt-1 text-sm text-abyss-500 dark:text-mist-200/50">
            {t('sensorsPage.subtitle', { count: allSensors.length, ponds: PONDS.length })}
          </p>
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder={t('sensorsPage.searchPlaceholder')} className="sm:w-72" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SensorCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title={t('sensorsPage.emptyTitle')} message={t('sensorsPage.emptyMessage')} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s, i) => (
            <SensorDetailCard key={`${s.pond}-${s.id}`} sensor={s} delay={i * 0.03} t={t} />
          ))}
        </div>
      )}
    </div>
  )
}

function SensorDetailCard({ sensor, delay, t }) {
  const Icon = SENSOR_ICONS[sensor.icon]
  const accent = sensor.status === 'critical' ? '#EF4444' : sensor.status === 'caution' ? '#F59E0B' : '#10B981'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="panel p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}18`, color: accent }}>
            <Icon className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-abyss-900 dark:text-mist-50">{sensor.name}</p>
            <p className="text-xs text-abyss-500 dark:text-mist-200/50">{sensor.pond}</p>
          </div>
        </div>
        <StatusBadge status={sensor.status} pulse={sensor.status === 'critical'} />
      </div>

      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="readout text-2xl font-semibold text-abyss-900 dark:text-mist-50">{sensor.value}</span>
        <span className="readout text-sm text-abyss-400 dark:text-mist-200/50">{sensor.unit}</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-mist-100 dark:border-abyss-800 pt-3 text-xs">
        <div>
          <p className="text-abyss-400 dark:text-mist-200/40">{t('sensorsPage.updated')}</p>
          <p className="mt-0.5 font-medium text-abyss-700 dark:text-mist-100">{sensor.lastUpdate}</p>
        </div>
        <div>
          <p className="text-abyss-400 dark:text-mist-200/40">{t('sensorsPage.signal')}</p>
          <p className="mt-0.5 flex items-center gap-1 font-medium text-abyss-700 dark:text-mist-100">
            <FiWifi className="h-3 w-3" /> {sensor.signal}%
          </p>
        </div>
        <div>
          <p className="text-abyss-400 dark:text-mist-200/40">{t('sensorsPage.idealRange')}</p>
          <p className="mt-0.5 readout font-medium text-abyss-700 dark:text-mist-100">
            {sensor.ideal[0]}–{sensor.ideal[1]}
          </p>
        </div>
      </div>
    </motion.div>
  )
}