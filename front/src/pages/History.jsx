import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { FiDownload, FiCalendar } from 'react-icons/fi'
import { HISTORY_ROWS } from '../utils/mockData'
import DataTable from '../components/tables/DataTable'
import StatusBadge from '../components/ui/StatusBadge'
import SearchInput from '../components/ui/SearchInput'
import Button from '../components/ui/Button'
import { useDebounce } from '../hooks/useDebounce'
import { useLanguage } from '../contexts/LanguageContext'

export default function History() {
  const { t } = useLanguage()
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const debounced = useDebounce(search, 200)

  const filtered = useMemo(
    () =>
      HISTORY_ROWS.filter((r) => {
        const matchesSearch =
          r.sensor.toLowerCase().includes(debounced.toLowerCase()) ||
          r.pond.toLowerCase().includes(debounced.toLowerCase())
        const matchesDate = !dateFilter || r.date.startsWith(dateFilter)
        return matchesSearch && matchesDate
      }),
    [debounced, dateFilter]
  )

  const columns = [
    { key: 'id', header: t('historyPage.columnRecordId'), render: (r) => <span className="readout text-abyss-400 dark:text-mist-200/40">{r.id}</span> },
    { key: 'date', header: t('historyPage.columnDateTime'), render: (r) => <span className="readout">{r.date}</span> },
    { key: 'pond', header: t('historyPage.columnPond') },
    { key: 'sensor', header: t('historyPage.columnSensor') },
    { key: 'value', header: t('historyPage.columnValue'), render: (r) => <span className="readout font-semibold">{r.value}</span> },
    { key: 'status', header: t('historyPage.columnStatus'), render: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-xl font-semibold text-abyss-900 dark:text-mist-50">{t('historyPage.title')}</h1>
          <p className="mt-1 text-sm text-abyss-500 dark:text-mist-200/50">{t('historyPage.subtitle', { count: HISTORY_ROWS.length })}</p>
        </div>
        <Button variant="ghost" icon={FiDownload} onClick={() => toast.success(t('historyPage.exportStarted'))}>
          {t('historyPage.exportCsv')}
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder={t('historyPage.searchPlaceholder')} className="sm:w-72" />
        <div className="relative sm:w-52">
          <FiCalendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-abyss-400 dark:text-mist-200/40" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full rounded-xl border border-mist-200 dark:border-abyss-600 bg-mist-50 dark:bg-abyss-800 py-2.5 pl-9 pr-3 text-sm text-abyss-800 dark:text-mist-50 outline-none transition focus:border-current-500 focus:ring-2 focus:ring-current-500/20"
          />
        </div>
        {dateFilter && (
          <button onClick={() => setDateFilter('')} className="text-xs font-medium text-signal-600 dark:text-signal-400">
            {t('historyPage.clearDate')}
          </button>
        )}
      </div>

      <DataTable columns={columns} rows={filtered} pageSize={10} emptyMessage={t('historyPage.emptyMessage')} />
    </div>
  )
}