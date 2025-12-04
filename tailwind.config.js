/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        priority: {
          p1: '#dc2626',
          p2: '#f97316',
          p3: '#3b82f6',
          p4: '#6b7280',
        },
      },
      spacing: {
        '4.5': '1.125rem',
      },
      borderRadius: {
        '4': '0.25rem',
        '6': '0.375rem',
        '8': '0.5rem',
      },
      transitionDuration: {
        '150': '150ms',
        '300': '300ms',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'task-complete': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 150ms ease-out',
        'slide-in': 'slide-in 300ms ease-out',
        'task-complete': 'task-complete 300ms ease-out',
      },
    },
  },
  plugins: [],
};
