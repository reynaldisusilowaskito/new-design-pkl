import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'surabaya.go.id', pathname: '/uploads/**' },
      { protocol: 'https', hostname: 'www.surabaya.go.id', pathname: '/uploads/**' },
      { protocol: 'https', hostname: 'webdisplay.surabaya.go.id', pathname: '/**' },
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
    ],
  },
}

export default nextConfig
