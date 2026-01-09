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
        // Harley-Apple Dark Theme
        wrench: {
          DEFAULT: '#000000',
          dark: '#000000',
          'dark-soft': '#0a0a0a',
          light: '#141414',
          'light-soft': '#1a1a1a',
          surface: '#0d0d0d',
          // Chrome/metallic accents
          chrome: '#e5e5e5',
          'chrome-bright': '#ffffff',
          'chrome-dark': '#737373',
          // Harley Orange/Flame accents
          accent: '#FF4500',
          'accent-dark': '#CC3700',
          'accent-light': '#FF6B35',
          'accent-glow': '#FF5722',
          // Secondary
          danger: '#ef4444',
          warning: '#f59e0b',
          success: '#22c55e',
          // Text
          'text-primary': '#ffffff',
          'text-secondary': '#a3a3a3',
          'text-muted': '#737373',
        },
        // Glass effect colors
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          light: 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.1)',
          'border-light': 'rgba(255, 255, 255, 0.15)',
        }
      },
      fontFamily: {
        sans: ['var(--font-sf)', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'flame-flicker': 'flameFlicker 0.5s ease-in-out infinite alternate',
        'wrench-spin': 'wrenchSpin 1.5s ease-in-out infinite',
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
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 69, 0, 0.3), 0 0 40px rgba(255, 69, 0, 0.1)' },
          '100%': { boxShadow: '0 0 30px rgba(255, 69, 0, 0.5), 0 0 60px rgba(255, 69, 0, 0.2)' },
        },
        flameFlicker: {
          '0%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
          '100%': { opacity: '0.9', transform: 'scale(0.98)' },
        },
        wrenchSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(15deg)' },
          '75%': { transform: 'rotate(-15deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-flame': 'linear-gradient(135deg, #FF4500 0%, #CC3700 50%, #FF6B35 100%)',
        'gradient-flame-subtle': 'linear-gradient(180deg, rgba(255,69,0,0.15) 0%, transparent 50%)',
        'gradient-dark': 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
        'leather': `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 69, 0, 0.3), 0 0 40px rgba(255, 69, 0, 0.15)',
        'glow-lg': '0 0 30px rgba(255, 69, 0, 0.4), 0 0 60px rgba(255, 69, 0, 0.2)',
        'glow-intense': '0 0 40px rgba(255, 69, 0, 0.5), 0 0 80px rgba(255, 69, 0, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.5)',
        'elevated': '0 4px 12px rgba(0, 0, 0, 0.3)',
        'elevated-lg': '0 8px 24px rgba(0, 0, 0, 0.4)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'chrome': '0 2px 8px rgba(255, 255, 255, 0.05)',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '20px',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
        'nav': '5rem', // 80px for bottom nav
      },
    }
  },
  darkMode: 'class',
  plugins: []
}
export default config
