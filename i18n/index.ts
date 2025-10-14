import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import individual translation files
import arActivities from "../locales/ar/activities.json";
import arCommon from "../locales/ar/common.json";
import arActivitiesActivityCard from "../locales/ar/components/activities/ActivityCard.json";
import arActivitiesActivityTypes from "../locales/ar/components/activities/ActivityTypes.json";
import arActivitiesActivityView from "../locales/ar/components/activities/ActivityView.json";
import arActivitiesNewActivity from "../locales/ar/components/activities/NewActivity.json";
import arActivitiesSelfAssessment from "../locales/ar/components/activities/SelfAssessment.json";
import arHeartSection from "../locales/ar/components/dashboard/HeartSection.json";
import arSleepSection from "../locales/ar/components/dashboard/SleepSection.json";
import arWellbeingSection from "../locales/ar/components/dashboard/WellbeingSection.json";
import arHeart from "../locales/ar/components/heart/index.json";
import arSelfAssessmentReadiness from "../locales/ar/components/self-assessment/Readiness.json";
import arSelfAssessmentTiredness from "../locales/ar/components/self-assessment/Tiredness.json";
import arWellbeingSleep from "../locales/ar/components/wellbeing/sleep.json";
import arIndex from "../locales/ar/index.json";
import arLanguage from "../locales/ar/language.json";
import arLogin from "../locales/ar/login.json";
import arStats from "../locales/ar/stats.json";

import enActivities from "../locales/en/activities.json";
import enCommon from "../locales/en/common.json";
import enActivitiesActivityCard from "../locales/en/components/activities/ActivityCard.json";
import enActivitiesActivityTypes from "../locales/en/components/activities/ActivityTypes.json";
import enActivitiesActivityView from "../locales/en/components/activities/ActivityView.json";
import enActivitiesNewActivity from "../locales/en/components/activities/NewActivity.json";
import enActivitiesSelfAssessment from "../locales/en/components/activities/SelfAssessment.json";
import enHeartSection from "../locales/en/components/dashboard/HeartSection.json";
import enSleepSection from "../locales/en/components/dashboard/SleepSection.json";
import enWellbeingSection from "../locales/en/components/dashboard/WellbeingSection.json";
import enHeart from "../locales/en/components/heart/index.json";
import enDashboardSelfAssessmentReadiness from "../locales/en/components/self-assessment/Readiness.json";
import enDashboardSelfAssessmentTiredness from "../locales/en/components/self-assessment/Tiredness.json";
import enWellbeingSleep from "../locales/en/components/wellbeing/sleep.json";
import enIndex from "../locales/en/index.json";
import enLanguage from "../locales/en/language.json";
import enLogin from "../locales/en/login.json";
import enStats from "../locales/en/stats.json";

export const resources = {
  en: {
    common: enCommon,
    home: enIndex,
    language: enLanguage,
    stats: enStats,
    login: enLogin,
    activities: enActivities,
    components: {
      selfAssessment: {
        readiness: enDashboardSelfAssessmentReadiness,
        tiredness: enDashboardSelfAssessmentTiredness,
      },
      dashboard: {
        wellbeingSection: enWellbeingSection,
        sleepSection: enSleepSection,
        heartSection: enHeartSection,
      },
      wellbeing: {
        sleep: enWellbeingSleep,
      },
      heart: enHeart,
      activities: {
        activityTypes: enActivitiesActivityTypes,
        activityCard: enActivitiesActivityCard,
        newActivity: enActivitiesNewActivity,
        activityView: enActivitiesActivityView,
        selfAssessment: enActivitiesSelfAssessment,
      },
    },
  },
  ar: {
    common: arCommon,
    home: arIndex,
    language: arLanguage,
    stats: arStats,
    login: arLogin,
    activities: arActivities,
    components: {
      selfAssessment: {
        readiness: arSelfAssessmentReadiness,
        tiredness: arSelfAssessmentTiredness,
      },
      dashboard: {
        wellbeingSection: arWellbeingSection,
        sleepSection: arSleepSection,
        heartSection: arHeartSection,
      },
      wellbeing: {
        sleep: arWellbeingSleep,
      },
      heart: arHeart,
      activities: {
        activityTypes: arActivitiesActivityTypes,
        activityCard: arActivitiesActivityCard,
        newActivity: arActivitiesNewActivity,
        activityView: arActivitiesActivityView,
        selfAssessment: arActivitiesSelfAssessment,
      },
    },
  },
};

// Get device locale
const deviceLocale = Localization.getLocales()[0]?.languageCode || "en";

const isRTL = (locale: string) => {
  const rtlLanguages = ["ar", "he", "fa", "ur"];
  return rtlLanguages.includes(locale);
};

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLocale,
  fallbackLng: "en",
  defaultNS: "common",
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
export const changeLanguage = (language: string) =>
  i18n.changeLanguage(language);

export default i18n;
