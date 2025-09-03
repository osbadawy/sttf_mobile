# Localization Implementation

This document describes the localization implementation for the STTF Mobile app, supporting English (en) and Arabic (ar) languages.

## Features

- ✅ English and Arabic language support
- ✅ Language switcher component
- ✅ Automatic device language detection
- ✅ Context-based translation management
- ✅ Interpolation support for dynamic content

## File Structure

```
├── locales/
│   ├── en/              # English translations
│   │   ├── common.json  # Common translations (welcome, buttons, etc.)
│   │   ├── index.json   # Home page translations
│   │   ├── explore.json # Explore page translations
│   │   └── language.json # Language switcher translations
│   └── ar/              # Arabic translations
│       ├── common.json  # Common translations (welcome, buttons, etc.)
│       ├── index.json   # Home page translations
│       ├── explore.json # Explore page translations
│       └── language.json # Language switcher translations
├── i18n/
│   └── index.ts         # i18n configuration
├── contexts/
│   └── LocalizationContext.tsx  # Localization context and provider
└── components/
    └── LanguageSwitcher.tsx     # Language switching component
```

## Usage

### Using Translations in Components

```tsx
import { useLocalization } from '@/contexts/LocalizationContext';

export default function MyComponent() {
  const { t } = useLocalization();
  
  return (
    <ThemedText>{t('common.welcome')}</ThemedText>
  );
}
```

### Using Interpolation

```tsx
const { t } = useLocalization();

// With variables
<ThemedText>
  {t('home.step1.description', {
    file: 'app/(tabs)/index.tsx',
    shortcut: 'cmd + d'
  })}
</ThemedText>
```

### Switching Languages

```tsx
import { useLocalization } from '@/contexts/LocalizationContext';

export default function MyComponent() {
  const { switchLanguage } = useLocalization();
  
  const handleLanguageChange = () => {
    switchLanguage('ar'); // Switch to Arabic
  };
  
  return (
    <Button title="Switch to Arabic" onPress={handleLanguageChange} />
  );
}
```

## Translation Keys Structure

### Common Keys
- `common.welcome` - Welcome message
- `common.try` - Try button text
- `common.home` - Home tab title
- `common.explore` - Explore tab title
- `common.learnMore` - Learn more link text

### Home Screen Keys
- `home.title` - Home screen title
- `home.step1.title` - Step 1 title
- `home.step1.description` - Step 1 description with interpolation
- `home.step2.title` - Step 2 title
- `home.step2.description` - Step 2 description
- `home.step3.title` - Step 3 title
- `home.step3.description` - Step 3 description with interpolation

### Explore Screen Keys
- `explore.title` - Explore screen title
- `explore.description` - Explore screen description
- `explore.fileBasedRouting.*` - File-based routing section
- `explore.platformSupport.*` - Platform support section
- `explore.images.*` - Images section
- `explore.customFonts.*` - Custom fonts section
- `explore.themes.*` - Themes section
- `explore.animations.*` - Animations section

### Language Switcher Keys
- `language.switch` - Language switch button text
- `language.english` - English language name
- `language.arabic` - Arabic language name



## Adding New Translations

1. Add the new key to the appropriate file in both `locales/en/` and `locales/ar/` folders:
   - `common.json` - for shared translations (buttons, labels, etc.)
   - `index.json` - for home page specific translations
   - `explore.json` - for explore page specific translations
   - `language.json` - for language switcher translations
2. Use the key in your component with `t('your.new.key')`
3. For interpolation, use `t('your.key', { variable: 'value' })`
4. If adding a new page, create corresponding `pagename.json` files in both language folders and update the i18n configuration

## Language Detection

The app automatically detects the device's language using `expo-localization` and sets it as the default language. If the device language is not supported, it falls back to English.

## Dependencies

- `react-i18next` - React integration for i18next
- `expo-localization` - Device locale detection
- `@types/i18next` - TypeScript definitions

## Notes

- All text content has been moved to translation files for easy maintenance
