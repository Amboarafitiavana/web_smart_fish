// Bridges the sensor_type.name coming from the REST API with the key
// used in MQTT payloads / WebSocket messages, plus display metadata.
// Thresholds mirror backend/app/mqtt/mqtt_client.py THRESHOLDS, which
// itself mirrors the safe ranges already coded into the ESP32 firmware
// (temperatureOK, tdsOK, turbiditeOK, ammoniacOK).
//
// turbidity and ammonia are raw ADC readings (0-4095), not calibrated
// physical units yet. light has no threshold — no safe range has been
// defined for it in the firmware so far.

export const SENSOR_META = {
  temperature: { icon: 'thermometer', unit: '°C', decimals: 1, thresholds: { min: 20, max: 30 } },
  turbidity: { icon: 'droplet', unit: 'raw', decimals: 0, thresholds: { min: 1500 } },
  ammonia: { icon: 'wind', unit: 'raw', decimals: 0, thresholds: { max: 1500 } },
  tds: { icon: 'tds', unit: 'ppm', decimals: 1, thresholds: { min: 100, max: 1000 } },
  light: { icon: 'sun', unit: 'raw', decimals: 0, thresholds: null },
}

const NAME_TO_KEY = {
  'Temperature': 'temperature',
  'Turbidity': 'turbidity',
  'Ammonia (MQ137)': 'ammonia',
  'TDS (Total Dissolved Solids)': 'tds',
  'Light Level': 'light',
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