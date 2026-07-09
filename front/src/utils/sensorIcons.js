import { FiThermometer, FiDroplet, FiWind, FiSun } from 'react-icons/fi'
import { GiWaterDrop, GiWaveCrest } from 'react-icons/gi'

export const SENSOR_ICONS = {
  thermometer: FiThermometer,
  droplet: FiDroplet,
  wind: FiWind,
  sun: FiSun,
  tds: GiWaterDrop,
  // Conservées pour compatibilité avec utils/mockData.js (page Sensors,
  // toujours sur données simulées, indépendante des vrais capteurs ESP32)
  flask: GiWaterDrop,
  waves: GiWaveCrest,
}