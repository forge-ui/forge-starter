/**
 * App switcher entries for AppLayout `teams` slot.
 * Core Team type: { id, name, avatar?, active? }
 * Click handling lives in app-shell (presentational popover).
 */

export type AppEntry = {
  id: string;
  name: string;
  /** Short line under the current app title */
  subtitle: string;
  avatar?: string;
  /**
   * Where to go when selected:
   * - internal path (same Next app): e.g. "/dashboard/"
   * - external URL: e.g. "https://other.example.com"
   * - null: placeholder (stay, mark active only for demo)
   */
  href: string | null;
  /** This starter app (账号管理) */
  isCurrentProduct?: boolean;
};

export const APP_ENTRIES: AppEntry[] = [
  {
    id: "accounts-admin",
    name: "账号管理后台",
    subtitle: "当前应用",
    href: "/dashboard/",
    isCurrentProduct: true,
  },
  {
    id: "ops-console",
    name: "运营工作台",
    subtitle: "示例 · 可接独立部署",
    href: null,
  },
  {
    id: "content-hub",
    name: "内容中心",
    subtitle: "示例 · 可接独立部署",
    href: null,
  },
];

export const DEFAULT_APP_ID =
  APP_ENTRIES.find((a) => a.isCurrentProduct)?.id ?? APP_ENTRIES[0]!.id;

export const ACTIVE_APP_STORAGE_KEY = "forge-starter:active-app-id";
