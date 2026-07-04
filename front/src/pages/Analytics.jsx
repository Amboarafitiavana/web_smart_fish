import { useState } from 'react'
import { FiTrendingUp, FiTrendingDown, FiActivity } from 'react-icons/fi'
import { SENSOR_TYPES, generateSeries } from '../utils/mockData'
import ChartCard from '../components/charts/ChartCard'
import TrendLineChart from '../components/charts/TrendLineChart'
import TrendBarChart from '../components/charts/TrendBarChart'
import StatusDoughnut from '../components/charts/StatusDoughnut'
import StatCard from '../components/dashboard/StatCard'
import { useLanguage } from '../contexts/LanguageContext'

const COLORS = { temperature: '#EF4444', ph: '#2F7BFF', turbidity: '#F59E0B', oxygen: '#17C7E0', level: '#10B981' }

export default function Analytics() {
  const { t } = useLanguage()

  const PERIODS = [
    { id: 'daily', label: t('analyticsPage.periods.daily'), points: 24, labels: (n) => Array.from({ length: n }, (_, i) => `${i}:00`) },
    { id: 'weekly', label: t('analyticsPage.periods.weekly'), points: 7, labels: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    { id: 'monthly', label: t('analyticsPage.periods.monthly'), points: 30, labels: (n) => Array.from({ length: n }, (_, i) => `${i + 1}`) },
    { id: 'yearly', label: t('analyticsPage.periods.yearly'), points: 12, labels: () => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
  ]

  const [period, setPeriod] = useState('weekly')
  const [sensorId, setSensorId] = useState('temperature')

  const active = PERIODS.find((p) => p.id === period)
  const sensor = SENSOR_TYPES.find((s) => s.id === sensorId)
  const series = generateSeries(sensorId, active.points, period.length)
  const labels = active.labels(active.points)

  const avg = (series.reduce((a, b) => a + b, 0) / series.length).toFixed(sensor.decimals)
  const min = Math.min(...series).toFixed(sensor.decimals)
  const max = Math.max(...series).toFixed(sensor.decimals)
  const trendUp = series[series.length - 1] >= series[0]

  const statusSegments = [
    { label: t('status.healthy'), value: 68, color: '#10B981' },
    { label: t('status.caution'), value: 22, color: '#F59E0B' },
    { label: t('status.critical'), value: 10, color: '#EF4444' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-xl font-semibold text-abyss-900 dark:text-mist-50">{t('analyticsPage.title')}</h1>
          <p className="mt-1 text-sm text-abyss-500 dark:text-mist-200/50">{t('analyticsPage.subtitle')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-mist-200 dark:border-abyss-600 bg-white dark:bg-abyss-800 p-1">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  period === p.id
                    ? 'bg-signal-500 text-white'
                    : 'text-abyss-500 hover:text-abyss-800 dark:text-mist-200/50 dark:hover:text-mist-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <select
            value={sensorId}
            onChange={(e) => setSensorId(e.target.value)}
            className="rounded-xl border border-mist-200 dark:border-abyss-600 bg-white dark:bg-abyss-800 px-3 py-2 text-xs font-medium text-abyss-700 dark:text-mist-100 outline-none"
          >
            {SENSOR_TYPES.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label={t('analyticsPage.average')} value={avg} unit={sensor.unit} icon={FiActivity} accent="#2F7BFF" hint={t('analyticsPage.periodView', { period: active.label })} />
        <StatCard label={t('analyticsPage.minimum')} value={min} unit={sensor.unit} icon={FiTrendingDown} accent="#17C7E0" hint={t('analyticsPage.lowestRecorded')} />
        <StatCard label={t('analyticsPage.maximum')} value={max} unit={sensor.unit} icon={FiTrendingUp} accent="#F59E0B" hint={t('analyticsPage.highestRecorded')} />
        <StatCard label={t('analyticsPage.trend')} value={trendUp ? t('analyticsPage.rising') : t('analyticsPage.falling')} icon={trendUp ? FiTrendingUp : FiTrendingDown} accent={trendUp ? '#EF4444' : '#10B981'} hint={t('analyticsPage.vsPeriodStart')} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title={t('analyticsPage.sensorTrend', { sensor: sensor.name })} subtitle={t('analyticsPage.periodView', { period: active.label })} className="lg:col-span-2">
          <TrendLineChart labels={labels} data={series} color={COLORS[sensorId]} unit={sensor.unit} height={280} />
        </ChartCard>
        <ChartCard title={t('analyticsPage.readingDistribution')} subtitle={t('analyticsPage.shareOfTime')}>
          <div className="flex items-center justify-center">
            <StatusDoughnut segments={statusSegments} height={180} />
          </div>
          <div className="mt-4 space-y-2">
            {statusSegments.map((s) => (
              <div key={s.label} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-abyss-600 dark:text-mist-200/60">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} /> {s.label}
                </span>
                <span className="readout font-semibold text-abyss-800 dark:text-mist-50">{s.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard title={t('analyticsPage.sensorComparison')} subtitle={t('analyticsPage.averageReadingsThis', { period: active.label })}>
        <TrendBarChart
          labels={SENSOR_TYPES.map((s) => s.name.split(' ').slice(-1)[0])}
          data={SENSOR_TYPES.map((s) => {
            const d = generateSeries(s.id, active.points, period.length + s.id.length)
            return Number((d.reduce((a, b) => a + b, 0) / d.length).toFixed(s.decimals))
          })}
          color="#2F7BFF"
          height={240}
        />
      </ChartCard>
    </div>
  )
}