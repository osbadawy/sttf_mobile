import i18n, { changeLanguage, getCurrentLanguage, resources } from '@/i18n';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface LocalizationContextType {
  currentLanguage: string;
  switchLanguage: (language: string) => void;
  t: (key: string, options?: any) => string;
}

interface NamespacedLocalizationType {
  t: (key: string, options?: any) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

interface LocalizationProviderProps {
  children: ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const { t } = useTranslation(Object.keys(resources[getCurrentLanguage() as keyof typeof resources]));
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

export const useLocalization = (namespace?: string): LocalizationContextType | NamespacedLocalizationType => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  
  if (namespace) {
    // Handle nested namespace access (e.g., 'components.wellbeingSection')
    if (namespace.includes('.')) {
      const [rootNamespace, ...nestedKeys] = namespace.split('.');
      return {
        t: (key: string, options?: any) => {
          // For nested namespaces, we need to access the nested object
          const nestedPath = nestedKeys.join('.');
          return context.t(`${nestedPath}.${key}`, { ...options, ns: rootNamespace });
        }
      };
    } else {
      return {
        t: (key: string, options?: any) => context.t(key, { ...options, ns: namespace })
      };
    }
  }
  
  return context;
};
