/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#030712', // Very dark slate
          900: '#0b0f19', // Dark background
          800: '#111827', // Card background
          700: '#1f2937', // Hover state / Border
          600: '#374151',
          400: '#9ca3af',
          100: '#f3f4f6'
        },
        brand: {
          indigo: '#6366f1',
          cyan: '#06b6d4',
          violet: '#8b5cf6',
          pink: '#ec4899',
          danger: '#ef4444',
          success: '#10b981',
          warning: '#f59e0b'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(17, 24, 39, 0.7) 0%, rgba(11, 15, 25, 0.8) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-glow': '0 8px 32px 0 rgba(99, 102, 241, 0.15)',
        'neon-cyan': '0 0 15px rgba(6, 182, 212, 0.4)',
        'neon-indigo': '0 0 15px rgba(99, 102, 241, 0.4)',
      }
    },
  },
  plugins: [],
}
