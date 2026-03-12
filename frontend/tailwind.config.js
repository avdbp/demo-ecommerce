/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green-dark': '#1B4332',
        'green-mid': '#2D6A4F',
        'green-light': '#52B788',
        'cream': '#F8F4EF',
        'blush': '#FADADD',
        'charcoal': '#2C2C2C',
        'white': '#FFFFFF',
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
