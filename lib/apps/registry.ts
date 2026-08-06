import {
  ACTIVE_APP_STORAGE_KEY,
  APPS_STORAGE_KEY,
  APPS_UPDATED_EVENT,
  DEFAULT_APP_ENTRIES,
  DEFAULT_APP_ID,
  MENU_PRESET_META,
  type AppAuthMode,
  type AppEntry,
  type AppKind,
  type AppModuleId,
  type AppOpenMode,
  type MenuPresetId,
} from "@/config/apps";

const KINDS: AppKind[] = ["link", "external", "internal"];
const OPEN: AppOpenMode[] = ["same_tab", "new_tab"];
const AUTH: AppAuthMode[] = ["none", "passthrough", "oidc", "platform"];
const PRESETS: MenuPresetId[] = [
  "accounts-admin",
  "dashboard-only",
  "accounts-only",
  "custom",
];
const MODULES: AppModuleId[] = [
  "dashboard",
  "accounts",
  "settings",
  "procurement",
  "suppliers",
  "purchase-orders",
];

function asKind(v: unknown): AppKind {
  return typeof v === "string" && (KINDS as string[]).includes(v)
    ? (v as AppKind)
    : "link";
}

function asOpen(v: unknown): AppOpenMode {
  return typeof v === "string" && (OPEN as string[]).includes(v)
    ? (v as AppOpenMode)
    : "same_tab";
}

function asAuth(v: unknown): AppAuthMode {
  return typeof v === "string" && (AUTH as string[]).includes(v)
    ? (v as AppAuthMode)
    : "none";
}

function asPreset(v: unknown): MenuPresetId {
  return typeof v === "string" && (PRESETS as string[]).includes(v)
    ? (v as MenuPresetId)
    : "accounts-admin";
}

function asModules(v: unknown): AppModuleId[] {
  if (!Array.isArray(v)) return ["dashboard"];
  return v.filter(
    (m): m is AppModuleId => typeof m === "string" && (MODULES as string[]).includes(m),
  );
}

/** Migrate legacy flat entries (name + href only) */
export function normalizeAppEntry(raw: Partial<AppEntry> & { id?: string; name?: string }): AppEntry {
  const id = typeof raw.id === "string" ? raw.id : createAppId();
  const name = (raw.name ?? "未命名应用").trim() || "未命名应用";
  const isCurrent = id === DEFAULT_APP_ID || Boolean(raw.isCurrentProduct);

  if (isCurrent) {
    // Always pin host product naming from defaults (ignore stale localStorage name)
    const builtin = DEFAULT_APP_ENTRIES[0]!;
    return {
      ...builtin,
      name: builtin.name,
      subtitle: builtin.subtitle,
    };
  }

  // Legacy: no kind but had href → treat as link
  const kind = raw.kind ? asKind(raw.kind) : raw.href ? "link" : "internal";
  const href =
    typeof raw.href === "string" && raw.href.trim()
      ? raw.href.trim()
      : kind === "internal"
        ? "/dashboard/"
        : null;

  let modules = asModules(raw.modules);
  if (kind === "internal" && modules.length === 0 && raw.menuPreset) {
    const fromPreset = MENU_PRESET_META[asPreset(raw.menuPreset)]?.modules;
    if (fromPreset?.length) modules = [...fromPreset];
  }
  if (kind === "internal" && modules.length === 0) {
    modules = ["dashboard"];
  }

  return {
    id,
    name,
    subtitle: (raw.subtitle ?? "").trim(),
    avatar: raw.avatar,
    kind,
    href,
    openMode: asOpen(raw.openMode),
    authMode: asAuth(raw.authMode),
    modules,
    isCurrentProduct: false,
  };
}

function safeParse(raw: string | null): unknown[] | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as unknown;
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

/**
 * Always pin built-in catalog apps (accounts-admin, procurement, …).
 * localStorage may predate new seeds — merge by id without wiping user-added apps.
 */
function mergeBuiltinApps(list: AppEntry[]): AppEntry[] {
  const byId = new Map(list.map((a) => [a.id, a]));
  for (const builtin of DEFAULT_APP_ENTRIES) {
    const existing = byId.get(builtin.id);
    if (!existing) {
      byId.set(builtin.id, normalizeAppEntry(builtin));
      continue;
    }
    // Refresh modules/href/name from code for known seeds (keeps user openMode etc.)
    byId.set(
      builtin.id,
      normalizeAppEntry({
        ...existing,
        name: builtin.name,
        subtitle: builtin.subtitle,
        kind: builtin.kind,
        href: builtin.href,
        modules: builtin.modules,
        isCurrentProduct: builtin.isCurrentProduct,
        authMode: builtin.authMode,
      }),
    );
  }

  // Host product first, then remaining builtins in DEFAULT order, then user apps
  const ordered: AppEntry[] = [];
  const seen = new Set<string>();
  for (const builtin of DEFAULT_APP_ENTRIES) {
    const entry = byId.get(builtin.id);
    if (entry) {
      ordered.push(entry);
      seen.add(builtin.id);
    }
  }
  for (const entry of byId.values()) {
    if (!seen.has(entry.id) && !entry.isCurrentProduct) {
      ordered.push(normalizeAppEntry(entry));
    }
  }
  // Guarantee exactly one current product
  const host = DEFAULT_APP_ENTRIES.find((a) => a.isCurrentProduct) ?? DEFAULT_APP_ENTRIES[0]!;
  return ordered.map((a) =>
    a.id === host.id
      ? { ...a, isCurrentProduct: true }
      : { ...a, isCurrentProduct: false },
  );
}

export function loadAppRegistry(): AppEntry[] {
  if (typeof window === "undefined") return DEFAULT_APP_ENTRIES.map(normalizeAppEntry);
  try {
    const parsed = safeParse(window.localStorage.getItem(APPS_STORAGE_KEY));
    if (!parsed || parsed.length === 0) {
      return DEFAULT_APP_ENTRIES.map(normalizeAppEntry);
    }
    return mergeBuiltinApps(
      parsed.map((item) => normalizeAppEntry(item as Partial<AppEntry>)),
    );
  } catch {
    return DEFAULT_APP_ENTRIES.map(normalizeAppEntry);
  }
}

export function saveAppRegistry(apps: AppEntry[]) {
  if (typeof window === "undefined") return;
  const next = mergeBuiltinApps(apps.map(normalizeAppEntry));
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
