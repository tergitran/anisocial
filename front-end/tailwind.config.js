/** @type {import('tailwindcss').Config} */
// import colors from 'tailwindcss/colors'

const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        white: '#ffffff',
        black: '000000',
        current: 'currentColor'
      },
      gridTemplateColumns: {
        // Simple auto columns
       'user-card': 'repeat(auto-fill, minmax(180px, 1fr))',

        // Complex site-specific column configuration
       'footer': '200px minmax(900px, 1fr) 100px',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false
  },
}