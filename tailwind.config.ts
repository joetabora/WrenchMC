import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx,js,jsx}',
    './src/components/**/*.{ts,tsx,js,jsx}',
    './src/pages/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        wrench: {
          // Modern dark theme - sophisticated blacks
          DEFAULT: '#0f0f0f',
          dark: '#050505',
          'dark-soft': '#0a0a0a',
          light: '#1a1a1a',
          'light-soft': '#242424',
          // Refined neutral accents
          chrome: '#d4d4d4',
          'chrome-bright': '#f5f5f5',
          'chrome-dark': '#737373',
          // Modern accent colors - vibrant but refined
          accent: '#3b82f6', // Modern blue
          'accent-dark': '#2563eb',
          'accent-light': '#60a5fa',
          'accent-glow': '#3b82f6',
          // Secondary accents
          danger: '#ef4444',
          warning: '#f59e0b',
          success: '#10b981',
          // Text colors with better contrast
          'text-primary': '#ffffff',
          'text-secondary': '#e5e5e5',
          'text-muted': '#a3a3a3',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.15)' },
          '100%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.25)' },
        },
        'pulse-accent': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(180deg, #050505 0%, #0f0f0f 50%, #1a1a1a 100%)',
        'gradient-accent': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #60a5fa 100%)',
        'gradient-accent-glow': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)',
        'gradient-chrome': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
        'noise': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.02\'/%3E%3C/svg%3E")',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.25), 0 0 40px rgba(59, 130, 246, 0.1)',
        'glow-lg': '0 0 30px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.15)',
        'glow-intense': '0 0 40px rgba(59, 130, 246, 0.4), 0 0 80px rgba(59, 130, 246, 0.2)',
        'elevated': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'elevated-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
        'inset': 'inset 0 1px 2px rgba(0, 0, 0, 0.2)',
        'chrome': '0 1px 2px rgba(255, 255, 255, 0.05)',
      },
    }
  },
  darkMode: 'class',
  plugins: []
}
export default config
