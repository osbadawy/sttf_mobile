/** @type {import('tailwindcss').Config} */
import colors from './colors.js';

export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: colors,
      backgroundColor: {
        default: colors.background,
      },
      fontFamily: {
        // Set Effra Normal as the default sans-serif font
        'sans': ['Effra-400', 'Effra', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        // Effra weight-specific classes that map directly to font files
        'effra-hairline': ['Effra-100', 'system-ui', 'sans-serif'],
        'effra-thin': ['Effra-200', 'system-ui', 'sans-serif'],
        'effra-light': ['Effra-300', 'system-ui', 'sans-serif'],
        'effra-normal': ['Effra-400', 'system-ui', 'sans-serif'],
        'effra-medium': ['Effra-500', 'system-ui', 'sans-serif'],
        'effra-semibold': ['Effra-600', 'system-ui', 'sans-serif'],
        'effra-bold': ['Effra-700', 'system-ui', 'sans-serif'],
        'effra-extrabold': ['Effra-800', 'system-ui', 'sans-serif'],
        'effra-black': ['Effra-900', 'system-ui', 'sans-serif'],
        // Italic variants
        'effra-hairline-italic': ['Effra-100-italic', 'system-ui', 'sans-serif'],
        'effra-thin-italic': ['Effra-200-italic', 'system-ui', 'sans-serif'],
        'effra-light-italic': ['Effra-300-italic', 'system-ui', 'sans-serif'],
        'effra-normal-italic': ['Effra-400-italic', 'system-ui', 'sans-serif'],
        'effra-medium-italic': ['Effra-500-italic', 'system-ui', 'sans-serif'],
        'effra-semibold-italic': ['Effra-600-italic', 'system-ui', 'sans-serif'],
        'effra-bold-italic': ['Effra-700-italic', 'system-ui', 'sans-serif'],
        'effra-extrabold-italic': ['Effra-800-italic', 'system-ui', 'sans-serif'],
        'effra-black-italic': ['Effra-900-italic', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        // Map Tailwind font weights to Effra variants
        'hairline': '100',
        'thin': '200', 
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
    },
  },
  plugins: [],
};