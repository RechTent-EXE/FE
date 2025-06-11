/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["placeholder.svg"],
    unoptimized: true,
  },
  // Tắt hot reload tự động để tránh reload liên tục
  onDemandEntries: {
    maxInactiveAge: 1000 * 60 * 60, // 1 tiếng
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;
