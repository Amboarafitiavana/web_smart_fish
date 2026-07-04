import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
)

export const gridColor = (isDark) => (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(16,42,96,0.06)')
export const tickColor = (isDark) => (isDark ? 'rgba(238,242,248,0.45)' : 'rgba(16,42,96,0.45)')
