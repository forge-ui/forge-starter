"use client";

import {
  HomeSmileBoldDuotone,
  UsersGroupTwoRoundedBoldDuotone,
} from "solar-icon-set";
import type { AppLayoutMenuItem, AppLayoutProfile } from "@forge-ui-official/core";

export const menuItems: AppLayoutMenuItem[] = [
  { icon: <HomeSmileBoldDuotone size={20} />, label: "工作台", href: "/dashboard/" },
  { icon: <UsersGroupTwoRoundedBoldDuotone size={20} />, label: "账号管理", href: "/accounts/" },
];

export const defaultProfile: AppLayoutProfile = {
  avatar: "",
  name: "未登录",
  role: "访客",
};
