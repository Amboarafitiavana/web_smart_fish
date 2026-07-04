export default function StatCard({ label, value, unit, icon: Icon, accent = '#2F7BFF', hint }) {
  return (
    <div className="panel flex items-center gap-4 p-5">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accent}18`, color: accent }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="eyebrow truncate">{label}</p>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="readout text-xl font-semibold text-abyss-900 dark:text-mist-50">{value}</span>
          {unit && <span className="text-xs text-abyss-400 dark:text-mist-200/50">{unit}</span>}
        </div>
        {hint && <p className="mt-0.5 truncate text-xs text-abyss-500 dark:text-mist-200/50">{hint}</p>}
      </div>
    </div>
  )
}
