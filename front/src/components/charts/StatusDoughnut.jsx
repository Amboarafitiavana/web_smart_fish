import { Doughnut } from 'react-chartjs-2'
import './chartSetup'
import { useTheme } from '../../contexts/ThemeContext'

export default function StatusDoughnut({ segments, height = 200 }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const data = {
    labels: segments.map((s) => s.label),
    datasets: [
      {
        data: segments.map((s) => s.value),
        backgroundColor: segments.map((s) => s.color),
        borderColor: isDark ? '#0B1220' : '#FFFFFF',
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
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
        displayColors: true,
      },
    },
  }

  return (
    <div style={{ height }}>
      <Doughnut data={data} options={options} />
    </div>
  )
}
