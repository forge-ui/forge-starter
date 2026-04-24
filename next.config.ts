import type { NextConfig } from "next";

// 走 GitHub Pages 部署时打开静态导出 + basePath。
// fork 的用户 pnpm dev / pnpm build 不受影响（默认值）。
const isGhPages = process.env.GITHUB_PAGES === "true";
const basePath = isGhPages ? "/forge-starter" : "";

const nextConfig: NextConfig = {
  output: isGhPages ? "export" : undefined,
  basePath,
  images: { unoptimized: isGhPages },
  trailingSlash: isGhPages,
  env: {
    // 暴露 basePath 给客户端代码（lib/asset.ts 用）。next/image 自动处理，其他手动。
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
