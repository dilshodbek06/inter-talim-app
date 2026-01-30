import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
      ...(isDev
        ? {
            allowedOrigins: [
              "localhost:3000",
              "127.0.0.1:3000",
              "0.0.0.0:3000",
              "*.devtunnels.ms",
              "*.vscode.dev",
              "*.github.dev",
            ],
          }
        : {}),
    },
  },
};

export default nextConfig;
