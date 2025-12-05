export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Earth tone palette
        earth: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#e8dfd0',
          300: '#d4c4a8',
          400: '#bfa77e',
          500: '#a68b5b',
          600: '#8b7049',
          700: '#6b5639',
          800: '#4a3c28',
          900: '#2d2519',
          950: '#1a1610',
        },
        // Warm neutral tones
        warm: {
          50: '#faf9f7',
          100: '#f3f1ed',
          200: '#e5e1d8',
          300: '#d1cac0',
          400: '#b8aea1',
          500: '#9f9284',
          600: '#857769',
          700: '#6b5f53',
          800: '#524840',
          900: '#3b342d',
          950: '#252220',
        }
      },
    },
  },
  plugins: [],
}