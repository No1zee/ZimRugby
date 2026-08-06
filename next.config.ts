import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const globalSecurityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Vary", value: "Accept-Encoding" }
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
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://vercel.com https://*.vercel.live https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://vercel.live https://*.vercel.live https://fonts.googleapis.com",
      "img-src 'self' data: blob: http://localhost:8055 https://assets.directus.io https://vercel.com https://vercel.live https://*.vercel.live https://images.unsplash.com https://plus.unsplash.com https://r2.thesportsdb.com https://flagcdn.com https://zru.co.zw https://img.youtube.com https://i.ytimg.com https://i1.ytimg.com https://i2.ytimg.com https://i3.ytimg.com https://i4.ytimg.com https://*.fbcdn.net https://*.facebook.com",
      "font-src 'self' data: https://fonts.gstatic.com https://frontend-cdn.perplexity.ai",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://vercel.live https://*.vercel.live",
      "connect-src 'self' ws: wss: http://localhost:8055 https://vercel.live https://*.vercel.live wss://*.vercel.live wss://*.vercel.com https://*.supabase.co https://*.directus.app"
    ].join("; ")
  },
  {
    key: "Vary",
    value: "Accept-Encoding, User-Agent"
  }
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'i2.ytimg.com' },
      { protocol: 'https', hostname: 'i3.ytimg.com' },
      { protocol: 'https', hostname: 'i4.ytimg.com' },
      { protocol: 'https', hostname: '*.fbcdn.net' },
      { protocol: 'http', hostname: 'localhost', port: '8055' },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: globalSecurityHeaders,
      },
      {
        source: "/((?!api/|_next/static|_next/image|favicon.ico).*)",
        headers: pageSpecificHeaders,
      },
    ];
  },
};

export default bundleAnalyzer(nextConfig);
