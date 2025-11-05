import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // 👈 aumenta para 10 MB (ou mais se quiser)
    },
  },
};

export default nextConfig;
