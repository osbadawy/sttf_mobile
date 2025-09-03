import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from '../locales/ar.json';
import en from '../locales/en.json';

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

// Get device locale
const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';

// Determine if the locale is RTL
const isRTL = (locale: string) => {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(locale);
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLocale,
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    react: {
      useSuspense: false, // Disable suspense for React Native
    },
  });

// Export helper functions
export const getCurrentLanguage = () => i18n.language;
export const isCurrentLanguageRTL = () => isRTL(i18n.language);
export const changeLanguage = (language: string) => i18n.changeLanguage(language);

export default i18n;
