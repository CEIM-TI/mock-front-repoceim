/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#041e42', // CEIM Blue
          secondary: '#f1e434', // CEIM Yellow
          dark: '#1a1a1a',
          gray: '#f4f4f4',
          border: '#e0e0e0',
          sidebar: '#f8f8f8'
        },
        sharepoint: '#0078d4',
      }
    }
  },
  plugins: [],
}
