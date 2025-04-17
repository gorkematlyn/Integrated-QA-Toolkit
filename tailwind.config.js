/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4285F4',
          dark: '#3367d6',
        },
        secondary: {
          DEFAULT: '#34A853',
          dark: '#2e8b47',
        },
        accent: {
          DEFAULT: '#FBBC05',
          dark: '#f5b000',
        },
        error: {
          DEFAULT: '#EA4335',
          dark: '#d33426',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}; 