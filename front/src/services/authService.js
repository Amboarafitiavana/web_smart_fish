import apiClient from './apiClient'

export const authService = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  me: () => apiClient.get('/auth/me'),
}
