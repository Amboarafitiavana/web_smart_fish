import { FiAlertCircle } from 'react-icons/fi'

const DOT = { healthy: 'bg-healthy-500', caution: 'bg-caution-500', critical: 'bg-critical-500' }

export default function AlertCard({ alert }) {
  return (
    <div className="flex items-start gap-3 border-b border-mist-100 dark:border-abyss-800 py-3 last:border-0">
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${DOT[alert.severity]}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-abyss-800 dark:text-mist-50">{alert.sensor}</p>
          <span className="shrink-0 text-[11px] text-abyss-400 dark:text-mist-200/40">{alert.date.split(' ')[1]}</span>
        </div>
        <p className="mt-0.5 truncate text-xs text-abyss-500 dark:text-mist-200/50">{alert.message}</p>
        <p className="mt-0.5 text-[11px] text-abyss-400 dark:text-mist-200/35">{alert.pond}</p>
      </div>
    </div>
  )
}

export function AlertCardIcon() {
  return <FiAlertCircle />
}
