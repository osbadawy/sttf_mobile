import type { LocalizationContextType } from '@/contexts/LocalizationContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, switchLanguage, t } = useLocalization() as LocalizationContextType;

  console.log('LanguageSwitcher: Current language:', currentLanguage);

  const handleLanguageSwitch = () => {
    console.log('LanguageSwitcher: Button pressed!');
    const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    
    console.log('Switching language from', currentLanguage, 'to', newLanguage);
    
    switchLanguage(newLanguage);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleLanguageSwitch}>
        <Text style={styles.buttonText}>
          {currentLanguage === 'en' ? t('arabic', { ns: 'language' }) : t('english', { ns: 'language' })}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
