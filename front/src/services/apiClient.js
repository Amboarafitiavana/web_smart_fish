import axios from 'axios'

// Base URL for the FastAPI backend. Falls back to the local dev server
// with the correct /api/v1 prefix if VITE_API_BASE_URL isn't set.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

// Derived WebSocket URL: same host/port, http(s) -> ws(s), same /api/v1
// prefix, pointing at the real-time endpoint registered in the backend.
export const WS_URL = `${API_BASE_URL.replace(/^http/, 'ws')}/ws/live`

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartfish-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('smartfish-token')
    }
    return Promise.reject(error)
  }
)

export default apiClient