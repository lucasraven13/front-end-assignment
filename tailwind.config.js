module.exports = {
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        lime: '#6bd400',
        'lime-100': '#6ad100',
        'lime-700': '#5cb204',
        'lime-800': '#58ae01',
        'cart-border': '#dcdcdc',
      },
      fontFamily: {
        sans: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
    },
  },
  plugins: [],
  content: ['./frontend/views/**/*.{edge,js}'],
}
