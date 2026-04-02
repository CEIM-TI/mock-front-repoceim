/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ceim: {
          blue: '#041e42',
          yellow: '#f1b434',
          orange: '#DF5400',
          pantoneBlack7: '#3D3935',
          gray70: '#4D4D4D',
          gray30: '#B3B3B3',
          p101_16: '#051E24',
          p103_16: '#212C56',
        },
        brand: {
          primary: '#041e42', // Azul principal
          secondary: '#f1b434', // Amarillo
          accent: '#DF5400', // Naranja
          dark: '#3D3935', // Pantone Black 7
          gray: '#B3B3B3', // K: 30
          border: '#4D4D4D', // K: 70
          sidebar: '#051E24' // Pantone P 101-16 U
        },
        sharepoint: '#0078d4',
      }
    }
  },
  plugins: [],
}
