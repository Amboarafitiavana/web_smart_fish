// Mock data layer — stands in for the FastAPI backend during frontend development.
// Every shape here mirrors what the /sensors, /alerts, and /history endpoints
// are expected to return, so swapping in services/api.js later is a drop-in.

export const PONDS = [
  { id: 'pond-a', name: 'Pond A — Tilapia', capacity: '12,000 L' },
  { id: 'pond-b', name: 'Pond B — Catfish', capacity: '9,500 L' },
  { id: 'pond-c', name: 'Pond C — Nursery', capacity: '4,200 L' },
]

export const SENSOR_TYPES = [
  {
    id: 'temperature',
    name: 'Water Temperature',
    unit: '°C',
    icon: 'thermometer',
    range: [24, 30],
    ideal: [26, 29],
    decimals: 1,
  },
  {
    id: 'ph',
    name: 'Water pH',
    unit: 'pH',
    icon: 'flask',
    range: [6.2, 8.4],
    ideal: [6.8, 7.6],
    decimals: 2,
  },
  {
    id: 'turbidity',
    name: 'Turbidity',
    unit: 'NTU',
    icon: 'droplet',
    range: [0, 40],
    ideal: [0, 12],
    decimals: 1,
  },
  {
    id: 'oxygen',
    name: 'Dissolved Oxygen',
    unit: 'mg/L',
    icon: 'wind',
    range: [3, 10],
    ideal: [5.5, 9],
    decimals: 1,
  },
  {
    id: 'level',
    name: 'Water Level',
    unit: 'cm',
    icon: 'waves',
    range: [60, 120],
    ideal: [90, 115],
    decimals: 0,
  },
]

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function statusFor(value, [idealLow, idealHigh], [rangeLow, rangeHigh]) {
  if (value >= idealLow && value <= idealHigh) return 'healthy'
  const span = rangeHigh - rangeLow
  const distance = value < idealLow ? idealLow - value : value - idealHigh
  if (distance / span > 0.18) return 'critical'
  return 'caution'
}

export function generateSeries(sensorId, points = 24, seed = 1) {
  const sensor = SENSOR_TYPES.find((s) => s.id === sensorId)
  const rand = seededRandom(seed * 97 + sensorId.length)
  const [low, high] = sensor.ideal
  const mid = (low + high) / 2
  const spread = (high - low) / 2 + (sensor.range[1] - sensor.range[0]) * 0.08
  const series = []
  let last = mid
  for (let i = 0; i < points; i++) {
    const drift = (rand() - 0.5) * spread * 0.6
    last = Math.min(sensor.range[1], Math.max(sensor.range[0], last + drift))
    series.push(Number(last.toFixed(sensor.decimals)))
  }
  return series
}

export function getSensorSnapshot(sensorId, pondSeed = 1) {
  const sensor = SENSOR_TYPES.find((s) => s.id === sensorId)
  const series = generateSeries(sensorId, 12, pondSeed)
  const value = series[series.length - 1]
  const prev = series[series.length - 2] ?? value
  const trend = value === prev ? 'flat' : value > prev ? 'up' : 'down'
  return {
    ...sensor,
    value,
    trend,
    status: statusFor(value, sensor.ideal, sensor.range),
    lastUpdate: '12 sec ago',
    signal: Math.round(70 + seededRandom(pondSeed + sensorId.length)() * 30),
    series,
  }
}

export function getAllSnapshots(pondSeed = 1) {
  return SENSOR_TYPES.map((s) => getSensorSnapshot(s.id, pondSeed))
}

export const ALERTS = [
  { id: 'AL-3391', date: '2026-06-30 21:14', sensor: 'Dissolved Oxygen', pond: 'Pond B — Catfish', severity: 'critical', message: 'Oxygen dropped below 4.2 mg/L threshold', status: 'Open' },
  { id: 'AL-3390', date: '2026-06-30 18:02', sensor: 'Water Temperature', pond: 'Pond A — Tilapia', severity: 'caution', message: 'Temperature trending above ideal range', status: 'Monitoring' },
  { id: 'AL-3388', date: '2026-06-30 09:47', sensor: 'Turbidity', pond: 'Pond C — Nursery', severity: 'caution', message: 'Turbidity rising after feeding cycle', status: 'Resolved' },
  { id: 'AL-3384', date: '2026-06-29 22:31', sensor: 'Water pH', pond: 'Pond A — Tilapia', severity: 'critical', message: 'pH fell to 6.1, outside safe range', status: 'Resolved' },
  { id: 'AL-3379', date: '2026-06-29 14:18', sensor: 'Water Level', pond: 'Pond B — Catfish', severity: 'healthy', message: 'Water level restored after refill', status: 'Resolved' },
  { id: 'AL-3372', date: '2026-06-28 07:55', sensor: 'Dissolved Oxygen', pond: 'Pond C — Nursery', severity: 'caution', message: 'Oxygen dipped during overnight low', status: 'Resolved' },
  { id: 'AL-3365', date: '2026-06-27 19:40', sensor: 'Water Temperature', pond: 'Pond B — Catfish', severity: 'healthy', message: 'Temperature stabilized after aerator cycle', status: 'Resolved' },
  { id: 'AL-3358', date: '2026-06-27 11:02', sensor: 'Turbidity', pond: 'Pond A — Tilapia', severity: 'critical', message: 'Turbidity spike after sediment disturbance', status: 'Resolved' },
]

export const HISTORY_ROWS = Array.from({ length: 42 }).map((_, i) => {
  const sensor = SENSOR_TYPES[i % SENSOR_TYPES.length]
  const pond = PONDS[i % PONDS.length]
  const day = 30 - (i % 28)
  const val = generateSeries(sensor.id, 1, i + 5)[0]
  return {
    id: `HX-${5200 - i}`,
    date: `2026-06-${String(Math.max(day, 1)).padStart(2, '0')} ${String(6 + (i % 16)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
    pond: pond.name,
    sensor: sensor.name,
    value: `${val} ${sensor.unit}`,
    status: i % 7 === 0 ? 'critical' : i % 4 === 0 ? 'caution' : 'healthy',
  }
})

export const DEVICES = [
  { id: 'DV-01', name: 'Node A — Intake', pond: 'Pond A — Tilapia', battery: 92, signal: 'Strong', status: 'online' },
  { id: 'DV-02', name: 'Node B — Deep Probe', pond: 'Pond B — Catfish', battery: 74, signal: 'Strong', status: 'online' },
  { id: 'DV-03', name: 'Node C — Surface', pond: 'Pond C — Nursery', battery: 38, signal: 'Weak', status: 'online' },
  { id: 'DV-04', name: 'Node D — Outflow', pond: 'Pond A — Tilapia', battery: 61, signal: 'Moderate', status: 'offline' },
]

export const USER = {
  name: 'Rakoto Andriamanana',
  email: 'rakoto@smartfish.io',
  role: 'Farm Operations Lead',
  avatar: 'RA',
}
