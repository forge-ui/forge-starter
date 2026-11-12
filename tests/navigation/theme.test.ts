import assert from "node:assert/strict";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { moduleIdForPath } from "../../config/apps";
import { THEME_CHANGE_EVENT, THEME_STORAGE_KEY, themeBootScript } from "../../lib/theme";

/** Runs the boot script against a fake browser and returns hooks to drive it. */
function boot(stored: string | null, systemDark: boolean) {
  const listeners: Record<string, ((event: { key?: string }) => void)[]> = {};
  const media: (() => void)[] = [];
  const query = { matches: systemDark, addEventListener: (_: string, listener: () => void) => media.push(listener) };
  const root = { dataset: {} as Record<string, string> };
  const storage = { value: stored };
  runInNewContext(themeBootScript, {
    document: { documentElement: root },
    localStorage: { getItem: (key: string) => (key === THEME_STORAGE_KEY ? storage.value : null) },
    matchMedia: () => query,
    addEventListener: (type: string, listener: (event: { key?: string }) => void) => (listeners[type] ??= []).push(listener),
  });
  return {
    theme: () => root.dataset.theme,
    setSystem(dark: boolean) { query.matches = dark; media.forEach(listener => listener()); },
    setStored(value: string) { storage.value = value; listeners[THEME_CHANGE_EVENT]?.forEach(listener => listener({})); },
  };
}

test("theme boot script applies the saved preference before hydration", () => {
  assert.equal(boot(null, true).theme(), undefined);
  assert.equal(boot("light", true).theme(), undefined);
  assert.equal(boot("dark", false).theme(), "dark");
});

test("system preference follows the operating system live", () => {
  const page = boot("system", false);
  assert.equal(page.theme(), undefined);
  page.setSystem(true);
  assert.equal(page.theme(), "dark");
  page.setStored("light");
  assert.equal(page.theme(), undefined);
});

test("appearance settings are open to every signed-in user", () => {
  assert.equal(moduleIdForPath("/settings/appearance/"), null);
});
