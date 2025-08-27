import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'

interface ForgotPasswordProps {
  onBackToLogin: () => void
  onCodeSent: (email: string, username: string) => void
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin, onCodeSent }) => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await axios.post('https://mytodolist-production.up.railway.app/api/auth/forgot-password', {
        email,
        username
      })
      
      setSuccess(t('auth.resetCodeSent'))
      setTimeout(() => {
        onCodeSent(email, username)
      }, 2000)
    } catch (error: any) {
      console.error('Forgot password failed:', error)
      setError(error.response?.data?.message || t('auth.forgotPasswordError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🔐</div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {t('auth.forgotPassword')}
        </h1>
        <p className="text-gray-600">{t('auth.forgotPasswordDescription')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            {success}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.email')} *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 hover:bg-white text-sm"
            placeholder={t('auth.emailPlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.username')} *
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 hover:bg-white text-sm"
            placeholder={t('auth.usernamePlaceholder')}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              {t('auth.sendingResetCode')}
            </div>
          ) : (
            t('auth.sendResetCode')
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onBackToLogin}
          className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          {t('auth.backToLogin')}
        </button>
      </div>
    </div>
  )
}

export default ForgotPassword
