/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        customFont: ['Montserrat', 'sans-serif'],
        display: ["'Workbench'", 'sans-serif'],
        rubik: ["'Rubik Broken Fax'", 'system-ui'],
      }
    },
  },
  plugins: [],
}

