import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { useLocalization } from '@/contexts/LocalizationContext';

export default function TabLayout() {
  const { t: tCommon } = useLocalization('common');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: tCommon('home'),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: tCommon('dashboard'),
        }}
      />
      <Tabs.Screen
        name="wellbeing"
        options={{
          title: tCommon('wellbeing'),
        }}
      />
      <Tabs.Screen
        name="heart"
        options={{
          title: tCommon('heart'),
        }}
      />
    </Tabs>
  );
}
