/**
 * Font weight mapping for Effra fonts in React Native
 * This provides a way to get the correct font family name based on weight and style
 */

export const getEffraFontFamily = (weight: number, italic: boolean = false): string => {
  const weightMap: Record<number, string> = {
    100: 'Effra-100',
    200: 'Effra-200', 
    300: 'Effra-300',
    400: 'Effra-400',
    500: 'Effra-500',
    600: 'Effra-600',
    700: 'Effra-700',
    800: 'Effra-800',
    900: 'Effra-900',
  };

  const baseFont = weightMap[weight] || 'Effra-400';
  return italic ? `${baseFont}-italic` : baseFont;
};

export const effraFontWeights = {
  hairline: getEffraFontFamily(100),
  thin: getEffraFontFamily(200),
  light: getEffraFontFamily(300),
  normal: getEffraFontFamily(400),
  medium: getEffraFontFamily(500),
  semibold: getEffraFontFamily(600),
  bold: getEffraFontFamily(700),
  extrabold: getEffraFontFamily(800),
  black: getEffraFontFamily(900),
  // Italic variants
  hairlineItalic: getEffraFontFamily(100, true),
  thinItalic: getEffraFontFamily(200, true),
  lightItalic: getEffraFontFamily(300, true),
  normalItalic: getEffraFontFamily(400, true),
  mediumItalic: getEffraFontFamily(500, true),
  semiboldItalic: getEffraFontFamily(600, true),
  boldItalic: getEffraFontFamily(700, true),
  extraboldItalic: getEffraFontFamily(800, true),
  blackItalic: getEffraFontFamily(900, true),
};
