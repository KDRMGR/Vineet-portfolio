/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#000000',
          light: '#1A1A1A',
        },
        accent: {
          DEFAULT: '#9f532e',
          light: '#b36039',
          muted: '#c97650',
        },
        background: {
          DEFAULT: '#ffffff',
          white: '#ffffff',
          black: '#000000',
        },
        text: {
          primary: '#000000',
          secondary: '#333333',
          muted: '#666666',
          light: '#ffffff',
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
