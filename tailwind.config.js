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
          50: '#f1faed',
          100: '#dcf2d2',
          200: '#bee6ac',
          300: '#98d47c',
          400: '#74c251',
          500: '#46c001',
          600: '#369b00',
          700: '#2a7800',
          800: '#235f00',
          900: '#1d4e02',
        },
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'marquee': 'marquee 25s linear infinite',
        'marquee2': 'marquee2 25s linear infinite',
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: '0 0',
          },
          to: {
            backgroundPosition: '-200% 0',
          },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
}
