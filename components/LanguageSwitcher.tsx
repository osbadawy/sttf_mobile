import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalization } from '@/contexts/LocalizationContext';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

export const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, switchLanguage, t } = useLocalization();

  console.log('LanguageSwitcher: Current language:', currentLanguage);

  const handleLanguageSwitch = () => {
    console.log('LanguageSwitcher: Button pressed!');
    const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    
    console.log('Switching language from', currentLanguage, 'to', newLanguage);
    
    switchLanguage(newLanguage);
    
    if (newLanguage === 'ar') {
      Alert.alert(
        'Restart Required',
        'Please restart the app to apply RTL layout changes.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleLanguageSwitch}>
        <ThemedText style={styles.buttonText}>
          {currentLanguage === 'en' ? 'العربية' : 'English'}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
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
