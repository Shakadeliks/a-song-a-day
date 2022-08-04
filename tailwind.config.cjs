/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    './templates/**/*.hbs',
    './public/js/*.js'
  ],
  theme: {
    screens: {
      xs: "540px",
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        'sans': ['Comfortaa', ...defaultTheme.fontFamily.sans],
      }
    },
  },
  plugins: [],
}
