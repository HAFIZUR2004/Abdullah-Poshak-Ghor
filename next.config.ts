import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["react-icons"],
  images: {
    qualities: [75, 100], // 👈 এই লাইনটি যোগ করুন
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;