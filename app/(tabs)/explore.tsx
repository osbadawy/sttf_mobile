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
        <ThemedText type="title">{t('explore.title')}</ThemedText>
      </ThemedView>
      <ThemedText>{t('explore.description')}</ThemedText>
      <Collapsible title={t('explore.fileBasedRouting.title')}>
        <ThemedText>
          {t('explore.fileBasedRouting.description', {
            file1: 'app/(tabs)/index.tsx',
            file2: 'app/(tabs)/explore.tsx'
          })}
        </ThemedText>
        <ThemedText>
          {t('explore.fileBasedRouting.layoutDescription', {
            file: 'app/(tabs)/_layout.tsx'
          })}
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">{t('common.learnMore')}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={t('explore.platformSupport.title')}>
        <ThemedText>
          {t('explore.platformSupport.description', { key: 'w' })}
        </ThemedText>
      </Collapsible>
      <Collapsible title={t('explore.images.title')}>
        <ThemedText>
          {t('explore.images.description', {
            suffix1: '@2x',
            suffix2: '@3x'
          })}
        </ThemedText>
        <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">{t('common.learnMore')}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={t('explore.customFonts.title')}>
        <ThemedText>
          {t('explore.customFonts.description', { file: 'app/_layout.tsx' })}
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">{t('common.learnMore')}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={t('explore.themes.title')}>
        <ThemedText>
          {t('explore.themes.description', { hook: 'useColorScheme()' })}
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">{t('common.learnMore')}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={t('explore.animations.title')}>
        <ThemedText>
          {t('explore.animations.description', {
            component: 'components/HelloWave.tsx',
            library: 'react-native-reanimated'
          })}
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              {t('explore.animations.iosDescription', {
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
