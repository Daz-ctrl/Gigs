import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.1.8",
    "192.168.1.*",
    "192.168.*.*",
    "10.*.*.*",
    "172.*.*.*",
    "localhost",
    "127.0.0.1",
    "*.local",
  ],
};

export default nextConfig;
