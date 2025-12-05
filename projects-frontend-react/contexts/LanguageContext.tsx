import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { TRANSLATIONS, Language } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof TRANSLATIONS['en'];
}

// Detect language from URL path
const detectLanguageFromUrl = (pathname: string): Language => {
  return pathname.startsWith('/ta') ? 'ta' : 'en';
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Component to sync language with React Router location
// This must be placed inside the Router component
export const LanguageSync: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('LanguageSync must be used within LanguageProvider');
  }

  const { setLanguage } = context;

  // Update language whenever location changes
  useEffect(() => {
    const newLanguage = detectLanguageFromUrl(location.pathname);
    setLanguage(newLanguage);
  }, [location.pathname, setLanguage]);

  return <>{children}</>;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with current pathname (works even outside Router)
  const [language, setLanguage] = useState<Language>(() => 
    detectLanguageFromUrl(window.location.pathname)
  );

  const value = {
    language,
    setLanguage,
    t: TRANSLATIONS[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
