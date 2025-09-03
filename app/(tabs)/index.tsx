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
  const { t: tHome } = useLocalization('home');
  const { t: tCommon } = useLocalization('common');
  
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
        <ThemedText type="title" className="bg-red-500">{tHome('title')}</ThemedText>
        <HelloWave />
        <Button title={tCommon('try')} onPress={ () => { Sentry.captureException( Error('First error'))}}/>
        <LanguageSwitcher />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">{tHome('step1.title')}</ThemedText>
        <ThemedText>
          {tHome('step1.description', {
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
        <ThemedText type="subtitle">{tHome('step2.title')}</ThemedText>
        <ThemedText>
          {tHome('step2.description')}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">{tHome('step3.title')}</ThemedText>
        <ThemedText>
          {tHome('step3.description', {
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
