import type { NextConfig } from "next";

const remotePatterns: NextConfig["images"] extends { remotePatterns?: infer R }
  ? R
  : never = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    port: "",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "zru-directus-cms-production.up.railway.app",
    port: "",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "img.youtube.com",
    port: "",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "i.ytimg.com",
    port: "",
    pathname: "/**",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
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
        ],
      },
    ];
  },
};

export default nextConfig;
