/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1A1A1A',
        gold: '#C79A3E',
        'gold-light': '#D4AA55',
        'gold-dark': '#A07830',
        ivory: '#F8F5EF',
        muted: '#6B6660',
        'warm-border': '#E8E2D6',
        teal: '#2C5447',
        'teal-light': '#3A6B58',
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        brand: '1280px',
      },
      height: {
        18: '72px',
      },
      letterSpacing: {
        label: '0.15em',
        wide2: '0.2em',
        wide3: '0.25em',
      },
      lineHeight: {
        editorial: '1.1',
        reading: '1.65',
      },
    },
  },
  plugins: [],
}
