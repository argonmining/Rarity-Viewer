/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'cache.krc721.stream',
      'bafybeidciudrflherjjbmwth3l35vnmrwtdfspux5zsoxgidhpnjz5xyya.ipfs.dweb.link'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ipfs.io',
      }
    ]
  },
}

module.exports = nextConfig 