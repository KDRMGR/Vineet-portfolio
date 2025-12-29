/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0A0A0A',
          light: '#1A1A1A',
        },
        accent: {
          DEFAULT: '#8B7355',
          light: '#A08B7A',
          muted: '#C9B8A8',
        },
        background: {
          DEFAULT: '#FAFAFA',
          white: '#FFFFFF',
          cream: '#F8F7F5',
        },
        text: {
          primary: '#0A0A0A',
          secondary: '#4A4A4A',
          muted: '#6B6B6B',
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },
      letterSpacing: {
        'extra-wide': '0.15em',
        'ultra-wide': '0.25em',
      },
      lineHeight: {
        'extra-relaxed': '1.75',
        'ultra-relaxed': '2',
      },
    },
  },
  plugins: [],
};
