/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f6f2',
          100: '#e8eede',
          200: '#d4dcc8',
          300: '#b5c4a0',
          400: '#8fa374',
          500: '#6B7B5C',
          600: '#5C6B4F',
          700: '#4d5a3f',
          800: '#3d4832',
        },
        accent: {
          50: '#fdf5f5',
          100: '#f9e8e8',
          200: '#f2d4d4',
          300: '#e6b5b5',
          400: '#d49292',
          500: '#B07D7D',
          600: '#9a6a6a',
        },
        neutral: {
          50: '#FAF8F5',
          100: '#f5f2ed',
          200: '#e8e4dd',
          300: '#d4cec4',
          400: '#a39d92',
          500: '#7a7469',
          600: '#5c564d',
          700: '#3f3b34',
          800: '#2a2722',
          900: '#1a1815',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 12px rgb(0 0 0 / 0.08), 0 2px 4px rgb(0 0 0 / 0.04)',
        'card-hover': '0 16px 32px rgb(0 0 0 / 0.12), 0 6px 12px rgb(0 0 0 / 0.08)',
        'card-lg': '0 25px 50px -12px rgb(0 0 0 / 0.15)',
        'soft': '0 4px 12px rgb(0 0 0 / 0.08), 0 2px 4px rgb(0 0 0 / 0.04)',
      },
    },
  },
  plugins: [],
}
