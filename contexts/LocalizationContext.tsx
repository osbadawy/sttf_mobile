import i18n, { changeLanguage, getCurrentLanguage, isCurrentLanguageRTL } from '@/i18n';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nManager } from 'react-native';

interface LocalizationContextType {
  currentLanguage: string;
  isRTL: boolean;
  switchLanguage: (language: string) => void;
  t: (key: string, options?: any) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

interface LocalizationProviderProps {
  children: ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const [isRTL, setIsRTL] = useState(isCurrentLanguageRTL());

  const switchLanguage = async (language: string) => {
    try {
      console.log('Context: Switching language to', language);
      await changeLanguage(language);
      console.log('Context: Language changed, current language:', getCurrentLanguage());
      setCurrentLanguage(language);
      setIsRTL(isCurrentLanguageRTL());
      
      // Force RTL layout change if needed
      if (I18nManager.isRTL !== isCurrentLanguageRTL()) {
        I18nManager.allowRTL(isCurrentLanguageRTL());
        I18nManager.forceRTL(isCurrentLanguageRTL());
        // Note: App restart is required for RTL changes to take effect
        // You might want to show a message to the user about restarting
      }
    } catch (error) {
      console.error('Error switching language:', error);
    }
  };

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage());
    setIsRTL(isCurrentLanguageRTL());

    // Listen to language changes
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
      setIsRTL(isCurrentLanguageRTL());
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const value: LocalizationContextType = {
    currentLanguage,
    isRTL,
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
