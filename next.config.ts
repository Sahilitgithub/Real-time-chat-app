import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  
  // 1. ADD THIS: This tells Next.js to treat Prisma as a standard Node.js package
    serverExternalPackages: ["@prisma/client"],

  // Note: Ensure this path is correct. 
  // If your project isn't part of a monorepo, you might not need this.
  outputFileTracingRoot: path.join(__dirname, "../../"),

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      }
    ]
  }
};

export default nextConfig;