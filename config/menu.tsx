"use client";

import { SettingsBoldDuotone } from "@forge-ui-official/core/icons";
import { moduleIcons } from "./module-icons.generated";
import { MODULES } from "./modules.generated";
import type { AppLayoutMenuItem, AppLayoutProfile } from "@forge-ui-official/core";
import {
  APP_MODULE_IDS,
  modulesForApp,
  type AppEntry,
  type AppModuleId,
} from "@/config/apps";

// 个人资料、改密、系统偏好走侧栏 profile 菜单，不占主菜单。
export const MODULE_MENU = Object.fromEntries(MODULES.map(module => {
  const Icon = moduleIcons[module.menu.icon as keyof typeof moduleIcons];
  return [module.id, { icon: <Icon size={20} />, label: module.label, href: module.menu.href }];
})) as Record<AppModuleId, AppLayoutMenuItem>;

// Personal preference, not a module: every signed-in user sees it and no permission guards it.
export const APPEARANCE_MENU: AppLayoutMenuItem = { icon: <SettingsBoldDuotone size={20} />, label: "外观", href: "/settings/appearance/" };

/** Default full product menu */
export const menuItems: AppLayoutMenuItem[] = APP_MODULE_IDS.map((id) => MODULE_MENU[id]);

export function menuItemsForApp(
  app: AppEntry | null | undefined,
  allowedModules?: readonly AppModuleId[] | null,
): AppLayoutMenuItem[] {
  let ids: AppModuleId[];
  if (!app || app.kind !== "internal") {
    ids = ["dashboard", "settings"];
  } else {
    const selected = new Set(modulesForApp(app));
    selected.add("settings");
    ids = APP_MODULE_IDS.filter((id) => selected.has(id));
  }

  if (allowedModules == null) {
    return ids.includes("dashboard") ? [MODULE_MENU.dashboard] : [];
  }

  const allowed = new Set(allowedModules);
  return [...ids.filter((id) => allowed.has(id)).map((id) => MODULE_MENU[id]), APPEARANCE_MENU];
}

export const defaultProfile: AppLayoutProfile = {
  // 空串会触发 React「empty string passed to src」警告，用占位头像兜底
  avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=guest",
  name: "未登录",
  role: "访客",
};
