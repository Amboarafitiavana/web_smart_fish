import { useRealtime } from '../../contexts/RealtimeContext'

const CONFIG = {
  connected: { label: 'Live', dotClass: 'bg-healthy-500', textClass: 'text-healthy-600 dark:text-healthy-400' },
  connecting: { label: 'Connecting', dotClass: 'bg-caution-500 animate-pulseDot', textClass: 'text-caution-600 dark:text-caution-400' },
  reconnecting: { label: 'Reconnecting', dotClass: 'bg-caution-500 animate-pulseDot', textClass: 'text-caution-600 dark:text-caution-400' },
  disconnected: { label: 'Offline', dotClass: 'bg-critical-500', textClass: 'text-critical-600 dark:text-critical-400' },
}

export default function ConnectionStatusBadge() {
  const { connectionStatus } = useRealtime()
  const cfg = CONFIG[connectionStatus] || CONFIG.disconnected

  return (
    <span className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border border-mist-200 dark:border-abyss-600 px-2.5 py-1 text-[11px] font-semibold ${cfg.textClass}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotClass}`} />
      {cfg.label}
    </span>
  )
}