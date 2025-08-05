/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除静态导出，恢复服务端功能
  // output: 'export',
  // 移除trailingSlash配置，因为它与NextAuth不兼容
  // trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig; 