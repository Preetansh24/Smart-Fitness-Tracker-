/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'float':     'float 3s ease-in-out infinite',
        'shimmer':   'shimmer 2s linear infinite',
        'fade-in':   'fadeIn 0.6s ease-out forwards',
        'slide-up':  'slideUp 0.5s ease-out forwards',
        'pulse-ring':'pulseRing 2s ease-out infinite',
        'color-cycle':'colorCycle 6s ease-in-out infinite',
        'bounce-light':'bounceLight 2s ease-in-out infinite',
        'gradient-x':'gradientX 4s ease infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%':   { boxShadow: '0 0 0 0   rgba(249,115,22,0.4)' },
          '70%':  { boxShadow: '0 0 0 12px rgba(249,115,22,0)'   },
          '100%': { boxShadow: '0 0 0 0   rgba(249,115,22,0)'    },
        },
        colorCycle: {
          '0%,100%': { color: '#ea580c' },
          '33%':     { color: '#f59e0b' },
          '66%':     { color: '#ef4444' },
        },
        bounceLight: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-5px)' },
        },
        gradientX: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
