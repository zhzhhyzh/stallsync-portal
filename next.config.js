/** @type {import('next').NextConfig} */

const webpack = require("webpack");

const securityHeaders = [
  {
    //reduces latency when the user clicks a link.
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    //no iframe
    key: "X-Frame-Options",
    value: "deny",
  },
  {
    //only https and 2 years age
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    //block XSS
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    // prevent XSS exploits for websites that allow users to upload and share files.
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  trailingSlash: true,
  images: {
    domains: ['api-goagent.33digitec.com'],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};



module.exports = nextConfig;
