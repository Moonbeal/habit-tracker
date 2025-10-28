/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5f5',
          100: '#ffebeb',
          200: '#ffcccc',
          300: '#ff9999',
          400: '#ff4d4d',
          500: '#ff0000',
          600: '#e60000',
          700: '#cc0000',
          800: '#990000',
          900: '#660000',
        },
        dark: {
          50: '#f5f5f5',
          100: '#e0e0e0',
          200: '#bdbdbd',
          300: '#9e9e9e',
          400: '#757575',
          500: '#616161',
          600: '#424242',
          700: '#303030',
          800: '#212121',
          900: '#121212',
        }
      },
    },
  },
  plugins: [],
}
