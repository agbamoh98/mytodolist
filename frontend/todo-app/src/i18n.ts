import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import heTranslations from './locales/he.json';
import arTranslations from './locales/ar.json';

// Define supported languages
export const supportedLanguages = {
  en: { name: 'English', flag: '🇺🇸', dir: 'ltr' },
  he: { name: 'עברית', flag: '🇮🇱', dir: 'rtl' },
  ar: { name: 'العربية', flag: '🇸🇦', dir: 'rtl' }
};

// Configure i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Available languages
    resources: {
      en: {
        translation: enTranslations
      },
      he: {
        translation: heTranslations
      },
      ar: {
        translation: arTranslations
      }
    },

    // Default language
    fallbackLng: 'en',

    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },

    // Interpolation options
    interpolation: {
      escapeValue: false // React already escapes values
    },

    // React options
    react: {
      useSuspense: false
    },

    // Debug mode (set to false in production)
    debug: false
  });

// Function to change language and update document direction
export const changeLanguage = async (language: string) => {
  await i18n.changeLanguage(language);
  
  // Update document direction for RTL languages
  const langConfig = supportedLanguages[language as keyof typeof supportedLanguages];
  if (langConfig) {
    document.documentElement.dir = langConfig.dir;
    document.documentElement.lang = language;
  }
  
  // Save language preference
  localStorage.setItem('i18nextLng', language);
};

// Function to get current language direction
export const getCurrentLanguageDirection = (): string => {
  const currentLang = i18n.language;
  const langConfig = supportedLanguages[currentLang as keyof typeof supportedLanguages];
  return langConfig?.dir || 'ltr';
};

// Function to check if current language is RTL
export const isRTL = (): boolean => {
  return getCurrentLanguageDirection() === 'rtl';
};

// Initialize document direction on app start
const initializeLanguageDirection = () => {
  const savedLang = localStorage.getItem('i18nextLng') || 'en';
  const langConfig = supportedLanguages[savedLang as keyof typeof supportedLanguages];
  if (langConfig) {
    document.documentElement.dir = langConfig.dir;
    document.documentElement.lang = savedLang;
  }
};

// Set initial language direction
initializeLanguageDirection();

export default i18n;
