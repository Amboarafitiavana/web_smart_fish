import apiClient from './apiClient'

export const sensorService = {
  getAll: () => apiClient.get('/sensors'),
  getById: (sensorId) => apiClient.get(`/sensors/${sensorId}`),
}