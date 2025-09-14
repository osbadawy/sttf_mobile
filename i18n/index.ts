import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import individual translation files
import arCommon from '../locales/ar/common.json';
import arHeartSection from '../locales/ar/components/dashboard/HeartSection.json';
import arSleepSection from '../locales/ar/components/dashboard/SleepSection.json';
import arWellbeingSection from '../locales/ar/components/dashboard/WellbeingSection.json';
import arIndex from '../locales/ar/index.json';
import arLanguage from '../locales/ar/language.json';

import enCommon from '../locales/en/common.json';
import enHeartSection from '../locales/en/components/dashboard/HeartSection.json';
import enSleepSection from '../locales/en/components/dashboard/SleepSection.json';
import enWellbeingSection from '../locales/en/components/dashboard/WellbeingSection.json';
import enIndex from '../locales/en/index.json';
import enLanguage from '../locales/en/language.json';

export const resources = {
  en: {
    common: enCommon,
    home: enIndex,
    language: enLanguage,
    components: {
      dashboard: {
        wellbeingSection: enWellbeingSection,
        sleepSection: enSleepSection,
        heartSection: enHeartSection
      }
    }
  },
  ar: {
    common: arCommon,
    home: arIndex,
    language: arLanguage,
    components: {
      dashboard: {
        wellbeingSection: arWellbeingSection,
        sleepSection: arSleepSection,
        heartSection: arHeartSection
      }
    }
  },
};

// Get device locale
const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';

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
export const isCurrentLanguageRTL = () => isRTL(i18n.language);
export const changeLanguage = (language: string) => i18n.changeLanguage(language);

export default i18n;
