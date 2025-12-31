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
          // Deep industrial blacks - garage aesthetic
          DEFAULT: '#0a0a0a',
          dark: '#000000',
          'dark-soft': '#0d0d0d',
          light: '#1a1a1a',
          'light-soft': '#2a2a2a',
          // Chrome/metallic accents
          chrome: '#c0c0c0',
          'chrome-bright': '#e8e8e8',
          'chrome-dark': '#808080',
          // Edgy accent colors - bold and aggressive
          accent: '#ff4500', // Orange-red (fire, danger, power)
          'accent-dark': '#cc3300',
          'accent-light': '#ff6633',
          'accent-glow': '#ff5500',
          // Secondary accents
          danger: '#dc2626', // Red for warnings
          warning: '#f59e0b', // Amber
          // Text colors
          'text-primary': '#f5f5f5',
          'text-secondary': '#d4d4d4',
          'text-muted': '#a3a3a3',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
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
          '0%': { boxShadow: '0 0 10px rgba(255, 69, 0, 0.5), 0 0 20px rgba(255, 69, 0, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(255, 69, 0, 0.8), 0 0 60px rgba(255, 69, 0, 0.5)' },
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
        'gradient-hero': 'linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #1a1a1a 100%)',
        'gradient-accent': 'linear-gradient(135deg, #ff4500 0%, #cc3300 50%, #ff6633 100%)',
        'gradient-accent-glow': 'linear-gradient(135deg, #ff5500 0%, #ff4500 50%, #ff6633 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        'gradient-chrome': 'linear-gradient(135deg, rgba(192,192,192,0.1) 0%, rgba(128,128,128,0.05) 100%)',
        'noise': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 69, 0, 0.4), 0 0 40px rgba(255, 69, 0, 0.2)',
        'glow-lg': '0 0 30px rgba(255, 69, 0, 0.5), 0 0 60px rgba(255, 69, 0, 0.3)',
        'glow-intense': '0 0 40px rgba(255, 69, 0, 0.6), 0 0 80px rgba(255, 69, 0, 0.4)',
        'elevated': '0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 10px 20px -5px rgba(0, 0, 0, 0.3)',
        'inset': 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
        'chrome': '0 4px 6px -1px rgba(192, 192, 192, 0.1), 0 2px 4px -1px rgba(192, 192, 192, 0.05)',
      },
    }
  },
  darkMode: 'class',
  plugins: []
}
export default config
