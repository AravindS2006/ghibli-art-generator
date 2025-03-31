import type { Config } from 'tailwindcss'
import { nextui } from '@nextui-org/theme'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F1FE',
          100: '#E1E3FD',
          200: '#C3C7FB',
          300: '#A5ABF9',
          400: '#818CF8',
          500: '#4F46E5',
          600: '#3730A3',
          700: '#312E81',
          800: '#1E1B4B',
          900: '#0F172A',
          DEFAULT: '#4F46E5',
          foreground: '#FFFFFF',
        },
        secondary: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: {
            50: '#F0F1FE',
            100: '#E1E3FD',
            200: '#C3C7FB',
            300: '#A5ABF9',
            400: '#818CF8',
            500: '#4F46E5',
            600: '#3730A3',
            700: '#312E81',
            800: '#1E1B4B',
            900: '#0F172A',
            DEFAULT: '#4F46E5',
            foreground: '#FFFFFF',
          },
          secondary: {
            50: '#ECFDF5',
            100: '#D1FAE5',
            200: '#A7F3D0',
            300: '#6EE7B7',
            400: '#34D399',
            500: '#10B981',
            600: '#059669',
            700: '#047857',
            800: '#065F46',
            900: '#064E3B',
            DEFAULT: '#10B981',
            foreground: '#FFFFFF',
          },
        },
      },
      dark: {
        colors: {
          primary: {
            50: '#F0F1FE',
            100: '#E1E3FD',
            200: '#C3C7FB',
            300: '#A5ABF9',
            400: '#818CF8',
            500: '#4F46E5',
            600: '#3730A3',
            700: '#312E81',
            800: '#1E1B4B',
            900: '#0F172A',
            DEFAULT: '#818CF8',
            foreground: '#FFFFFF',
          },
          secondary: {
            50: '#ECFDF5',
            100: '#D1FAE5',
            200: '#A7F3D0',
            300: '#6EE7B7',
            400: '#34D399',
            500: '#10B981',
            600: '#059669',
            700: '#047857',
            800: '#065F46',
            900: '#064E3B',
            DEFAULT: '#34D399',
            foreground: '#FFFFFF',
          },
        },
      },
    },
  })],
}

export default config 