/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        abyss: {
          950: '#070C16',
          900: '#0B1220',
          800: '#101A2E',
          700: '#16233C',
          600: '#1D2C49',
          500: '#2A3B5C',
        },
        mist: {
          50: '#F7F9FC',
          100: '#EEF2F8',
          200: '#E3E9F2',
        },
        current: {
          50: '#EDFCFF',
          400: '#3CD9F2',
          500: '#17C7E0',
          600: '#0FA6BD',
        },
        signal: {
          400: '#5B9DFF',
          500: '#2F7BFF',
          600: '#1E5FDB',
        },
        healthy: {
          400: '#34E0A1',
          500: '#10B981',
          600: '#0B9268',
        },
        caution: {
          400: '#FFC24D',
          500: '#F59E0B',
          600: '#D9820A',
        },
        critical: {
          400: '#FF7A7A',
          500: '#EF4444',
          600: '#D93636',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 40px -20px rgba(0,0,0,0.5)',
        'panel-light': '0 1px 0 0 rgba(255,255,255,0.6) inset, 0 12px 30px -18px rgba(16,42,96,0.18)',
        glow: '0 0 0 1px rgba(23,199,224,0.25), 0 0 24px rgba(23,199,224,0.15)',
      },
      backgroundImage: {
        'ocean-grid': 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.4, transform: 'scale(0.85)' },
        },
        rise: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 2s ease-in-out infinite',
        rise: 'rise 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}