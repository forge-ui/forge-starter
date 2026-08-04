"use client";

import {
  HomeSmileBoldDuotone,
  SettingsBoldDuotone,
  UsersGroupTwoRoundedBoldDuotone,
} from "solar-icon-set";
import type { AppLayoutMenuItem, AppLayoutProfile } from "@forge-ui-official/core";
import {
  modulesForApp,
  type AppEntry,
  type AppModuleId,
} from "@/config/apps";

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
    icon: <SettingsBoldDuotone size={20} />,
    label: "设置",
    href: "/settings/",
  },
};

/** Default full product menu */
export const menuItems: AppLayoutMenuItem[] = [
  MODULE_MENU.dashboard,
  MODULE_MENU.accounts,
];

export function menuItemsForApp(app: AppEntry | null | undefined): AppLayoutMenuItem[] {
  if (!app || app.kind !== "internal") {
    // External / link: keep minimal shell so user can open settings via profile
    return [MODULE_MENU.dashboard];
  }
  const mods = modulesForApp(app);
  // Always allow settings access for app admin via profile; include if selected
  return mods.map((id) => MODULE_MENU[id]).filter(Boolean);
}

export const defaultProfile: AppLayoutProfile = {
  avatar: "",
  name: "未登录",
  role: "访客",
};
