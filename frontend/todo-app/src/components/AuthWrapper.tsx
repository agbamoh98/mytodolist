import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Login from './Login'
import Register from './Register'
import App from '../App'

const AuthWrapper: React.FC = () => {
  const { isAuthenticated, login } = useAuth()
  const [showRegister, setShowRegister] = useState(false)

  if (isAuthenticated) {
    return <App />
  }

  return (
    <>
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
    </>
  )
}

export default AuthWrapper
