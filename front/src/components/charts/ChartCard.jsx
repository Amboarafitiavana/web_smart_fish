export default function ChartCard({ title, subtitle, action, children, className = '' }) {
  return (
    <div className={`panel p-5 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-sm font-semibold text-abyss-900 dark:text-mist-50">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-abyss-500 dark:text-mist-200/50">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}
