"use client";

import {
  DocumentAddBoldDuotone,
  HamburgerMenuBoldDuotone,
  HomeSmileBoldDuotone,
  ShieldKeyholeBoldDuotone,
  ShieldUserBoldDuotone,
  UsersGroupTwoRoundedBoldDuotone,
  WidgetBoldDuotone,
} from "solar-icon-set";
import type { AppLayoutMenuItem, AppLayoutProfile } from "@forge-ui-official/core";
import {
  APP_MODULE_IDS,
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
  approvals: {
    icon: <DocumentAddBoldDuotone size={20} />,
    label: "审批中心",
    href: "/approvals/",
  },
  roles: {
    icon: <ShieldUserBoldDuotone size={20} />,
    label: "角色",
    href: "/roles/",
  },
  menus: {
    icon: <HamburgerMenuBoldDuotone size={20} />,
    label: "菜单",
    href: "/menus/",
  },
  permissions: {
    icon: <ShieldKeyholeBoldDuotone size={20} />,
    label: "权限",
    href: "/permissions/",
  },
  settings: {
    icon: <WidgetBoldDuotone size={20} />,
    label: "应用管理",
    href: "/settings/apps/",
  },
};

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
  return ids.filter((id) => allowed.has(id)).map((id) => MODULE_MENU[id]);
}

export const defaultProfile: AppLayoutProfile = {
  // 空串会触发 React「empty string passed to src」警告，用占位头像兜底
  avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=guest",
  name: "未登录",
  role: "访客",
};
