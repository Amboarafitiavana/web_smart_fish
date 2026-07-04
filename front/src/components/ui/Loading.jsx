export function Spinner({ className = 'h-5 w-5' }) {
  return (
    <span
      className={`inline-block rounded-full border-2 border-current-500/25 border-t-current-500 animate-spin ${className}`}
    />
  )
}

export function PageSpinner() {
  return (
    <div className="flex h-64 w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="h-8 w-8" />
        <span className="eyebrow">Loading data</span>
      </div>
    </div>
  )
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-mist-200 dark:bg-abyss-700 ${className}`} />
}

export function SensorCardSkeleton() {
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between">
        <Skeleton className="h-9 w-9 rounded-xl" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="mt-6 h-8 w-24" />
      <Skeleton className="mt-2 h-3 w-32" />
      <Skeleton className="mt-5 h-10 w-full" />
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <Skeleton className="h-3.5 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  )
}
