/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Tăng caching để giảm reload
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // 1h
    pagesBufferLength: 5,
  },
};

module.exports = nextConfig;
