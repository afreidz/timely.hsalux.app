/** @type {import('tailwindcss').Config} */
const theme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...theme.fontFamily.sans]
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
}
