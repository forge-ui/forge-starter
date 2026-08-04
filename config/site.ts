export const siteConfig = {
  name: "Forge Starter",
  teamName: "你的团队",
  accent: "blue" as const,
};

export type RouteShell = {
  title: string;
  primaryAction?: { label: string; href: string };
  /** When true, page body owns the collection header (template Product List pattern). */
  hideHeader?: boolean;
};

/** Keys without trailing slash */
export const routeShells: Record<string, RouteShell> = {
  "/dashboard": { title: "工作台" },
  "/examples/list": {
    title: "业务记录",
    hideHeader: true,
  },
  "/examples/form": { title: "新建记录" },
  "/settings": { title: "设置" },
};

export function shellForPath(pathname: string): RouteShell {
  const normalized = pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
  return routeShells[normalized] ?? { title: siteConfig.name };
}
