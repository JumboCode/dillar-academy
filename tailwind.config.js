/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        avenir: ["AVENIR", "sans-serif"],
      },
      colors: {
        "night-blue": "#0F084B",
        "violet-gray": "#4C4B63",
        "cerulean": "#26769B",
        "sky-blue": "#59BCF5",
      }
    },
  },
  plugins: [],
}

