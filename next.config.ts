import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      {
        pathname: "/**",
        search: "?*",
      },
      {
        pathname: "/**",
        search: "",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "zru-directus-cms-production.up.railway.app",
      },
      {
        protocol: "https",
        hostname: "zru.co.zw",
      },
      {
        protocol: "https",
        hostname: "www.zru.co.zw",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "*.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
  },
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https://images.unsplash.com https://zru-directus-cms-production.up.railway.app https://zru.co.zw https://www.zru.co.zw https://img.youtube.com https://*.ytimg.com https://flagcdn.com;
      media-src 'self' https://*.youtube.com https://*.youtube-nocookie.com;
      connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.upstash.io https://*.qstash.io https://zru-directus-cms-production.up.railway.app;
      frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://youtube-nocookie.com;
      font-src 'self' data:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
    `.replace(/\s{2,}/g, ' ').trim();

    // Apply security headers only to pages and API routes.
    // Excluding /_next/static, /_next/image, /images, /fonts, and /favicon
    // prevents Vercel from counting those static-asset fetches as edge invocations.
    const securityHeaders = [
      {
        key: "Content-Security-Policy",
        value: cspHeader,
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=()",
      },
      {
        key: "X-Permitted-Cross-Domain-Policies",
        value: "none",
      },
    ];

    return [
      // Static assets — aggressive immutable edge cache (saves bandwidth and compute)
      {
        source: "/(images|fonts|icons)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Pages and API routes — need full security headers
      {
        source: "/((?!_next/static|_next/image|images|fonts|favicon|icons|manifest\\.json).*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/fan-zone",
        destination: "/1987-club",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
