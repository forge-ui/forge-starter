import assert from "node:assert/strict";
import { test } from "node:test";
import { APP_MODULE_IDS, APPS_STORAGE_KEY, DEFAULT_APP_ENTRIES, homePathForApp } from "@/config/apps";
import { loadAppRegistry, normalizeAppEntry, saveAppRegistry } from "@/lib/apps/registry";

test("configured host survives storage round trip and respects role permissions", () => {
  const values = new Map<string, string>();
  const previous = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    localStorage: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) },
    dispatchEvent: () => true,
  } });
  try {
    saveAppRegistry([{ ...DEFAULT_APP_ENTRIES[0]!, name: "运营后台", modules: ["accounts", "settings"], href: "/settings/apps/", hostConfigured: true }]);
    const host = loadAppRegistry()[0]!;
    assert.equal(host.name, "运营后台");
    assert.deepEqual(host.modules, ["accounts", "settings"]);
    assert.equal(homePathForApp(host), "/settings/apps/");
    assert.equal(homePathForApp(host, ["accounts"]), "/accounts/");
    assert.equal(host.kind, "internal");
    values.set(APPS_STORAGE_KEY, JSON.stringify([{ ...DEFAULT_APP_ENTRIES[0], modules: ["dashboard"] }]));
    assert.deepEqual(loadAppRegistry()[0]!.modules, [...APP_MODULE_IDS]);
    saveAppRegistry([]);
    assert.equal(loadAppRegistry()[0]!.id, DEFAULT_APP_ENTRIES[0]!.id);
  } finally {
    if (previous) Object.defineProperty(globalThis, "window", previous);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
test("host identity and management menu stay fixed; external entries cannot impersonate host", () => {
  const host = normalizeAppEntry({ ...DEFAULT_APP_ENTRIES[0], hostConfigured: true, modules: ["accounts"], href: "/not-a-page/", kind: "external", authMode: "none" });
  assert.deepEqual(host.modules, ["accounts", "settings"]);
  assert.equal(host.href, "/accounts/");
  assert.equal(host.authMode, "platform");
  assert.equal(host.kind, "internal");
  assert.equal(normalizeAppEntry({ id: "other", name: "Other", isCurrentProduct: true }).isCurrentProduct, false);
});
