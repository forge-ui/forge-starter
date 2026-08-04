import {
  ACTIVE_APP_STORAGE_KEY,
  APPS_STORAGE_KEY,
  APPS_UPDATED_EVENT,
  DEFAULT_APP_ENTRIES,
  DEFAULT_APP_ID,
  type AppEntry,
} from "@/config/apps";

function safeParse(raw: string | null): AppEntry[] | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return null;
    return data.filter(
      (item): item is AppEntry =>
        Boolean(item)
        && typeof item === "object"
        && typeof (item as AppEntry).id === "string"
        && typeof (item as AppEntry).name === "string",
    );
  } catch {
    return null;
  }
}

function ensureCurrentProduct(list: AppEntry[]): AppEntry[] {
  const builtin = DEFAULT_APP_ENTRIES.find((a) => a.isCurrentProduct);
  if (!builtin) return list;
  const rest = list.filter((a) => a.id !== builtin.id && !a.isCurrentProduct);
  return [{ ...builtin }, ...rest];
}

export function loadAppRegistry(): AppEntry[] {
  if (typeof window === "undefined") return [...DEFAULT_APP_ENTRIES];
  try {
    const parsed = safeParse(window.localStorage.getItem(APPS_STORAGE_KEY));
    if (!parsed || parsed.length === 0) return [...DEFAULT_APP_ENTRIES];
    return ensureCurrentProduct(
      parsed.map((item) => ({
        id: item.id,
        name: item.name.trim() || "未命名应用",
        subtitle: item.subtitle?.trim() || "",
        avatar: item.avatar,
        href: item.href?.trim() ? item.href.trim() : null,
        isCurrentProduct: item.id === DEFAULT_APP_ID || item.isCurrentProduct,
      })),
    );
  } catch {
    return [...DEFAULT_APP_ENTRIES];
  }
}

export function saveAppRegistry(apps: AppEntry[]) {
  if (typeof window === "undefined") return;
  const next = ensureCurrentProduct(apps);
  window.localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(APPS_UPDATED_EVENT, { detail: { apps: next } }));
}

export function loadActiveAppId(apps: AppEntry[]): string {
  if (typeof window === "undefined") return DEFAULT_APP_ID;
  try {
    const raw = window.localStorage.getItem(ACTIVE_APP_STORAGE_KEY);
    if (raw && apps.some((a) => a.id === raw)) return raw;
  } catch {
    // ignore
  }
  return apps.find((a) => a.isCurrentProduct)?.id ?? DEFAULT_APP_ID;
}

export function saveActiveAppId(id: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ACTIVE_APP_STORAGE_KEY, id);
  } catch {
    // ignore
  }
}

export function createAppId() {
  return `app-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
