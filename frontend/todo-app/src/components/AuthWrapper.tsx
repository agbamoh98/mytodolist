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

  // Debug logging
  console.log('AuthWrapper render - isAuthenticated:', isAuthenticated);
  console.log('AuthWrapper render - isRTL:', isRTL);

  if (isAuthenticated) {
    return <App />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Sidebar */}
      <div className="bg-blue-500 p-2 text-white">DEBUG: Sidebar should be here</div>
      <Sidebar />
      
      {/* Main Content */}
      <div className={`${isRTL ? 'mr-64' : 'ml-64'} p-8`}>
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
