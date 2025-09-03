import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLocalization } from '@/contexts/LocalizationContext';

export default function TabTwoScreen() {
  const { t } = useLocalization();
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t('title', { ns: 'explore' })}</ThemedText>
      </ThemedView>
      <ThemedText>{t('description', { ns: 'explore' })}</ThemedText>
      <Collapsible title={t('fileBasedRouting.title', { ns: 'explore' })}>
        <ThemedText>
          {t('fileBasedRouting.description', { ns: 'explore',
            file1: 'app/(tabs)/index.tsx',
            file2: 'app/(tabs)/explore.tsx'
          })}
        </ThemedText>
        <ThemedText>
          {t('fileBasedRouting.layoutDescription', { ns: 'explore',
            file: 'app/(tabs)/_layout.tsx'
          })}
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">{t('learnMore', { ns: 'common' })}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={t('platformSupport.title', { ns: 'explore' })}>
        <ThemedText>
          {t('platformSupport.description', { ns: 'explore', key: 'w' })}
        </ThemedText>
      </Collapsible>
      <Collapsible title={t('images.title', { ns: 'explore' })}>
        <ThemedText>
          {t('images.description', { ns: 'explore',
            suffix1: '@2x',
            suffix2: '@3x'
          })}
        </ThemedText>
        <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">{t('learnMore', { ns: 'common' })}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={t('customFonts.title', { ns: 'explore' })}>
        <ThemedText>
          {t('customFonts.description', { ns: 'explore', file: 'app/_layout.tsx' })}
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">{t('learnMore', { ns: 'common' })}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={t('themes.title', { ns: 'explore' })}>
        <ThemedText>
          {t('themes.description', { ns: 'explore', hook: 'useColorScheme()' })}
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">{t('learnMore', { ns: 'common' })}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={t('animations.title', { ns: 'explore' })}>
        <ThemedText>
          {t('animations.description', { ns: 'explore',
            component: 'components/HelloWave.tsx',
            library: 'react-native-reanimated'
          })}
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              {t('animations.iosDescription', { ns: 'explore',
                component: 'components/ParallaxScrollView.tsx'
              })}
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
