"use client";

import {
  HomeSmileBoldDuotone,
  KeyMinimalisticBoldDuotone,
  SettingsBoldDuotone,
  UserCircleBoldDuotone,
  UsersGroupTwoRoundedBoldDuotone,
  WidgetBoldDuotone,
  BellBoldDuotone,
} from "solar-icon-set";
import type { AppLayoutMenuItem, AppLayoutProfile } from "@forge-ui-official/core";
import {
  modulesForApp,
  type AppEntry,
  type AppModuleId,
} from "@/config/apps";

const SETTINGS_CHILDREN: AppLayoutMenuItem[] = [
  {
    icon: <UserCircleBoldDuotone size={20} />,
    label: "个人资料",
    href: "/settings/profile/",
  },
  {
    icon: <KeyMinimalisticBoldDuotone size={20} />,
    label: "修改密码",
    href: "/settings/security/",
  },
  {
    icon: <WidgetBoldDuotone size={20} />,
    label: "应用管理",
    href: "/settings/apps/",
  },
  {
    icon: <BellBoldDuotone size={20} />,
    label: "系统设置",
    href: "/settings/notifications/",
  },
];

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
    children: SETTINGS_CHILDREN,
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
  // Always expose settings so app registry remains reachable
  const ordered: AppModuleId[] = [];
  for (const id of mods) {
    if (!ordered.includes(id)) ordered.push(id);
  }
  if (!ordered.includes("settings")) ordered.push("settings");
  return ordered.map((id) => MODULE_MENU[id]);
}

export const defaultProfile: AppLayoutProfile = {
  avatar: "",
  name: "未登录",
  role: "访客",
};
