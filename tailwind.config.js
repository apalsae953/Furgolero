/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '400px',
      },
      colors: {
        verde: {
          campo: '#2d7a2d',
          oscuro: '#1a4d1a',
          claro: '#3da83d',
        },
        dorado: '#FFD700',
        platino: '#E5E4E2',
      },
      animation: {
        'gol': 'gol 0.5s ease-in-out infinite',
        'card-flip': 'cardFlip 0.6s ease-in-out',
        'pulse-gold': 'pulseGold 1s ease-in-out infinite',
      },
      keyframes: {
        gol: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        cardFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 5px #FFD700' },
          '50%': { boxShadow: '0 0 20px #FFD700, 0 0 40px #FFD700' },
        }
      }
    },
  },
  plugins: [],
}
