import type { NextConfig } from "next";

// 走 GitHub Pages 部署时打开静态导出。自定义域名 starter.forgeui.org 走根路径，basePath 留空。
const isGhPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGhPages ? "export" : undefined,
  images: { unoptimized: isGhPages },
  trailingSlash: isGhPages,
  env: {
    NEXT_PUBLIC_BASE_PATH: "",
  },
};

export default nextConfig;
