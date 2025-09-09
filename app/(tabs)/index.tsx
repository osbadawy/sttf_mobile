
import { Text } from 'react-native';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useLocalization } from '@/contexts/LocalizationContext';

export default function HomeScreen() {
  const { t: tHome } = useLocalization('home');
  
  return (
    <ParallaxScrollView>
      <Text>{tHome('title')}</Text>
      <LanguageSwitcher />
    </ParallaxScrollView>
  );
}