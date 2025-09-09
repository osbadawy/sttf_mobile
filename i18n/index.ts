import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import individual translation files
import arHome from '../locales/ar/home.json';

import enHome from '../locales/en/home.json';

export const resources = {
  en: {
    home: enHome,
  },
  ar: {
    home: arHome,
  },
};

// Get device locale
const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';



i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLocale,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: Object.keys(resources[deviceLocale as keyof typeof resources]),
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    react: {
      useSuspense: false, // Disable suspense for React Native
    },
  });

// Export helper functions
export const getCurrentLanguage = () => i18n.language;
export const changeLanguage = (language: string) => i18n.changeLanguage(language);

export default i18n;
