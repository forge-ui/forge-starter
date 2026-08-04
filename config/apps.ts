/**
 * App registry model:
 * - link: external bookmark URL
 * - external: URL + auth mode placeholder
 * - internal: selected nav modules (same shell, filtered menu)
 */

export type AppKind = "link" | "external" | "internal";

export type AppOpenMode = "same_tab" | "new_tab";

/**
 * Auth strategy (placeholder for real SSO later).
 * - none | passthrough | oidc | platform
 */
export type AppAuthMode = "none" | "passthrough" | "oidc" | "platform";

/** Built-in nav modules for internal apps */
export type AppModuleId = "dashboard" | "accounts" | "settings";

/** @deprecated kept for localStorage migration only */
export type MenuPresetId = "accounts-admin" | "dashboard-only" | "accounts-only" | "custom";

export type AppEntry = {
  id: string;
  name: string;
  subtitle: string;
  avatar?: string;
  kind: AppKind;
  href: string | null;
  openMode: AppOpenMode;
  authMode: AppAuthMode;
  /** @deprecated use modules */
  menuPreset?: MenuPresetId;
  /** internal: selected sidebar menus */
  modules: AppModuleId[];
  isCurrentProduct?: boolean;
};

export const APP_KIND_META: Record<
  AppKind,
  { label: string; description: string }
> = {
  link: {
    label: "外部链接",
    description: "快捷入口，跳转已有系统，不编排菜单",
  },
  external: {
    label: "外部系统",
    description: "独立部署后台；可配置认证方式（先占位）",
  },
  internal: {
    label: "内部应用",
    description: "本平台模块组合；切换后侧栏菜单随之变化",
  },
};

export const APP_AUTH_META: Record<AppAuthMode, { label: string }> = {
  none: { label: "无（对方自行登录）" },
  passthrough: { label: "透传会话（预留）" },
  oidc: { label: "OIDC（预留）" },
  platform: { label: "需先登录本平台" },
};

export const APP_OPEN_META: Record<AppOpenMode, { label: string }> = {
  same_tab: { label: "当前标签" },
  new_tab: { label: "新标签页" },
};

export const APP_MODULE_META: Record<
  AppModuleId,
  { label: string; href: string }
> = {
  dashboard: { label: "工作台", href: "/dashboard/" },
  accounts: { label: "账号管理", href: "/accounts/" },
  settings: { label: "应用管理", href: "/settings/apps/" },
};

/** Legacy presets → modules (migration) */
export const MENU_PRESET_META: Record<
  MenuPresetId,
  { label: string; modules: AppModuleId[] }
> = {
  "accounts-admin": {
    label: "基础后台（完整）",
    modules: ["dashboard", "accounts", "settings"],
  },
  "dashboard-only": {
    label: "仅工作台",
    modules: ["dashboard"],
  },
  "accounts-only": {
    label: "仅账号管理",
    modules: ["accounts"],
  },
  custom: {
    label: "自定义",
    modules: [],
  },
};

export const DEFAULT_APP_ENTRIES: AppEntry[] = [
  {
    id: "accounts-admin",
    name: "基础后台",
    subtitle: "当前产品",
    kind: "internal",
    href: "/dashboard/",
    openMode: "same_tab",
    authMode: "platform",
    modules: ["dashboard", "accounts", "settings"],
    isCurrentProduct: true,
  },
];

export const DEFAULT_APP_ID =
  DEFAULT_APP_ENTRIES.find((a) => a.isCurrentProduct)?.id
  ?? DEFAULT_APP_ENTRIES[0]!.id;

export const APPS_STORAGE_KEY = "forge-starter:app-registry";
export const ACTIVE_APP_STORAGE_KEY = "forge-starter:active-app-id";
export const APPS_UPDATED_EVENT = "forge-starter:apps-updated";

export const APP_ENTRIES = DEFAULT_APP_ENTRIES;

export function modulesForApp(app: AppEntry): AppModuleId[] {
  if (app.kind !== "internal") return [];
  if (app.modules?.length) return app.modules;
  if (app.menuPreset && MENU_PRESET_META[app.menuPreset]) {
    const fromPreset = MENU_PRESET_META[app.menuPreset].modules;
    if (fromPreset.length) return fromPreset;
  }
  return ["dashboard"];
}

export function modulesLabel(app: AppEntry): string {
  return modulesForApp(app)
    .map((m) => APP_MODULE_META[m]?.label ?? m)
    .join("、") || "—";
}

export function homePathForApp(app: AppEntry): string {
  if (app.kind === "internal") {
    const mods = modulesForApp(app);
    const first = mods[0] ?? "dashboard";
    return APP_MODULE_META[first].href;
  }
  return app.href?.trim() || "/dashboard/";
}
