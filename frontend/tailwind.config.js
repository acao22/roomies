/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.js", "./screens/**/*.js"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
        colors: {
            'blueText': '#6cd9d5',
            'orangeText': '#ffb95c',
            'redText': '#ff8c83'

        }
    },
  },
  plugins: [],
}

