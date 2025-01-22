import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    BASE_URL: process.env.BE_URL,
  },
};

export default nextConfig;
