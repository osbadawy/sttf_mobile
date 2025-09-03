import i18n, { changeLanguage, getCurrentLanguage } from '@/i18n';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LocalizationContextType {
  currentLanguage: string;
  switchLanguage: (language: string) => void;
  t: (key: string, options?: any) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

interface LocalizationProviderProps {
  children: ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const { t } = useTranslation(['common', 'home', 'explore', 'language']);
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());

  const switchLanguage = async (language: string) => {
    try {
      console.log('Context: Switching language to', language);
      await changeLanguage(language);
      console.log('Context: Language changed, current language:', getCurrentLanguage());
      setCurrentLanguage(language);
    } catch (error) {
      console.error('Error switching language:', error);
    }
  };

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage());

    // Listen to language changes
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const value: LocalizationContextType = {
    currentLanguage,
    switchLanguage,
    t,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
