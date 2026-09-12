import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // Next 16 blocks /_next/* (including webpack-hmr and chunks) from any host
  // other than the one the server bound. Opening http://127.0.0.1:<port> while
  // `next dev` advertises localhost (typical Docker port-forward) prevents
  // hydration — login handlers, store useEffect, and localStorage never run.
  allowedDevOrigins: ["127.0.0.1", "localhost", "[::1]"],
};

export default nextConfig;
