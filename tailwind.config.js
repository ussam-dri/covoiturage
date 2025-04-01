// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        myFont: ['myFont', 'sans-serif'], // Add your custom font here
        myFont2: ['myFont2', 'sans-serif'], // Add your custom font here

      },
    },
  },
  plugins: [],
}
