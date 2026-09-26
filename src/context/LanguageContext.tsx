import React, { createContext, useContext, useEffect, useState } from 'react';
import { TRANSLATIONS, SiteTranslations } from '../data/translations';

export type Language = 'ar' | 'en';

export type TranslationObject = ((key: string) => string) & SiteTranslations;

interface LanguageContextType {
  language: Language;
  direction: 'rtl' | 'ltr';
  isArabic: boolean;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: TranslationObject;
  translate: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('raba_language');
      if (saved === 'ar' || saved === 'en') {
        return saved;
      }
      return 'ar'; // Default to Arabic
    } catch {
      return 'ar';
    }
  });

  const direction = language === 'ar' ? 'rtl' : 'ltr';
  const isArabic = language === 'ar';
  const currentTranslations = TRANSLATIONS[language] || TRANSLATIONS.ar;

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', language);
    root.setAttribute('dir', direction);

    try {
      localStorage.setItem('raba_language', language);
    } catch (e) {
      console.error(e);
    }
  }, [language, direction]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const translate = (key: string): string => {
    const parts = key.split('.');
    let cur: any = currentTranslations;
    for (const part of parts) {
      if (cur && typeof cur === 'object' && part in cur) {
        cur = cur[part];
      } else {
        return key;
      }
    }
    return typeof cur === 'string' ? cur : key;
  };

  // Create combined function & object
  const tFunction = ((key: string) => translate(key)) as TranslationObject;
  Object.assign(tFunction, currentTranslations);

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        isArabic,
        toggleLanguage,
        setLanguage,
        t: tFunction,
        translate,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
