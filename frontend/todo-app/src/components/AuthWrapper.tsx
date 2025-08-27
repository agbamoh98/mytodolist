import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import Login from './Login'
import Register from './Register'
import EmailVerification from './EmailVerification'
import ForgotPassword from './ForgotPassword'
import PasswordReset from './PasswordReset'
import App from '../App'
import Sidebar from './Sidebar'

type AuthView = 'login' | 'register' | 'emailVerification' | 'forgotPassword' | 'passwordReset'

const AuthWrapper: React.FC = () => {
  const { isAuthenticated, login } = useAuth()
  const { isRTL } = useLanguage()
  const [currentView, setCurrentView] = useState<AuthView>('login')
  const [verificationData, setVerificationData] = useState<{
    email: string
    username: string
  } | null>(null)

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
        <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
          {currentView === 'login' && (
            <Login
              onLogin={login}
              onSwitchToRegister={() => setCurrentView('register')}
              onForgotPassword={() => setCurrentView('forgotPassword')}
            />
          )}
          
          {currentView === 'register' && (
            <Register
              onRegister={(userData) => {
                setVerificationData({
                  email: userData.email,
                  username: userData.username
                })
                setCurrentView('emailVerification')
              }}
              onSwitchToLogin={() => setCurrentView('login')}
            />
          )}
          
          {currentView === 'emailVerification' && verificationData && (
            <EmailVerification
              email={verificationData.email}
              username={verificationData.username}
              onVerificationComplete={() => {
                setVerificationData(null)
                setCurrentView('login')
              }}
              onResendCode={() => {
                // The EmailVerification component handles resending internally
              }}
            />
          )}
          
          {currentView === 'forgotPassword' && (
            <ForgotPassword
              onBackToLogin={() => setCurrentView('login')}
              onCodeSent={(email, username) => {
                setVerificationData({ email, username })
                setCurrentView('passwordReset')
              }}
            />
          )}
          
          {currentView === 'passwordReset' && verificationData && (
            <PasswordReset
              email={verificationData.email}
              username={verificationData.username}
              onResetComplete={() => {
                setVerificationData(null)
                setCurrentView('login')
              }}
              onBackToLogin={() => {
                setVerificationData(null)
                setCurrentView('login')
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthWrapper
