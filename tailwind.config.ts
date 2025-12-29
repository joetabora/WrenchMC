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
          DEFAULT: '#1F2937',
          accent: '#D97706'
        }
      }
    }
  },
  darkMode: 'class',
  plugins: []
}
export default config
