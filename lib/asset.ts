// public/ 下的静态资源路径 helper。
// next/image 自动加 basePath，但 <img>、CSS background-image、metadata 里要手动加。
// GITHUB_PAGES=true 时 basePath 是 /forge-starter，本地 dev 是空。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${basePath}${path}`;
}
