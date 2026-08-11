import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/authApi'
import type { LoginRequest, RegisterRequest, UserDto } from '../types/api'

interface AuthContextType {
  user: UserDto | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (payload: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(() => {
    const savedUser = localStorage.getItem('bail_reckoner_user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('bail_reckoner_token')
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('bail_reckoner_token')
      if (storedToken) {
        try {
          const currentUser = await authApi.getCurrentUser()
          setUser(currentUser)
          localStorage.setItem('bail_reckoner_user', JSON.stringify(currentUser))
        } catch (err) {
          console.error('Failed to fetch current user, clearing auth:', err)
          localStorage.removeItem('bail_reckoner_token')
          localStorage.removeItem('bail_reckoner_user')
          setToken(null)
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginRequest) => {
    const res = await authApi.login(credentials)
    setToken(res.token)
    setUser(res.user)
    localStorage.setItem('bail_reckoner_token', res.token)
    localStorage.setItem('bail_reckoner_user', JSON.stringify(res.user))
  }

  const register = async (payload: RegisterRequest) => {
    const res = await authApi.register(payload)
    setToken(res.token)
    setUser(res.user)
    localStorage.setItem('bail_reckoner_token', res.token)
    localStorage.setItem('bail_reckoner_user', JSON.stringify(res.user))
  }

  const logout = () => {
    localStorage.removeItem('bail_reckoner_token')
    localStorage.removeItem('bail_reckoner_user')
    setToken(null)
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
