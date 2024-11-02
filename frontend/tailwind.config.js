// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1DA1F2',
        'brand-dark': '#1B1F23',
      },
      spacing: {
        '18': '4.5rem',
        '26': '6.5rem',
      },
      fontSize: {
        'xxs': '0.65rem',
      },
    },
  },
  plugins: [],
};
