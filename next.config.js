/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure output for better caching
  output: 'standalone',
  
  // Increase static generation timeout
  staticPageGenerationTimeout: 300,
  
  // Optimize ISR and static generation
  experimental: {
    // Optimize memory usage during builds
    optimizeCss: true,
    // Optimize bundle size
    optimizePackageImports: ['lucide-react', 'framer-motion']
  },
  
  // Configure images to allow GitHub domains
  images: {
    domains: ['raw.githubusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
