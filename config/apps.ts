/**
 * Default app switcher catalog. Runtime list is managed in Settings → 应用管理
 * and persisted in localStorage (see lib/apps/registry.ts).
 */

export type AppEntry = {
  id: string;
  name: string;
  /** Short line under the current app title */
  subtitle: string;
  avatar?: string;
  /**
   * Where to go when selected:
   * - internal path: e.g. "/dashboard/"
   * - external URL: e.g. "https://other.example.com"
   * - empty / null: placeholder (mark active only)
   */
  href: string | null;
  /** Built-in product of this starter — cannot be deleted */
  isCurrentProduct?: boolean;
};

export const DEFAULT_APP_ENTRIES: AppEntry[] = [
  {
    id: "accounts-admin",
    name: "账号管理后台",
    subtitle: "当前应用",
    href: "/dashboard/",
    isCurrentProduct: true,
  },
];

export const DEFAULT_APP_ID =
  DEFAULT_APP_ENTRIES.find((a) => a.isCurrentProduct)?.id
  ?? DEFAULT_APP_ENTRIES[0]!.id;

export const APPS_STORAGE_KEY = "forge-starter:app-registry";
export const ACTIVE_APP_STORAGE_KEY = "forge-starter:active-app-id";
export const APPS_UPDATED_EVENT = "forge-starter:apps-updated";

/** @deprecated use DEFAULT_APP_ENTRIES */
export const APP_ENTRIES = DEFAULT_APP_ENTRIES;
