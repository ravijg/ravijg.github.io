import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export for GitHub Pages (https://ravijg.github.io) — `next build` writes ./out.
  output: "export",
  // Pages serves /about/ as /about/index.html; trailing slashes avoid 404s on direct loads.
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // No image server on GitHub Pages.
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["react-icons", "framer-motion", "@react-three/drei"],
  },
};

export default nextConfig;
