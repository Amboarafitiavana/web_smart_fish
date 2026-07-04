import { motion } from 'framer-motion'
import { FiActivity, FiCpu, FiCheckCircle, FiRefreshCw } from 'react-icons/fi'
import { useClock } from '../hooks/useClock'
import { formatDate, formatTime } from '../utils/format'
import { ALERTS, DEVICES } from '../utils/mockData'
import { useRealtime } from '../contexts/RealtimeContext'
import { useLanguage } from '../contexts/LanguageContext'
import SensorCard from '../components/dashboard/SensorCard'
import StatCard from '../components/dashboard/StatCard'
import ChartCard from '../components/charts/ChartCard'
import TrendLineChart from '../components/charts/TrendLineChart'
import AlertCard from '../components/dashboard/AlertCard'
import DeviceRow from '../components/dashboard/DeviceRow'
import { SensorCardSkeleton } from '../components/ui/Loading'
import { ErrorState } from '../components/ui/StateViews'
import { useAuth } from '../contexts/AuthContext'

const STATUS_COLOR = { healthy: '#10B981', caution: '#F59E0B', critical: '#EF4444' }

export default function Dashboard() {
  const { user } = useAuth()
  const now = useClock()
  const { sensors, loading, loadError, retry, lastSync } = useRealtime()
  const { t } = useLanguage()

  const healthyCount = sensors.filter((s) => s.status === 'healthy').length
  const cautionCount = sensors.filter((s) => s.status === 'caution').length
  const criticalCount = sensors.filter((s) => s.status === 'critical').length
  const onlineDevices = DEVICES.filter((d) => d.status === 'online').length

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col justify-between gap-4 rounded-2xl border border-mist-200 dark:border-abyss-700 bg-gradient-to-br from-signal-500 to-current-500 p-6 text-white shadow-glow sm:flex-row sm:items-center"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">{formatDate(now)}</p>
          <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
            {t('dashboard.welcomeBack', { name: user?.name?.split(' ')[0] || 'Operator' })}
          </h1>
          <p className="mt-1.5 text-sm text-white/80">
            {t('dashboard.liveMonitoring', { count: sensors.length || 5, online: onlineDevices, total: DEVICES.length })}
          </p>
        </div>
        <div className="text-right">
          <p className="readout text-3xl font-bold tabular-nums">{formatTime(now)}</p>
          <p className="text-xs text-white/70">{t('dashboard.localTime')}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label={t('dashboard.healthyReadings')} value={healthyCount} unit={`/ ${sensors.length || 5}`} icon={FiCheckCircle} accent="#10B981" hint={t('dashboard.withinIdealRange')} />
        <StatCard label={t('dashboard.needsAttention')} value={cautionCount + criticalCount} unit={t('dashboard.sensorsUnit')} icon={FiActivity} accent="#F59E0B" hint={`${criticalCount} ${t('dashboard.critical')}`} />
        <StatCard label={t('dashboard.devicesOnline')} value={onlineDevices} unit={`/ ${DEVICES.length}`} icon={FiCpu} accent="#2F7BFF" hint={t('dashboard.fieldNodes')} />
        <StatCard label={t('dashboard.lastSync')} value={lastSync ? formatTime(lastSync) : '—'} icon={FiRefreshCw} accent="#17C7E0" hint={t('dashboard.liveViaWebSocket')} />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-abyss-900 dark:text-mist-50">{t('dashboard.farmOverview')}</h2>
          <span className="eyebrow">{t('dashboard.sensorsCount')}</span>
        </div>

        {loadError ? (
          <ErrorState
            title={t('dashboard.couldNotLoad')}
            message={t('dashboard.couldNotLoadMessage')}
            onRetry={retry}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {loading || sensors.length === 0
              ? Array.from({ length: 5 }).map((_, i) => <SensorCardSkeleton key={i} />)
              : sensors.map((s, i) => <SensorCard key={s.id} sensor={s} delay={i * 0.05} />)}
          </div>
        )}
      </div>

      {!loadError && sensors.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {sensors.map((s) => (
            <ChartCard key={s.id} title={`${s.name} ${t('dashboard.historySuffix')}`} subtitle={t('dashboard.liveUpdates')}>
              <TrendLineChart
                labels={s.series.map((_, i) => i)}
                data={s.series}
                color={STATUS_COLOR[s.status]}
                unit={s.unit}
                height={200}
              />
            </ChartCard>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-1">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-abyss-900 dark:text-mist-50">{t('dashboard.recentAlerts')}</h3>
            <span className="eyebrow">{ALERTS.length} {t('dashboard.total')}</span>
          </div>
          <div>
            {ALERTS.slice(0, 5).map((a) => (
              <AlertCard key={a.id} alert={a} />
            ))}
          </div>
        </div>

        <div className="panel p-5 lg:col-span-1">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-abyss-900 dark:text-mist-50">{t('dashboard.deviceStatus')}</h3>
            <span className="eyebrow">{onlineDevices}/{DEVICES.length} {t('dashboard.online')}</span>
          </div>
          <div>
            {DEVICES.map((d) => (
              <DeviceRow key={d.id} device={d} />
            ))}
          </div>
        </div>

        <div className="panel p-5 lg:col-span-1">
          <h3 className="font-display text-sm font-semibold text-abyss-900 dark:text-mist-50">{t('dashboard.systemHealth')}</h3>
          <div className="mt-4 space-y-4">
            <HealthBar label={t('dashboard.sensorUptime')} value={98} color="#10B981" />
            <HealthBar label={t('dashboard.networkSignal')} value={87} color="#2F7BFF" />
            <HealthBar label={t('dashboard.dataSyncRate')} value={94} color="#17C7E0" />
          </div>
          <div className="mt-5 rounded-xl bg-mist-50 dark:bg-abyss-800 p-3.5">
            <p className="eyebrow">{t('dashboard.lastSynchronization')}</p>
            <p className="readout mt-1 text-sm font-semibold text-abyss-800 dark:text-mist-50">
              {lastSync ? `${formatTime(lastSync)} · ${formatDate(lastSync).split(',')[0]}` : t('dashboard.waitingForData')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function HealthBar({ label, value, color }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-abyss-600 dark:text-mist-200/60">{label}</span>
        <span className="readout font-semibold text-abyss-800 dark:text-mist-50">{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-mist-100 dark:bg-abyss-700">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}