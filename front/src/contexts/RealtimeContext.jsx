import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useWebSocket } from '../hooks/useWebSocket'
import { WS_URL } from '../services/apiClient'
import { sensorService } from '../services/sensorService'
import { measurementService } from '../services/measurementService'
import { SENSOR_META, keyFromTypeName, computeStatus } from '../utils/sensorMeta'
import { formatRelativeTime } from '../utils/format'

const RealtimeContext = createContext(null)

const SERIES_MAX_POINTS = 30
const ALERTS_MAX_ITEMS = 20

function buildSensorEntry(sensor, historyValues) {
  const key = keyFromTypeName(sensor.sensor_type.name)
  const meta = SENSOR_META[key] || {}
  const series = historyValues.slice().reverse() // oldest -> newest
  const value = series.length ? series[series.length - 1] : null
  const prev = series.length > 1 ? series[series.length - 2] : value

  return {
    id: sensor.id,
    key,
    name: sensor.sensor_type.name,
    unit: sensor.sensor_type.unit || meta.unit,
    icon: meta.icon || 'thermometer',
    value,
    trend: value === prev ? 'flat' : value > prev ? 'up' : 'down',
    status: computeStatus(key, value),
    lastUpdateIso: sensor.installed_at,
    series,
  }
}

export function RealtimeProvider({ children }) {
  const [sensors, setSensors] = useState({}) // { [sensor_id]: entry }
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [lastSync, setLastSync] = useState(null)

  const { status: connectionStatus, lastMessage } = useWebSocket(WS_URL)

  const loadInitialState = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const { data: sensorList } = await sensorService.getAll()

      const histories = await Promise.all(
        sensorList.map((sensor) =>
          measurementService
            .listBySensor(sensor.id, { limit: 12 })
            .then((res) => res.data.map((m) => Number(m.value)))
            .catch(() => [])
        )
      )

      const initial = {}
      sensorList.forEach((sensor, i) => {
        initial[sensor.id] = buildSensorEntry(sensor, histories[i])
      })

      setSensors(initial)
      setLastSync(new Date())
    } catch (err) {
      setLoadError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadInitialState()
  }, [loadInitialState])

  // Apply incoming WebSocket messages on top of the REST-seeded state.
  useEffect(() => {
    if (!lastMessage) return

    if (lastMessage.type === 'measurement_update') {
      setSensors((prev) => {
        const next = { ...prev }
        for (const item of lastMessage.data) {
          const existing = next[item.sensor_id]
          if (!existing) continue // sensor not in initial load (shouldn't happen with 5 fixed sensors)

          const value = Number(item.value)
          const series = [...existing.series, value].slice(-SERIES_MAX_POINTS)

          next[item.sensor_id] = {
            ...existing,
            value,
            trend: value === existing.value ? 'flat' : value > existing.value ? 'up' : 'down',
            status: computeStatus(existing.key, value),
            lastUpdateIso: item.recorded_at,
            series,
          }
        }
        return next
      })
      setLastSync(new Date())
    }

    if (lastMessage.type === 'alert_new') {
      setAlerts((prev) => [...lastMessage.data, ...prev].slice(0, ALERTS_MAX_ITEMS))

      for (const alert of lastMessage.data) {
        const text = `${alert.message}`
        if (alert.level === 'critical') toast.error(text)
        else if (alert.level === 'warning') toast(text, { icon: '⚠️' })
        else toast(text)
      }
    }
  }, [lastMessage])

  const sensorList = useMemo(
    () =>
      Object.values(sensors)
        .sort((a, b) => a.id - b.id)
        .map((s) => ({ ...s, lastUpdate: s.lastUpdateIso ? formatRelativeTime(s.lastUpdateIso) : '—' })),
    [sensors]
  )

  const value = {
    sensors: sensorList,
    alerts,
    connectionStatus,
    loading,
    loadError,
    lastSync,
    retry: loadInitialState,
  }

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>
}

export function useRealtime() {
  const ctx = useContext(RealtimeContext)
  if (!ctx) throw new Error('useRealtime must be used within RealtimeProvider')
  return ctx
}