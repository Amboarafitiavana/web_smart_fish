import { FiInbox, FiAlertTriangle } from 'react-icons/fi'
import Button from './Button'

export function EmptyState({
  icon: Icon = FiInbox,
  title = 'Nothing here yet',
  message = 'Once data starts coming in, it will show up here.',
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-mist-200 dark:border-abyss-600 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mist-100 dark:bg-abyss-800 text-abyss-400 dark:text-mist-200/40">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-display font-semibold text-abyss-800 dark:text-mist-50">{title}</p>
        <p className="mt-1 max-w-xs text-sm text-abyss-500 dark:text-mist-200/50">{message}</p>
      </div>
      {action}
    </div>
  )
}

export function ErrorState({ title = 'Couldn\u2019t load this data', message = 'Something interrupted the connection. Try again.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-critical-500/20 bg-critical-500/5 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-critical-500/10 text-critical-500">
        <FiAlertTriangle className="h-5 w-5" />
      </div>
      <div>
        <p className="font-display font-semibold text-abyss-800 dark:text-mist-50">{title}</p>
        <p className="mt-1 max-w-xs text-sm text-abyss-500 dark:text-mist-200/50">{message}</p>
      </div>
      {onRetry && (
        <Button variant="subtle" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
