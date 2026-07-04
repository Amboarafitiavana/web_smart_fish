import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-mist-50 dark:bg-abyss-950 px-4 text-center">
      <p className="readout text-6xl font-bold text-signal-500">404</p>
      <h1 className="mt-3 font-display text-xl font-semibold text-abyss-900 dark:text-mist-50">Page not found</h1>
      <p className="mt-1.5 max-w-sm text-sm text-abyss-500 dark:text-mist-200/50">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/" className="mt-6">
        <Button icon={FiArrowLeft}>Back to Dashboard</Button>
      </Link>
    </div>
  )
}
