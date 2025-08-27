import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 h-full bg-white shadow-lg border-r border-gray-200 z-40 transition-all duration-300
        ${isRTL ? 'right-0' : 'left-0'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 sm:w-48 lg:w-64
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              📝 {t('common.welcome') || 'Welcome'}
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 sm:p-4 space-y-2">
            <a
              href="#dashboard"
              className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              <span>🏠</span>
              <span className="hidden sm:inline">{t('sidebar.dashboard') || 'Dashboard'}</span>
              <span className="sm:hidden">🏠</span>
            </a>
            
            <a
              href="#todos"
              className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              <span>✅</span>
              <span className="hidden sm:inline">{t('sidebar.todos') || 'My Todos'}</span>
              <span className="sm:hidden">✅</span>
            </a>
            
            <a
              href="#settings"
              className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              <span>⚙️</span>
              <span className="hidden sm:inline">{t('sidebar.settings') || 'Settings'}</span>
              <span className="sm:hidden">⚙️</span>
            </a>
          </nav>

          {/* Language Selector */}
          <div className="p-3 sm:p-4 border-t border-gray-200">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2 sm:mb-3">
              {t('sidebar.language') || 'Language'}
            </h3>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
