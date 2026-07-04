import apiClient from './apiClient'

export const alertService = {
  getAll: (filters) => apiClient.get('/alerts', { params: filters }),
  acknowledge: (alertId) => apiClient.patch(`/alerts/${alertId}`, { status: 'Acknowledged' }),
}
