import { useMemo, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { TableRowSkeleton } from '../ui/Loading'
import { EmptyState } from '../ui/StateViews'

export default function DataTable({ columns, rows, loading = false, pageSize = 8, emptyMessage }) {
  const [page, setPage] = useState(0)

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const pageRows = useMemo(
    () => rows.slice(page * pageSize, page * pageSize + pageSize),
    [rows, page, pageSize]
  )

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-mist-200 dark:border-abyss-700">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-mist-200 dark:border-abyss-700 bg-mist-50 dark:bg-abyss-800/60">
              {columns.map((col) => (
                <th key={col.key} className="eyebrow whitespace-nowrap px-4 py-3 font-semibold">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={columns.length} />)}

            {!loading && pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <EmptyState title="No results" message={emptyMessage || 'Try adjusting your filters or search terms.'} />
                </td>
              </tr>
            )}

            {!loading &&
              pageRows.map((row, i) => (
                <tr
                  key={row.id || i}
                  className="border-b border-mist-100 dark:border-abyss-800 last:border-0 transition-colors hover:bg-mist-50 dark:hover:bg-abyss-800/40"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="whitespace-nowrap px-4 py-3.5 text-abyss-700 dark:text-mist-100">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!loading && rows.length > pageSize && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-abyss-500 dark:text-mist-200/50">
            Showing <span className="readout">{page * pageSize + 1}</span>&ndash;
            <span className="readout">{Math.min(rows.length, (page + 1) * pageSize)}</span> of{' '}
            <span className="readout">{rows.length}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-mist-200 dark:border-abyss-600 text-abyss-500 dark:text-mist-200/60 disabled:opacity-40"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>
            <span className="readout text-xs text-abyss-500 dark:text-mist-200/50">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-mist-200 dark:border-abyss-600 text-abyss-500 dark:text-mist-200/60 disabled:opacity-40"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
