import { createContext, useContext, useState, useEffect } from 'react'
import { verifyToken, login as apiLogin } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    verifyToken()
      .then((payload) => {
        if (payload) setUser(payload)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (emailOrUsername, password) => {
    const data = await apiLogin(emailOrUsername, password)
    localStorage.setItem('authToken', data.authToken)
    const payload = await verifyToken()
    setUser(payload)
  }

  const updateUser = (userData) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null))
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
  }

  const value = {
    user,
    isAdmin: user?.isAdmin ?? false,
    isLoggedIn: !!user,
    loading,
    login,
    logout,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
