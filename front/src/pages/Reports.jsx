import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiFileText, FiDownload, FiCalendar, FiBarChart } from 'react-icons/fi'
import Button from '../components/ui/Button'

const REPORTS = [
  {
    id: 'daily',
    title: 'Daily Report',
    description: 'Sensor readings, alerts, and device status for the last 24 hours.',
    icon: FiFileText,
    accent: '#17C7E0',
    meta: 'Generated automatically at 23:59',
  },
  {
    id: 'weekly',
    title: 'Weekly Report',
    description: 'Trends, averages, and alert summary across the past 7 days.',
    icon: FiCalendar,
    accent: '#2F7BFF',
    meta: 'Generated every Monday',
  },
  {
    id: 'monthly',
    title: 'Monthly Report',
    description: 'Full analytics breakdown with pond-by-pond comparisons.',
    icon: FiBarChart,
    accent: '#10B981',
    meta: 'Generated on the 1st of each month',
  },
]

export default function Reports() {
  const [downloading, setDownloading] = useState(null)

  const handleDownload = (report) => {
    setDownloading(report.id)
    setTimeout(() => {
      setDownloading(null)
      toast.success(`${report.title} downloaded`)
    }, 900)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-abyss-900 dark:text-mist-50">Reports</h1>
        <p className="mt-1 text-sm text-abyss-500 dark:text-mist-200/50">Download summaries of your farm's water quality data</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {REPORTS.map((report) => (
          <div key={report.id} className="panel flex flex-col p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: `${report.accent}18`, color: report.accent }}>
              <report.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-base font-semibold text-abyss-900 dark:text-mist-50">{report.title}</h3>
            <p className="mt-1.5 flex-1 text-sm text-abyss-500 dark:text-mist-200/50">{report.description}</p>
            <p className="mt-4 text-xs text-abyss-400 dark:text-mist-200/40">{report.meta}</p>
            <Button
              variant="subtle"
              className="mt-4 w-full"
              icon={FiDownload}
              loading={downloading === report.id}
              onClick={() => handleDownload(report)}
            >
              Download PDF
            </Button>
          </div>
        ))}
      </div>

      <div className="panel p-6">
        <h3 className="font-display text-base font-semibold text-abyss-900 dark:text-mist-50">Custom Report</h3>
        <p className="mt-1.5 text-sm text-abyss-500 dark:text-mist-200/50">Build a report for a specific pond, sensor, and date range.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <select className="rounded-xl border border-mist-200 dark:border-abyss-600 bg-mist-50 dark:bg-abyss-800 px-3.5 py-2.5 text-sm text-abyss-800 dark:text-mist-50 outline-none">
            <option>All Ponds</option>
            <option>Pond A — Tilapia</option>
            <option>Pond B — Catfish</option>
            <option>Pond C — Nursery</option>
          </select>
          <select className="rounded-xl border border-mist-200 dark:border-abyss-600 bg-mist-50 dark:bg-abyss-800 px-3.5 py-2.5 text-sm text-abyss-800 dark:text-mist-50 outline-none">
            <option>All Sensors</option>
            <option>Water Temperature</option>
            <option>Water pH</option>
            <option>Turbidity</option>
            <option>Dissolved Oxygen</option>
            <option>Water Level</option>
          </select>
          <input type="date" className="rounded-xl border border-mist-200 dark:border-abyss-600 bg-mist-50 dark:bg-abyss-800 px-3.5 py-2.5 text-sm text-abyss-800 dark:text-mist-50 outline-none" />
          <Button icon={FiFileText} onClick={() => toast.success('Custom report queued')}>
            Generate
          </Button>
        </div>
      </div>
    </div>
  )
}
