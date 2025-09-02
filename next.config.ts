import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingRoot: __dirname,
  images: {
    domains: [
      'res.cloudinary.com',
      'lh3.googleusercontent.com', 
      'avatars.githubusercontent.com'],
  }
};

export default nextConfig;
