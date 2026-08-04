export const siteConfig = {
  name: "Forge Starter",
  teamName: "账号管理后台",
  accent: "blue" as const,
};

export type RouteShell = {
  title: string;
  primaryAction?: { label: string; href: string };
  hideHeader?: boolean;
};

/** Keys without trailing slash */
export const routeShells: Record<string, RouteShell> = {
  "/dashboard": { title: "工作台", hideHeader: true },
  "/accounts": { title: "账号管理", hideHeader: true },
  "/settings": { title: "设置", hideHeader: true },
};

export function shellForPath(pathname: string): RouteShell {
  const normalized = pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
  if (normalized.match(/^\/accounts\/[^/]+$/)) {
    return { title: "账号详情", hideHeader: true };
  }
  return routeShells[normalized] ?? { title: siteConfig.name };
}
