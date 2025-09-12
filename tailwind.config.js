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
    },
  },
  plugins: [],
};