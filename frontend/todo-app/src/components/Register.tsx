import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'

interface RegisterProps {
  onRegister: (userData: any) => void
  onSwitchToLogin: () => void
}

const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchToLogin }) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('') // Clear error when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('https://mytodolist-production.up.railway.app/api/auth/register', formData)
      console.log('Registration successful:', response.data)
      
      // The AuthContext will handle localStorage storage
      onRegister(response.data)
      
      // Clear the form
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: ''
      })
    } catch (error: any) {
      console.error('Registration failed:', error)
      setError(error.response?.data?.message || t('auth.registerError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {t('auth.joinUs')} 🚀
        </h1>
        <p className="text-gray-600">{t('auth.createAccount')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.firstName')}
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 hover:bg-white text-sm"
              placeholder={t('auth.firstNamePlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.lastName')}
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 hover:bg-white text-sm"
              placeholder={t('auth.lastNamePlaceholder')}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.username')} *
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 hover:bg-white text-sm"
            placeholder={t('auth.usernamePlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.email')} *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 hover:bg-white text-sm"
            placeholder={t('auth.emailPlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.password')} *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 hover:bg-white text-sm"
            placeholder={t('auth.passwordPlaceholder')}
          />
          <p className="text-xs text-gray-500 mt-1">{t('auth.passwordMinLength')}</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium mt-6"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              {t('auth.creatingAccount')}
            </div>
          ) : (
            t('auth.createAccount')
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          {t('auth.haveAccount')}{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {t('auth.signInHere')}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Register
