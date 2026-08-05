"use client";

import {
  ClipboardListBoldDuotone,
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

// 个人资料 / 改密 / 系统偏好走侧栏 profile 菜单，不占主菜单。
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

/** OA 审批 — skill new-module demo（非 AppModuleId，固定挂在基础菜单） */
const APPROVALS_MENU: AppLayoutMenuItem = {
  icon: <ClipboardListBoldDuotone size={20} />,
  label: "审批中心",
  href: "/approvals/",
};

/** Default full product menu */
export const menuItems: AppLayoutMenuItem[] = [
  MODULE_MENU.dashboard,
  MODULE_MENU.accounts,
  APPROVALS_MENU,
  MODULE_MENU.settings,
];

export function menuItemsForApp(app: AppEntry | null | undefined): AppLayoutMenuItem[] {
  if (!app || app.kind !== "internal") {
    return [MODULE_MENU.dashboard, APPROVALS_MENU, MODULE_MENU.settings];
  }
  const mods = modulesForApp(app);
  const ordered: AppModuleId[] = [];
  for (const id of mods) {
    if (!ordered.includes(id)) ordered.push(id);
  }
  if (!ordered.includes("settings")) ordered.push("settings");
  const items = ordered.map((id) => MODULE_MENU[id]);
  // Insert OA demo after accounts (or after dashboard if accounts missing)
  const accountsIdx = items.findIndex((i) => i.href === "/accounts/");
  if (accountsIdx >= 0) {
    items.splice(accountsIdx + 1, 0, APPROVALS_MENU);
  } else {
    items.splice(1, 0, APPROVALS_MENU);
  }
  return items;
}

export const defaultProfile: AppLayoutProfile = {
  avatar: "",
  name: "未登录",
  role: "访客",
};
