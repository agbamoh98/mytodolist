import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import Login from './Login'
import Register from './Register'
import App from '../App'
import Sidebar from './Sidebar'

const AuthWrapper: React.FC = () => {
  const { isAuthenticated, login } = useAuth()
  const { isRTL } = useLanguage()
  const [showRegister, setShowRegister] = useState(false)

  if (isAuthenticated) {
    return <App />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className={`
        p-4 sm:p-6 lg:p-8 transition-all duration-300 overflow-x-hidden
        ${isRTL ? 'mr-0 sm:mr-48 lg:mr-80' : 'ml-0 sm:ml-48 lg:ml-80'}
        pt-16 sm:pt-8
      `}>
        {showRegister ? (
          <Register
            onRegister={login}
            onSwitchToLogin={() => setShowRegister(false)}
          />
        ) : (
          <Login
            onLogin={login}
            onSwitchToRegister={() => setShowRegister(true)}
          />
        )}
      </div>
    </div>
  )
}

export default AuthWrapper
