import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import AuthLayout from './layouts/AuthLayout'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Sensors from './pages/Sensors'
import Analytics from './pages/Analytics'
import Alerts from './pages/Alerts'
import History from './pages/History'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
            </Route>

            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/sensors" element={<Sensors />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/history" element={<History />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
