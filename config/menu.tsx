"use client";

import {
  HomeSmileBoldDuotone,
  UsersGroupTwoRoundedBoldDuotone,
  WidgetBoldDuotone,
} from "solar-icon-set";
import type { AppLayoutMenuItem, AppLayoutProfile } from "@forge-ui-official/core";
import {
  modulesForApp,
  type AppEntry,
  type AppModuleId,
} from "@/config/apps";

// 个人资料、改密、系统偏好走侧栏 profile 菜单，不占主菜单。
const MODULE_MENU: Record<AppModuleId, AppLayoutMenuItem> = {
  dashboard: {
    icon: <HomeSmileBoldDuotone size={20} />,
    label: "工作台",
    href: "/dashboard/",
  },
  accounts: {
    icon: <UsersGroupTwoRoundedBoldDuotone size={20} />,
    label: "账号管理",
    href: "/accounts/",
  },
  settings: {
    icon: <WidgetBoldDuotone size={20} />,
    label: "应用管理",
    href: "/settings/apps/",
  },
};

/** Default full product menu */
export const menuItems: AppLayoutMenuItem[] = [
  MODULE_MENU.dashboard,
  MODULE_MENU.accounts,
  MODULE_MENU.settings,
];

export function menuItemsForApp(app: AppEntry | null | undefined): AppLayoutMenuItem[] {
  if (!app || app.kind !== "internal") {
    return [MODULE_MENU.dashboard, MODULE_MENU.settings];
  }
  const mods = modulesForApp(app);
  const ordered: AppModuleId[] = [];
  for (const id of mods) {
    if (!ordered.includes(id)) ordered.push(id);
  }
  if (!ordered.includes("settings")) ordered.push("settings");
  return ordered.map((id) => MODULE_MENU[id]);
}

export const defaultProfile: AppLayoutProfile = {
  // 空串会触发 React「empty string passed to src」警告，用占位头像兜底
  avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=guest",
  name: "未登录",
  role: "访客",
};
