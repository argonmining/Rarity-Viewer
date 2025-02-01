/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cache.krc721.stream',
        pathname: '/krc721/mainnet/**'
      },
      {
        protocol: 'https',
        hostname: '*.ipfs.dweb.link',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: '*.ipfs.io',
        pathname: '/**'
      }
    ]
  },
  headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ]
  },
  poweredByHeader: false,
  reactStrictMode: true
}

module.exports = nextConfig 