import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  const { t } = useLocalization('home');


  return (
    <View>
      <Text>{t('welcome')}</Text>
      <LanguageSwitcher />
    </View>
  );
}
