/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdf8f0',
          100: '#faf0dc',
          200: '#f5deb3',
          300: '#edc87a',
        },
        terracotta: {
          400: '#c1704a',
          500: '#b05d35',
          600: '#9a4f2a',
          700: '#7d3d1f',
        },
        forest: {
          600: '#2d5a27',
          700: '#1e3d1a',
          800: '#152b12',
          900: '#0d1c0b',
        },
        spice: {
          400: '#d4924a',
          500: '#c47d32',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        body: ['Palatino Linotype', 'Palatino', 'Book Antiqua', 'serif'],
        sans: ['Trebuchet MS', 'Helvetica Neue', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
