import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ffffff',
          100: '#faf9f6',
          200: '#f5f4ef',
          300: '#e8e5dc',
          400: '#d5d0c3',
          500: '#b8b1a1',
          600: '#948c7a',
          700: '#736b59',
          800: '#38352b',
          900: '#1c1a15',
          950: '#0d0c0a',
        },
        surface: {
          50: '#1a1918',
          100: '#171615',
          200: '#141312',
          700: '#121110',
          800: '#0f0e0d',
          850: '#0a0a09',
          900: '#080807',
          950: '#050505',
        },
        accent: {
          champagne: '#F2E8D5',
          bronze: '#D0A37A',
          gold: '#D4AF37',
          silver: '#e2e2dc',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
