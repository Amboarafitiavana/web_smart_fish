import { Bar } from 'react-chartjs-2'
import './chartSetup'
import { gridColor, tickColor } from './chartSetup'
import { useTheme } from '../../contexts/ThemeContext'

export default function TrendBarChart({ labels, data, color = '#2F7BFF', unit = '', height = 220 }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: `${color}CC`,
        hoverBackgroundColor: color,
        borderRadius: 6,
        maxBarThickness: 28,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
    scales: {
      x: { grid: { display: false }, ticks: { color: tickColor(isDark), font: { size: 10 } } },
      y: { grid: { color: gridColor(isDark) }, ticks: { color: tickColor(isDark), font: { size: 10 } } },
    },
  }

  return (
    <div style={{ height }}>
      <Bar data={chartData} options={options} />
    </div>
  )
}
