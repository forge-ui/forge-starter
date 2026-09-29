import { sourceFingerprint } from "./tooling/semantic/fingerprint";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_SEMANTIC_BUILD_ID: sourceFingerprint(process.cwd()) },
  // Isolated local verification may run alongside the user's dev server.
  distDir: process.env.SEMANTIC_TEST_DIST === "true" ? ".semantic-next" : ".next",
  // Let OpenNext resolve Postgres.js' workerd export instead of bundling
  // the Node.js TLS implementation into the Worker.
  serverExternalPackages: ["postgres"],
  trailingSlash: true,
  // Next 16 blocks /_next/* (including webpack-hmr and chunks) from any host
  // other than the one the server bound. Opening http://127.0.0.1:<port> while
  // `next dev` advertises localhost (typical Docker port-forward) prevents
  // hydration — login handlers, store useEffect, and localStorage never run.
  allowedDevOrigins: ["127.0.0.1", "localhost", "[::1]"],
};

export default nextConfig;
