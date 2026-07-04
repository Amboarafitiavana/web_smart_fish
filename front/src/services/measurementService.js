import apiClient from './apiClient'

export const measurementService = {
  listBySensor: (sensorId, params = {}) =>
    apiClient.get(`/measurements/sensor/${sensorId}`, { params }),
}