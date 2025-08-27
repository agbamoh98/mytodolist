import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-64 bg-red-500 shadow-lg border-r border-gray-200 z-50 transition-all duration-300`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-white">
            📝 {t('common.welcome') || 'Welcome'}
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <a
            href="#dashboard"
            className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-red-600 rounded-lg transition-colors duration-200"
          >
            <span>🏠</span>
            <span>{t('sidebar.dashboard') || 'Dashboard'}</span>
          </a>
          
          <a
            href="#todos"
            className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-red-600 rounded-lg transition-colors duration-200"
          >
            <span>✅</span>
            <span>{t('sidebar.todos') || 'My Todos'}</span>
          </a>
          
          <a
            href="#settings"
            className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-red-600 rounded-lg transition-colors duration-200"
          >
            <span>⚙️</span>
            <span>{t('sidebar.settings') || 'Settings'}</span>
          </a>
        </nav>

        {/* Language Selector */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-white mb-3">
            {t('sidebar.language') || 'Language'}
          </h3>
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
