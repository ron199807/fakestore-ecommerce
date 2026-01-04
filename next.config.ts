import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // reactCompiler: true,
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
        port: '',
        pathname: '/img/**',
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
