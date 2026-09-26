import React, { createContext, useContext, useState, useEffect } from 'react';
import arTranslations from '../locales/ar.json';
import enTranslations from '../locales/en.json';
import kuTranslations from '../locales/ku.json';
import trTranslations from '../locales/tr.json';

const LanguageContext = createContext();

const translationsMap = {
  ar: arTranslations,
  en: enTranslations,
  ku: kuTranslations,
  tr: trTranslations
};

export const LANGUAGES = [
  { code: 'ar', label: 'العربية', native: 'العربية', dir: 'rtl', country: 'IQ' },
  { code: 'en', label: 'English', native: 'English', dir: 'ltr', country: 'US' },
  { code: 'ku', label: 'Kurdî (سۆرانی)', native: 'کوردی سۆرانی', dir: 'rtl', country: 'KR' },
  { code: 'tr', label: 'Türkçe', native: 'Türkçe', dir: 'ltr', country: 'TR' }
];

export const LanguageProvider = ({ children }) => {
  // Check if visitor has selected language previously
  const savedLang = localStorage.getItem('sanaria_language');
  const hasSelected = localStorage.getItem('sanaria_language_selected') === 'true';

  const [language, setLanguage] = useState(savedLang || 'ar');
  const [direction, setDirection] = useState(savedLang && (savedLang === 'en' || savedLang === 'tr') ? 'ltr' : 'rtl');
  const [showLanguageGate, setShowLanguageGate] = useState(!hasSelected);
  const [showChangeModal, setShowChangeModal] = useState(false);

  // Apply direction to HTML document
  useEffect(() => {
    const isRtl = language === 'ar' || language === 'ku';
    const newDir = isRtl ? 'rtl' : 'ltr';
    setDirection(newDir);
    document.documentElement.setAttribute('dir', newDir);
    document.documentElement.setAttribute('lang', language);
    document.body.className = isRtl ? 'rtl-layout' : 'ltr-layout';
  }, [language]);

  const selectLanguage = (code, fromGate = true) => {
    setLanguage(code);
    localStorage.setItem('sanaria_language', code);
    localStorage.setItem('sanaria_language_selected', 'true');
    const isRtl = code === 'ar' || code === 'ku';
    const newDir = isRtl ? 'rtl' : 'ltr';
    setDirection(newDir);
    document.documentElement.setAttribute('dir', newDir);
    document.documentElement.setAttribute('lang', code);
    
    if (fromGate) {
      setShowLanguageGate(false);
      // Trigger walkthrough for first time
      sessionStorage.setItem('sanaria_start_walkthrough', 'true');
    }
    setShowChangeModal(false);
  };

  const openChangeLanguageModal = () => {
    setShowChangeModal(true);
  };

  const closeChangeLanguageModal = () => {
    setShowChangeModal(false);
  };

  // Translation lookup helper (supports nested keys like 'hero.title')
  const t = (path) => {
    if (!path) return '';
    const keys = path.split('.');
    let current = translationsMap[language] || translationsMap['ar'];
    
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English, then Arabic
        let fallback = translationsMap['en'];
        for (const fbKey of keys) {
          if (fallback && fallback[fbKey] !== undefined) {
            fallback = fallback[fbKey];
          } else {
            fallback = null;
            break;
          }
        }
        return fallback !== null ? fallback : path;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        isRtl: direction === 'rtl',
        showLanguageGate,
        showChangeModal,
        selectLanguage,
        openChangeLanguageModal,
        closeChangeLanguageModal,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
