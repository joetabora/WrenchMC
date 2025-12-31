/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Turbopack config (Next.js 16+)
  turbopack: {},
  // Webpack config for compatibility (if needed)
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle pdf-parse for server-side
      config.externals = [...(config.externals || []), 'canvas', 'jsdom']
    }
    return config
  }
}

module.exports = nextConfig
