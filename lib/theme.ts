export type ThemePreference = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "forge-starter-theme";
export const THEME_CHANGE_EVENT = "forge-starter-theme-change";

/**
 * Inlined in app/layout.tsx before hydration so a dark preference never flashes light.
 * "system" follows prefers-color-scheme live; other tabs follow through the storage event.
 */
export const themeBootScript = `(function(){var k="${THEME_STORAGE_KEY}",q=matchMedia("(prefers-color-scheme: dark)");function p(){try{return localStorage.getItem(k)||"light"}catch(e){return"light"}}function a(){var v=p(),d=v==="dark"||(v==="system"&&q.matches),r=document.documentElement;if(d)r.dataset.theme="dark";else delete r.dataset.theme}a();q.addEventListener("change",a);addEventListener("storage",function(e){if(e.key===k)a()});addEventListener("${THEME_CHANGE_EVENT}",a)})()`;

export function readThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "dark" || stored === "system" ? stored : "light";
  } catch {
    return "light";
  }
}

export function saveThemePreference(preference: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Storage blocked: nothing to remember, the page stays on the light theme.
  }
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}
