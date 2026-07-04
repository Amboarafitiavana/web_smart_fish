import apiClient from './apiClient'

export const reportService = {
  generate: (type) => apiClient.post('/reports/generate', { type }),
  download: (reportId) => apiClient.get(`/reports/${reportId}/download`, { responseType: 'blob' }),
}
