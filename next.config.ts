import type { NextConfig } from "next";

const globalSecurityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload"
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Vary", value: "Accept-Encoding" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" }
];

const pageSpecificHeaders = [
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()"
  },
  {
    key: "Content-Security-Policy",
    value: [
      "base-uri 'self'",
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com https://vercel.com https://*.vercel.live",
      "style-src 'self' 'unsafe-inline' https://vercel.live https://*.vercel.live https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://assets.directus.io https://vercel.com https://vercel.live https://*.vercel.live https://images.unsplash.com https://plus.unsplash.com https://zru.co.zw https://r2.thesportsdb.com https://flagcdn.com https://i.ytimg.com",
      "font-src 'self' data: https://fonts.gstatic.com https://frontend-cdn.perplexity.ai",
      "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://vercel.live https://*.vercel.live",
      "connect-src 'self' ws: wss: https://vercel.live https://*.vercel.live wss://*.vercel.live wss://*.vercel.com https://*.supabase.co https://*.directus.app",
      "frame-ancestors 'self' https://vercel.com https://*.vercel.sh https://*.vercel.com https://*.perplexity.ai",
      "object-src 'none'",
      "upgrade-insecure-requests"
    ].join("; ")
  },
  {
    key: "Vary",
    value: "Accept-Encoding, User-Agent"
  }
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // 1. Global Security Headers applied to ALL files (including static JS/CSS chunks)
        source: "/(.*)",
        headers: globalSecurityHeaders
      },
      {
        // 2. Page-Specific Headers applied ONLY to pages and dynamic endpoints (excludes static chunks, images, fonts)
        source: "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
        headers: pageSpecificHeaders
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/sables',
        destination: '/teams/sables',
        permanent: true,
      },
      {
        source: '/road-to-the-world-cup',
        destination: '/world-cup-campaign',
        permanent: true,
      },
    ];
  },
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1351, 1366, 1440, 1920, 2048],
    imageSizes: [16, 18, 22, 32, 48, 62, 64, 96, 128, 256, 262, 384, 620],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'zru.co.zw',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'r2.thesportsdb.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
