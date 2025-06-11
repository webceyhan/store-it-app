import type { NextConfig } from "next";
import { MAX_FILE_SIZE } from "./constants";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      // Set the maximum file size for uploads
      bodySizeLimit: MAX_FILE_SIZE, 
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
      },
      {
        protocol: "https",
        hostname: "fra.cloud.appwrite.io",
      },
    ],
  },
};

export default nextConfig;
