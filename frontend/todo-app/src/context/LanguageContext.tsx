import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, supportedLanguages, isRTL } from '../i18n';

// Language context interface
interface LanguageContextType {
  currentLanguage: string;
  currentDirection: string;
  isRTL: boolean;
  changeLanguage: (language: string) => Promise<void>;
  supportedLanguages: typeof supportedLanguages;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [currentDirection, setCurrentDirection] = useState<string>('ltr');

  // Initialize language on component mount
  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng') || 'en';
    setCurrentLanguage(savedLang);
    
    const langConfig = supportedLanguages[savedLang as keyof typeof supportedLanguages];
    if (langConfig) {
      setCurrentDirection(langConfig.dir);
    }
  }, []);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
      const langConfig = supportedLanguages[lng as keyof typeof supportedLanguages];
      if (langConfig) {
        setCurrentDirection(langConfig.dir);
      }
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // Function to change language
  const handleLanguageChange = async (language: string) => {
    try {
      await changeLanguage(language);
      setCurrentLanguage(language);
      
      const langConfig = supportedLanguages[language as keyof typeof supportedLanguages];
      if (langConfig) {
        setCurrentDirection(langConfig.dir);
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    currentDirection,
    isRTL: isRTL(),
    changeLanguage: handleLanguageChange,
    supportedLanguages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
