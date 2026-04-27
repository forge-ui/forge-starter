"use client";

import {
  HomeSmileBoldDuotone,
  ChartSquareBoldDuotone,
  UsersGroupTwoRoundedBoldDuotone,
  InboxBoldDuotone,
  CalendarBoldDuotone,
  FolderBoldDuotone,
  StarBoldDuotone,
} from "solar-icon-set";
import type { AppLayoutMenuItem, AppLayoutProfile } from "@forge-ui/react";

export const menuItems: AppLayoutMenuItem[] = [
  { icon: <HomeSmileBoldDuotone size={20} />, label: "工作台", href: "/dashboard" },
  { icon: <InboxBoldDuotone size={20} />, label: "收件箱", href: "#inbox", badge: 3 },
  { icon: <CalendarBoldDuotone size={20} />, label: "日历", href: "#calendar" },
  { icon: <ChartSquareBoldDuotone size={20} />, label: "数据分析", href: "#analytics" },
  { icon: <UsersGroupTwoRoundedBoldDuotone size={20} />, label: "团队", href: "#team" },
];

export const favoriteItems: AppLayoutMenuItem[] = [
  { icon: <FolderBoldDuotone size={20} />, label: "项目", href: "#projects" },
  { icon: <StarBoldDuotone size={20} />, label: "收藏", href: "#starred" },
];

export const profile: AppLayoutProfile = {
  avatar: "https://i.pravatar.cc/150?u=forge-starter",
  name: "陈晓",
  role: "产品经理",
};
