import { DEFAULT_APP_ENTRIES, type AppEntry } from "@/config/apps";
import { normalizeAppEntry } from "@/lib/apps/registry";

/** SSR-safe default rows so 应用管理 is never an empty flash if effects lag. */
export function getDefaultAppRegistry(): AppEntry[] {
  return DEFAULT_APP_ENTRIES.map((entry) => normalizeAppEntry(entry));
}
