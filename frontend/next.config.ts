import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/invocations',
        destination: 'http://localhost:8080/invocations',
      },
    ];
  },
};

export default nextConfig;
