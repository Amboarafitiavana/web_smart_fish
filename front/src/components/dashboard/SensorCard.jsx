import { FiArrowUp, FiArrowDown, FiMinus } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { SENSOR_ICONS } from '../../utils/sensorIcons'
import StatusBadge from '../ui/StatusBadge'
import TrendLineChart from '../charts/TrendLineChart'

const STATUS_COLOR = {
  healthy: '#10B981',
  caution: '#F59E0B',
  critical: '#EF4444',
}

const TREND_ICON = { up: FiArrowUp, down: FiArrowDown, flat: FiMinus }

export default function SensorCard({ sensor, delay = 0 }) {
  const Icon = SENSOR_ICONS[sensor.icon]
  const TrendIcon = TREND_ICON[sensor.trend]
  const accent = STATUS_COLOR[sensor.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="panel group relative overflow-hidden p-5 transition-shadow hover:shadow-glow"
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accent}18`, color: accent }}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
        <StatusBadge status={sensor.status} pulse={sensor.status === 'critical'} />
      </div>

      <div className="mt-5">
        <p className="eyebrow">{sensor.name}</p>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="readout text-3xl font-semibold text-abyss-900 dark:text-mist-50">
            {sensor.value}
          </span>
          <span className="readout text-sm text-abyss-400 dark:text-mist-200/50">{sensor.unit}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-abyss-500 dark:text-mist-200/50">
          <TrendIcon className={`h-3 w-3 ${sensor.trend === 'up' ? 'text-critical-500' : sensor.trend === 'down' ? 'text-signal-500' : ''}`} />
          <span>Updated {sensor.lastUpdate}</span>
        </div>
      </div>

      <div className="mt-4 -mx-1">
        <TrendLineChart labels={sensor.series.map((_, i) => i)} data={sensor.series} color={accent} unit={sensor.unit} height={56} filled sparkline />
      </div>
    </motion.div>
  )
}
