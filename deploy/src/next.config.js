/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure static generation
  output: 'export',
  distDir: 'out',

  // Ignore build errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image optimization settings
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Add trailing slash to URLs
  trailingSlash: true,
};

export default nextConfig;
