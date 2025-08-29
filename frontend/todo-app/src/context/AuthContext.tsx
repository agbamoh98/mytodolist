import React, { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react'

interface User {
  id: number
  username: string
  email: string
  firstName?: string
  lastName?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (userData: any) => void
  logout: () => void
  isAuthenticated: boolean
  extendSession: () => void
  timeUntilLogout: number | null
  showLogoutWarning: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  
  // Auto-logout timeout configuration
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds
  const WARNING_TIME = 5 * 60 * 1000 // 5 minutes warning before logout
  
  // Timeout state
  const [timeUntilLogout, setTimeUntilLogout] = useState<number | null>(null)
  const [showLogoutWarning, setShowLogoutWarning] = useState(false)
  
  // Refs for timers - use number for browser compatibility
  const logoutTimerRef = useRef<number | null>(null)
  const warningTimerRef = useRef<number | null>(null)
  const activityTimerRef = useRef<number | null>(null)

  // Calculate authentication status
  const isAuthenticated = !!user && !!token

  // Clear all timers function
  const clearAllTimers = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current)
      logoutTimerRef.current = null
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current)
      warningTimerRef.current = null
    }
    if (activityTimerRef.current) {
      clearTimeout(activityTimerRef.current)
      activityTimerRef.current = null
    }
  }, [])

  // Reset warning state function
  const resetWarningState = useCallback(() => {
    setShowLogoutWarning(false)
    setTimeUntilLogout(null)
  }, [])

  // Logout function
  const logout = useCallback(() => {
    console.log('Logging out user:', user?.username)
    
    // Clear timers
    clearAllTimers()
    
    // Reset timeout state
    resetWarningState()
    
    setUser(null)
    setToken(null)
    
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }, [user?.username, clearAllTimers, resetWarningState])

  // Activity detection function
  const resetActivityTimer = useCallback(() => {
    if (!isAuthenticated) return
    
    // Clear existing timers
    clearAllTimers()
    
    // Reset warning state
    resetWarningState()
    
    // Set new activity timer
    activityTimerRef.current = setTimeout(() => {
      // User has been inactive, start warning countdown
      setShowLogoutWarning(true)
      setTimeUntilLogout(WARNING_TIME / 1000) // Convert to seconds
      
      // Start countdown
      const countdownInterval = setInterval(() => {
        setTimeUntilLogout(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownInterval)
            logout() // Auto-logout
            return null
          }
          return prev - 1
        })
      }, 1000)
      
      // Set logout timer
      logoutTimerRef.current = setTimeout(() => {
        clearInterval(countdownInterval)
        logout()
      }, WARNING_TIME)
      
    }, INACTIVITY_TIMEOUT - WARNING_TIME)
  }, [isAuthenticated, clearAllTimers, resetWarningState, logout, WARNING_TIME, INACTIVITY_TIMEOUT])

  // Extend session function
  const extendSession = useCallback(() => {
    if (isAuthenticated) {
      resetActivityTimer()
    }
  }, [isAuthenticated, resetActivityTimer])

  // Activity event handlers
  useEffect(() => {
    if (!isAuthenticated) return

    const handleActivity = () => {
      resetActivityTimer()
    }

    // Add activity event listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true })
    })

    // Start activity timer
    resetActivityTimer()

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
      clearAllTimers()
    }
  }, [isAuthenticated, resetActivityTimer, clearAllTimers])

  // Check for existing auth on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(userData)
        console.log('Restored auth from localStorage:', userData.username)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        // Clear corrupted data
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }, [])

  const login = (userData: any) => {
    console.log('Login successful:', userData)
    setUser({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName
    })
    setToken(userData.token)
    
    // Store in localStorage
    localStorage.setItem('token', userData.token)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    extendSession,
    timeUntilLogout,
    showLogoutWarning
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
