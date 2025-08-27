import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Reset mobile menu state when language direction changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [isRTL]);

  // Desktop sidebar should always be visible
  // Mobile sidebar should slide from the correct side
  const getSidebarClasses = () => {
    const baseClasses = 'fixed top-0 h-full bg-white shadow-lg transition-all duration-300 w-80 sm:w-48 lg:w-80';
    
    // Positioning (left/right)
    const positioning = isRTL ? 'right-0 border-l border-gray-200' : 'left-0 border-r border-gray-200';
    
    // Mobile translation logic
    let mobileTranslation = '';
    if (isMobileOpen) {
      mobileTranslation = 'translate-x-0'; // Always visible when open
    } else {
      // Hidden on mobile, visible on desktop
      mobileTranslation = isRTL ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0';
    }
    
    // Z-index
    const zIndex = isMobileOpen ? 'z-50' : 'lg:z-40';
    
    return `${baseClasses} ${positioning} ${mobileTranslation} ${zIndex}`;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`lg:hidden fixed top-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors ${
          isRTL ? 'right-4' : 'left-4'
        }`}
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
      <div className={getSidebarClasses()}>
        <div className={`flex flex-col h-full ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Header */}
          <div className={`p-4 sm:p-6 border-b border-gray-200 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              📝 {t('common.welcome') || 'Welcome'}
            </h2>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 p-3 sm:p-4 space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            <a
              href="#dashboard"
              className={`flex items-center px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm sm:text-base ${
                isRTL ? 'flex-row-reverse space-x-reverse space-x-2 sm:space-x-3' : 'space-x-2 sm:space-x-3'
              }`}
            >
              <span>🏠</span>
              <span className="hidden sm:inline">{t('sidebar.dashboard') || 'Dashboard'}</span>
              <span className="sm:hidden">{t('sidebar.dashboard') || 'Dashboard'}</span>
            </a>
            
            <a
              href="#todos"
              className={`flex items-center px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm sm:text-base ${
                isRTL ? 'flex-row-reverse space-x-reverse space-x-2 sm:space-x-3' : 'space-x-2 sm:space-x-3'
              }`}
            >
              <span>✅</span>
              <span className="hidden sm:inline">{t('sidebar.todos') || 'My Todos'}</span>
              <span className="sm:hidden">{t('sidebar.todos') || 'My Todos'}</span>
            </a>
            
            <a
              href="#settings"
              className={`flex items-center px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm sm:text-base ${
                isRTL ? 'flex-row-reverse space-x-reverse space-x-2 sm:space-x-3' : 'space-x-2 sm:space-x-3'
              }`}
            >
              <span>⚙️</span>
              <span className="hidden sm:inline">{t('sidebar.settings') || 'Settings'}</span>
              <span className="sm:hidden">{t('sidebar.settings') || 'Settings'}</span>
            </a>
          </nav>

          {/* Language Selector */}
          <div className={`p-3 sm:p-4 border-t border-gray-200 ${isRTL ? 'text-right' : 'text-left'}`}>
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
