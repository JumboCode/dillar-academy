/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        avenir: ["Avenir", "sans-serif"],
      },
      colors: {
        "blue": {
          100: '#ECF7FE',
          200: '#B7E2FB',
          300: '#87CEF8',
          400: '#59BCF5',
          500: '#22A6F2',
          600: '#0D8ED8',
          700: '#0A6FA8',
          800: '#074F78',
        },
        "dark-blue": {
          100: '#EEEDFD',
          200: '#C5BEF8',
          300: '#9B90F3',
          400: '#7163EE',
          500: '#4735E9',
          600: '#2112A6',
          700: '#180D78',
          800: '#0F084B',
        },
        "turquoise": {
          100: '#F7FBFD',
          200: '#CEE7F3',
          300: '#A5D3E9',
          400: '#53ACD5',
          500: '#3096C5',
          600: '#26769B',
          700: '#1C5773',
          800: '#12384A',
        },
        "neutral": {
          200: '#E8E8ED',
          300: '#B4B4C6',
          400: '#7B7A9A',
          500: '#626180',
          600: '#4C4B63',
          700: '#2A2A37',
        },
      },
      boxShadow: {
        "shadow": "0 0.25rem 24px 0 rgba(76, 75, 99, 0.18)",
        "shadow-hover": "0px 4px 16px 0px rgba(74, 73, 96, 30%), 0px 6px 36px 0px rgba(74, 73, 96, 16%)"
      }
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
}

