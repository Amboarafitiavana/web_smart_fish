import { createContext, useContext, useState } from 'react'
import { USER } from '../utils/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (localStorage.getItem('smartfish-auth') ? USER : null))

  const login = async (_email, _password) => {
    // Frontend-only stub. Swap for services/auth.js once the API exists.
    await new Promise((r) => setTimeout(r, 700))
    localStorage.setItem('smartfish-auth', '1')
    setUser(USER)
    return true
  }

  const logout = () => {
    localStorage.removeItem('smartfish-auth')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
