import type { NextConfig } from "next";

// 走 GitHub Pages 部署时打开静态导出 + basePath。
// fork 的用户 pnpm dev / pnpm build 不受影响（默认值）。
const isGhPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGhPages ? "export" : undefined,
  basePath: isGhPages ? "/forge-starter" : "",
  images: { unoptimized: isGhPages },
  trailingSlash: isGhPages,
};

export default nextConfig;
