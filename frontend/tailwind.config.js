/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.js", "./screens/**/*.js"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
        colors: {
            'custom-blue': {
              '100': '#788ABF',
              '200': '#495BA2',
            },
            'custom-orange': '#ffb95c',
            'custom-red': '#ff8c83',
            'custom-yellow': '#FFD49B',
            'custom-tan': '#FEF9E5',
            'custom-teal': '#B2E8DD',
            'custom-gray': '#D9D9D9',
            'custom-pink': { 
              '100': '#F5D2C8', 
              '200': '#F5A58C', 
				      },
            'custom-black': '#1E1E1E',


        },
        fontFamily: {
          'spaceGrotesk': ["Space Grotesk", "sans-serif"],
        }
    },
  },
  plugins: [],
}

