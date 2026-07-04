import { Line } from 'react-chartjs-2'
import './chartSetup'
import { gridColor, tickColor } from './chartSetup'
import { useTheme } from '../../contexts/ThemeContext'

export default function TrendLineChart({ labels, data, color = '#17C7E0', unit = '', filled = true, height = 220, sparkline = false }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const chartData = {
    labels,
    datasets: [
      {
        data,
        borderColor: color,
        backgroundColor: (ctx) => {
          const { chart } = ctx
          const { ctx: c, chartArea } = chart
          if (!chartArea) return `${color}22`
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
          gradient.addColorStop(0, `${color}33`)
          gradient.addColorStop(1, `${color}00`)
          return gradient
        },
        fill: filled,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: isDark ? '#0B1220' : '#FFFFFF',
        pointHoverBorderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#101A2E' : '#FFFFFF',
        titleColor: isDark ? '#F7F9FC' : '#0B1220',
        bodyColor: isDark ? '#EEF2F8' : '#16233C',
        borderColor: isDark ? '#1D2C49' : '#E3E9F2',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 10,
        displayColors: false,
        callbacks: { label: (c) => `${c.formattedValue} ${unit}` },
      },
    },
    scales: sparkline
      ? { x: { display: false }, y: { display: false } }
      : {
          x: { grid: { display: false }, ticks: { color: tickColor(isDark), font: { size: 10 } } },
          y: {
            grid: { color: gridColor(isDark) },
            ticks: { color: tickColor(isDark), font: { size: 10 } },
          },
        },
  }

  return (
    <div style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  )
}
