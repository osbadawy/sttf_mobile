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
  const { t: tExplore } = useLocalization('explore');
  const { t: tCommon } = useLocalization('common');
  
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
        <ThemedText type="title">{tExplore('title')}</ThemedText>
      </ThemedView>
      <ThemedText>{tExplore('description')}</ThemedText>
      <Collapsible title={tExplore('fileBasedRouting.title')}>
        <ThemedText>
          {tExplore('fileBasedRouting.description', {
            file1: 'app/(tabs)/index.tsx',
            file2: 'app/(tabs)/explore.tsx'
          })}
        </ThemedText>
        <ThemedText>
          {tExplore('fileBasedRouting.layoutDescription', {
            file: 'app/(tabs)/_layout.tsx'
          })}
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">{tCommon('learnMore')}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={tExplore('platformSupport.title')}>
        <ThemedText>
          {tExplore('platformSupport.description', { key: 'w' })}
        </ThemedText>
      </Collapsible>
      <Collapsible title={tExplore('images.title')}>
        <ThemedText>
          {tExplore('images.description', {
            suffix1: '@2x',
            suffix2: '@3x'
          })}
        </ThemedText>
        <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">{tCommon('learnMore')}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={tExplore('customFonts.title')}>
        <ThemedText>
          {tExplore('customFonts.description', { file: 'app/_layout.tsx' })}
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">{tCommon('learnMore')}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={tExplore('themes.title')}>
        <ThemedText>
          {tExplore('themes.description', { hook: 'useColorScheme()' })}
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">{tCommon('learnMore')}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={tExplore('animations.title')}>
        <ThemedText>
          {tExplore('animations.description', {
            component: 'components/HelloWave.tsx',
            library: 'react-native-reanimated'
          })}
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              {tExplore('animations.iosDescription', {
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
