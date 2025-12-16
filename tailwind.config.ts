
/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  darkMode: ['class', 'class'],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'light-bg': '#ffffff',
        'light-surface': '#f5f5f5',
        'light-text': '#1a1a1a',
      },
      animation: {
        'vibrate': 'vibrate 0.5s ease-in-out infinite',
      },
      keyframes: {
        vibrate: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
      },
    },
  },
  plugins: [],
}
