const STYLES = {
  healthy: 'bg-healthy-500/10 text-healthy-600 dark:text-healthy-400 border-healthy-500/25',
  caution: 'bg-caution-500/10 text-caution-600 dark:text-caution-400 border-caution-500/25',
  critical: 'bg-critical-500/10 text-critical-600 dark:text-critical-400 border-critical-500/25',
  online: 'bg-healthy-500/10 text-healthy-600 dark:text-healthy-400 border-healthy-500/25',
  offline: 'bg-abyss-500/10 text-abyss-500 dark:text-mist-200/50 border-abyss-500/20',
  info: 'bg-signal-500/10 text-signal-600 dark:text-signal-400 border-signal-500/25',
}

const LABELS = {
  healthy: 'Healthy',
  caution: 'Caution',
  critical: 'Critical',
  online: 'Online',
  offline: 'Offline',
}

export default function StatusBadge({ status, label, pulse = false }) {
  const style = STYLES[status] || STYLES.info
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${style}`}>
      <span className={`h-1.5 w-1.5 rounded-full bg-current ${pulse ? 'animate-pulseDot' : ''}`} />
      {label || LABELS[status] || status}
    </span>
  )
}
