// Bridges the sensor_type.name coming from the REST API with the key
// used in MQTT payloads / WebSocket messages, plus display metadata.
// Thresholds are a deliberate mirror of backend/app/mqtt/mqtt_client.py
// THRESHOLDS — kept here so the UI colors a card the same way the
// backend decides to raise an alert for it.

export const SENSOR_META = {
  temperature: { icon: 'thermometer', unit: '°C', decimals: 1, thresholds: { min: 24, max: 30 } },
  turbidity: { icon: 'droplet', unit: 'NTU', decimals: 1, thresholds: { max: 20 } },
  ph: { icon: 'flask', unit: 'pH', decimals: 2, thresholds: { min: 6.5, max: 8.0 } },
  oxygen: { icon: 'wind', unit: 'mg/L', decimals: 1, thresholds: { min: 5 } },
  water_level: { icon: 'waves', unit: 'cm', decimals: 0, thresholds: { min: 20 } },
}

const NAME_TO_KEY = {
  'Temperature': 'temperature',
  'Turbidity': 'turbidity',
  'pH': 'ph',
  'Dissolved Oxygen': 'oxygen',
  'Water Level': 'water_level',
}

export function keyFromTypeName(name) {
  return NAME_TO_KEY[name] || name.toLowerCase().replace(/\s+/g, '_')
}

export function computeStatus(key, value) {
  const rule = SENSOR_META[key]?.thresholds
  if (!rule || value === null || value === undefined) return 'healthy'

  if ('min' in rule && value < rule.min) {
    return value < rule.min * 0.8 ? 'critical' : 'caution'
  }
  if ('max' in rule && value > rule.max) {
    return value > rule.max * 1.2 ? 'critical' : 'caution'
  }
  return 'healthy'
}