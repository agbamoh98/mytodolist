import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'

interface EmailVerificationProps {
  email: string
  username: string
  onVerificationComplete: () => void
  onResendCode: () => void
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ 
  email, 
  username, 
  onVerificationComplete, 
  onResendCode 
}) => {
  const { t } = useTranslation()
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await axios.post('https://mytodolist-production.up.railway.app/api/auth/verify-email', {
        email,
        code: verificationCode
      })
      
      setSuccess(t('auth.emailVerifiedSuccess'))
      setTimeout(() => {
        onVerificationComplete()
      }, 2000)
    } catch (error: any) {
      console.error('Email verification failed:', error)
      setError(error.response?.data?.message || t('auth.verificationError'))
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setResendLoading(true)
    setError('')
    setSuccess('')

    try {
      await axios.post('https://mytodolist-production.up.railway.app/api/auth/resend-verification', {
        email,
        username
      })
      
      setSuccess(t('auth.verificationCodeSent'))
    } catch (error: any) {
      console.error('Resend verification failed:', error)
      setError(error.response?.data?.message || t('auth.resendError'))
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">📧</div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {t('auth.verifyEmail')}
        </h1>
        <p className="text-gray-600">
          {t('auth.verificationSentTo')} <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
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
            {t('auth.verificationCode')}
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            maxLength={6}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 hover:bg-white text-sm text-center text-2xl tracking-widest"
            placeholder="000000"
          />
          <p className="text-xs text-gray-500 mt-1">{t('auth.enter6DigitCode')}</p>
        </div>

        <button
          type="submit"
          disabled={loading || verificationCode.length !== 6}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              {t('auth.verifying')}
            </div>
          ) : (
            t('auth.verifyEmail')
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm mb-2">
          {t('auth.didntReceiveCode')}
        </p>
        <button
          onClick={handleResendCode}
          disabled={resendLoading}
          className="text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50"
        >
          {resendLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
              {t('auth.sending')}
            </div>
          ) : (
            t('auth.resendCode')
          )}
        </button>
      </div>
    </div>
  )
}

export default EmailVerification
