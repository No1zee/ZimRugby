import type { NextConfig } from "next";

const toOrigin = (url?: string): string | null => {
  if (!url) return null;
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
};

const connectSrc = [
  "'self'",
  "https://*.vercel.com",
  "https://*.vercel.live",
  "wss://*.vercel.com",
  toOrigin(process.env.NEXT_PUBLIC_DIRECTUS_URL),
  toOrigin(process.env.NEXT_PUBLIC_SUPABASE_URL),
].filter(Boolean).join(" ");

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload"
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()"
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://zru.co.zw https://r2.thesportsdb.com https://flagcdn.com https://assets.directus.io",
      "font-src 'self' data: https://fonts.gstatic.com https://frontend-cdn.perplexity.ai",
      "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
      `connect-src ${connectSrc}`,
      "frame-ancestors 'self' https://vercel.com https://*.vercel.sh https://*.vercel.com https://*.perplexity.ai",
      "object-src 'none'",
      "upgrade-insecure-requests"
    ].join("; ")
  }
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders
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
