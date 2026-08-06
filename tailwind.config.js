/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5B2ECC',
          light: '#8B6FE8',
          dark: '#4A1FB8',
        },
        accent: {
          DEFAULT: '#e3504a',
          light: '#FF6B63',
          dark: '#c0392b',
        },
        brand: {
          dark: '#0a041e',
          orange: '#e3504a',
          violet: '#5B2ECC',
          purple: '#8B6FE8',
          coral: '#FF6B63',
          success: '#10b981',
          error: '#ef4444',
        },
        gold: '#FFD700',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        academy: ['Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'float': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 4s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
