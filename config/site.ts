export const siteConfig = {
  name: "Forge Starter",
  teamName: "Forge Starter 基础后台",
  accent: "blue" as const,
};

export type RouteShell = {
  title: string;
  primaryAction?: { label: string; href: string };
  hideHeader?: boolean;
  headerVariant?: "home" | "detail";
  backHref?: string;
};

/** Keys without trailing slash */
export const routeShells: Record<string, RouteShell> = {
  "/dashboard": { title: "工作台", hideHeader: true },
  "/accounts": { title: "账号管理", hideHeader: true },
  "/approvals": { title: "审批中心", hideHeader: true },
  "/roles": { title: "角色", hideHeader: true },
  "/menus": { title: "菜单", hideHeader: true },
  "/permissions": { title: "权限", hideHeader: true },
  "/settings": { title: "设置", hideHeader: true },
  "/settings/apps": { title: "应用管理", hideHeader: true },
  "/ref": { title: "页面参考库", hideHeader: true },
};

export function shellForPath(pathname: string): RouteShell {
  const normalized = pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
  if (normalized.match(/^\/accounts\/[^/]+$/)) {
    return {
      title: "账号详情",
      hideHeader: true,
      headerVariant: "detail",
      backHref: "/accounts/",
    };
  }
  if (normalized === "/ref" || normalized.startsWith("/ref/")) {
    return { title: "页面参考库", hideHeader: true };
  }
  return routeShells[normalized] ?? { title: siteConfig.name };
}
