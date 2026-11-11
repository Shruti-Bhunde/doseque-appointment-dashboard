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
          DEFAULT: '#3979C9',
          hover: '#2D66B0',
          light: '#EBF2FA',
          subtle: '#F0F5FC',
        },
        bg: {
          DEFAULT: '#F4F7FB',
          surface: '#FFFFFF',
          card: '#FFFFFF',
        },
        text: {
          main: '#18324F',
          secondary: '#7B8DA3',
          muted: '#9DAEC2',
        },
        border: {
          subtle: '#E5EDF5',
          light: '#EEF3F8',
        },
        status: {
          scheduled: {
            bg: '#EBF2FA',
            text: '#2762AA',
            border: '#D2E2F4',
          },
          completed: {
            bg: '#EAF7EE',
            text: '#1E7B42',
            border: '#CCEBD5',
          },
          cancelled: {
            bg: '#FDF1F1',
            text: '#C53030',
            border: '#F8D2D2',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
