export function formatTime(date) {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function formatDate(date) {
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatRelativeTime(isoString) {
  const then = new Date(isoString).getTime()
  const now = Date.now()
  const diffSeconds = Math.max(0, Math.floor((now - then) / 1000))

  if (diffSeconds < 5) return 'just now'
  if (diffSeconds < 60) return `${diffSeconds}s ago`
  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes} min ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

export function classNames(...args) {
  return args.filter(Boolean).join(' ')
}