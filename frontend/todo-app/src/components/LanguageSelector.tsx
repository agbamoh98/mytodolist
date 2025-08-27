import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = async (language: string) => {
    await changeLanguage(language);
    setIsOpen(false);
  };

  const currentLangConfig = supportedLanguages[currentLanguage as keyof typeof supportedLanguages];

  return (
    <div className="relative">
      {/* Language Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 w-full text-left"
        aria-label={t('sidebar.language')}
      >
        <span className="text-xl">{currentLangConfig?.flag}</span>
        <span className="font-medium">{currentLangConfig?.name}</span>
        <svg
          className={`w-4 h-4 ml-auto transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Language Dropdown */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {Object.entries(supportedLanguages).map(([code, config]) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={`flex items-center space-x-3 px-4 py-3 w-full text-left hover:bg-gray-50 transition-colors duration-200 ${
                currentLanguage === code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              } ${code === 'he' || code === 'ar' ? 'text-right' : 'text-left'}`}
            >
              <span className="text-xl">{config.flag}</span>
              <span className="font-medium">{config.name}</span>
              {currentLanguage === code && (
                <svg
                  className="w-4 h-4 ml-auto text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSelector;
