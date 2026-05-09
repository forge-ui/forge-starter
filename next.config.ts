import type { NextConfig } from "next";

// 走 GitHub Pages 部署时打开静态导出；默认保持 Next.js/Vercel 部署方式。
const isGhPages = process.env.GITHUB_PAGES === "true";
const basePath = isGhPages ? "/forge-starter" : "";

const nextConfig: NextConfig = {
  basePath,
  output: isGhPages ? "export" : undefined,
  images: { unoptimized: isGhPages },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
