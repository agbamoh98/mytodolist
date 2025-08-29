import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

const LogoutWarning: React.FC = () => {
  const { t } = useTranslation()
  const { showLogoutWarning, timeUntilLogout, extendSession } = useAuth()

  if (!showLogoutWarning) return null

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            {t('auth.sessionTimeoutWarning')}
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              {t('auth.youWillBeLoggedOutIn')} <span className="font-bold">{timeUntilLogout}</span> {t('auth.seconds')}
            </p>
            <p className="mt-1">
              {t('auth.clickAnywhereToExtend')}
            </p>
          </div>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={extendSession}
              className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors"
            >
              {t('auth.extendSession')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogoutWarning
