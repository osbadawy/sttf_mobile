import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import individual translation files
import arCommon from '../locales/ar/common.json';
// import arExplore from '../locales/ar/explore.json';
// import arIndex from '../locales/ar/index.json';
// import arLanguage from '../locales/ar/language.json';

import enCommon from '../locales/en/common.json';
// import enExplore from '../locales/en/explore.json';
// import enIndex from '../locales/en/index.json';
// import enLanguage from '../locales/en/language.json';

// export const resources = {
//   en: {
//     common: enCommon,
//     home: enIndex,
//     explore: enExplore,
//     language: enLanguage,
//   },
//   ar: {
//     common: arCommon,
//     home: arIndex,
//     explore: arExplore,
//     language: arLanguage,
//   },
// };

export const resources = {
  en: {
    common: enCommon,
  },
  ar: {
    common: arCommon,
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
