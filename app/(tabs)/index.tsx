import { Image } from 'expo-image';
import { Button, Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalization } from '@/contexts/LocalizationContext';
import * as Sentry from '@sentry/react-native';

export default function HomeScreen() {
  const { t } = useLocalization();
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" className="bg-red-500">{t('title', { ns: 'home' })}</ThemedText>
        <HelloWave />
        <Button title={t('try', { ns: 'common' })} onPress={ () => { Sentry.captureException( Error('First error'))}}/>
        <LanguageSwitcher />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">{t('step1.title', { ns: 'home' })}</ThemedText>
        <ThemedText>
          {t('step1.description', { ns: 'home',
            file: 'app/(tabs)/index.tsx',
            shortcut: Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })
          })}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">{t('step2.title', { ns: 'home' })}</ThemedText>
        <ThemedText>
          {t('step2.description', { ns: 'home' })}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">{t('step3.title', { ns: 'home' })}</ThemedText>
        <ThemedText>
          {t('step3.description', { ns: 'home',
            command: 'npm run reset-project',
            directory: 'app',
            exampleDirectory: 'app-example'
          })}
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
