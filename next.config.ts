import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload"
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()"
  },
  {
    key: "Content-Security-Policy",
    value: [
      "base-uri 'self'",
      "default-src 'self'",
      // Allow inline script and eval for Next.js hydration, Turbopack, and Vercel toolbar
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://vercel.com https://*.vercel.live",
      "style-src 'self' 'unsafe-inline' https://vercel.live https://*.vercel.live",
      // Allow image loading from Directus, flags, and Vercel assets
      "img-src 'self' data: blob: https://assets.directus.io https://vercel.com https://vercel.live https://*.vercel.live https://images.unsplash.com https://plus.unsplash.com https://r2.thesportsdb.com https://flagcdn.com",
      // Allow Google Fonts, Perplexity CDN fonts, and inline data-uri fonts
      "font-src 'self' data: https://fonts.gstatic.com https://frontend-cdn.perplexity.ai",
      "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://vercel.live https://*.vercel.live",
      // Allow development hot-reload websockets, Vercel feedback streams, and Directus/Supabase endpoints
      "connect-src 'self' ws: wss: https://vercel.live https://*.vercel.live wss://*.vercel.live wss://*.vercel.com https://*.supabase.co https://*.directus.app"
    ].join("; ")
  }
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
        headers: [
          ...securityHeaders,
          {
            key: "Vary",
            value: "Accept-Encoding, User-Agent"
          }
        ]
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
    ],
  },
};

export default nextConfig;
