import '@/global.css';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LocalizationProvider } from '@/contexts/LocalizationContext';
import '@/i18n'; // Initialize i18n
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Effra': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Rg.ttf'),
    'Effra-100': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Hair.ttf'),
    'Effra-100-italic': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_HairIt.ttf'),
    'Effra-200': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Th.ttf'),
    'Effra-200-italic': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_ThIt.ttf'),
    'Effra-300': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Lt.ttf'),
    'Effra-300-italic': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_LtIt.ttf'),
    'Effra-400': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Rg.ttf'),
    'Effra-400-italic': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_It.ttf'),
    'Effra-500': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Md.ttf'),
    'Effra-500-italic': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_MdIt.ttf'),
    'Effra-600': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_SBd.ttf'),
    'Effra-600-italic': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_SBdIt.ttf'),
    'Effra-700': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Bd.ttf'),
    'Effra-700-italic': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_BdIt.ttf'),
    'Effra-800': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_XBd.ttf'),
    'Effra-800-italic': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_XBdIt.ttf'),
    'Effra-900': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Blk.ttf'),
    'Effra-900-italic': require('../assets/fonts/effra-trial-cufonfonts/Effra_Trial_BlkIt.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaProvider>
      <LocalizationProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </LocalizationProvider>
    </SafeAreaProvider>
  );
});