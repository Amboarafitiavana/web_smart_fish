import { useMemo, useState } from 'react'
import { FiAlertTriangle, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import { ALERTS } from '../utils/mockData'
import DataTable from '../components/tables/DataTable'
import StatusBadge from '../components/ui/StatusBadge'
import SearchInput from '../components/ui/SearchInput'
import StatCard from '../components/dashboard/StatCard'
import { useDebounce } from '../hooks/useDebounce'

const SEVERITY_FILTERS = ['all', 'critical', 'caution', 'healthy']

export default function Alerts() {
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState('all')
  const debounced = useDebounce(search, 200)

  const filtered = useMemo(
    () =>
      ALERTS.filter((a) => {
        const matchesSeverity = severity === 'all' || a.severity === severity
        const matchesSearch =
          a.sensor.toLowerCase().includes(debounced.toLowerCase()) ||
          a.pond.toLowerCase().includes(debounced.toLowerCase()) ||
          a.message.toLowerCase().includes(debounced.toLowerCase())
        return matchesSeverity && matchesSearch
      }),
    [severity, debounced]
  )

  const critical = ALERTS.filter((a) => a.severity === 'critical').length
  const caution = ALERTS.filter((a) => a.severity === 'caution').length
  const resolved = ALERTS.filter((a) => a.status === 'Resolved').length

  const columns = [
    { key: 'date', header: 'Date' },
    { key: 'sensor', header: 'Sensor', render: (r) => (
      <div>
        <p className="font-medium text-abyss-800 dark:text-mist-50">{r.sensor}</p>
        <p className="text-xs text-abyss-400 dark:text-mist-200/40">{r.pond}</p>
      </div>
    ) },
    { key: 'severity', header: 'Severity', render: (r) => <StatusBadge status={r.severity} pulse={r.severity === 'critical' && r.status === 'Open'} /> },
    { key: 'message', header: 'Message' },
    { key: 'status', header: 'Status', render: (r) => (
      <span className={`text-xs font-semibold ${r.status === 'Open' ? 'text-critical-500' : r.status === 'Monitoring' ? 'text-caution-500' : 'text-abyss-400 dark:text-mist-200/40'}`}>
        {r.status}
      </span>
    ) },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-abyss-900 dark:text-mist-50">Alerts</h1>
        <p className="mt-1 text-sm text-abyss-500 dark:text-mist-200/50">Notifications triggered by out-of-range sensor readings</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Critical Alerts" value={critical} icon={FiAlertCircle} accent="#EF4444" hint="Needs immediate action" />
        <StatCard label="Caution Alerts" value={caution} icon={FiAlertTriangle} accent="#F59E0B" hint="Monitor closely" />
        <StatCard label="Resolved" value={resolved} icon={FiCheckCircle} accent="#10B981" hint="This month" />
      </div>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {SEVERITY_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setSeverity(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                severity === s
                  ? 'bg-signal-500 text-white'
                  : 'bg-white dark:bg-abyss-800 text-abyss-500 dark:text-mist-200/50 border border-mist-200 dark:border-abyss-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Search alerts…" className="sm:w-72" />
      </div>

      <DataTable columns={columns} rows={filtered} pageSize={6} emptyMessage="No alerts match your filters." />
    </div>
  )
}
