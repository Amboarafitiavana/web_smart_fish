import { FiWifi, FiWifiOff, FiBatteryCharging } from 'react-icons/fi'
import StatusBadge from '../ui/StatusBadge'

export default function DeviceRow({ device }) {
  return (
    <div className="flex items-center justify-between border-b border-mist-100 dark:border-abyss-800 py-3 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${device.status === 'online' ? 'bg-healthy-500/10 text-healthy-500' : 'bg-abyss-500/10 text-abyss-400'}`}>
          {device.status === 'online' ? <FiWifi className="h-3.5 w-3.5" /> : <FiWifiOff className="h-3.5 w-3.5" />}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-abyss-800 dark:text-mist-50">{device.name}</p>
          <p className="truncate text-xs text-abyss-500 dark:text-mist-200/50">{device.pond}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="flex items-center gap-1 text-xs readout text-abyss-500 dark:text-mist-200/50">
          <FiBatteryCharging className="h-3.5 w-3.5" /> {device.battery}%
        </span>
        <StatusBadge status={device.status} />
      </div>
    </div>
  )
}
