import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Podcast thumbnails on /about
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'thenest.concentrix.com',
      },
      // Editorial food/NYC photography on /favorites
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    const csp = ({ googleFonts = false } = {}) =>
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
        `style-src 'self' 'unsafe-inline'${googleFonts ? ' https://fonts.googleapis.com' : ''}`,
        "img-src 'self' data: https://i.ytimg.com https://thenest.concentrix.com https://images.unsplash.com",
        `font-src 'self'${googleFonts ? ' https://fonts.gstatic.com' : ''}`,
        "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://va.vercel-scripts.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; ');
    const securityHeaders = [
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
    ];
    return [
      {
        source: '/((?!shared/|secure/).*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp() },
          ...securityHeaders,
        ],
      },
      {
        // Hosted secure pages bring their own markup, which may load Google Fonts
        source: '/secure/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp({ googleFonts: true }) },
          ...securityHeaders,
        ],
      },
    ];
  },
};

export default nextConfig;
