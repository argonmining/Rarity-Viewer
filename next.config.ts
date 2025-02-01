import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  // Add additional security headers
  async headers() {
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
  // Optimize production builds
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    serverActions: {}
  }
};

export default nextConfig;
