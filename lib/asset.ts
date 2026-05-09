// public/ 下的静态资源路径 helper。
// next/image 会处理 basePath，但 <img>、CSS background-image、metadata 里要手动加。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${basePath}${path}`;
}
