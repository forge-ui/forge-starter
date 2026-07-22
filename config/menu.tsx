"use client";

import {
  HomeSmileBold,
  ChartSquareBold,
  UsersGroupTwoRoundedBold,
  InboxBold,
  CalendarBold,
  FolderBold,
  StarBold,
} from "solar-icon-set";
import type { AppLayoutMenuItem, AppLayoutProfile } from "@forge-ui-official/core";

export const menuItems: AppLayoutMenuItem[] = [
  { icon: <HomeSmileBold size={20} />, label: "工作台", href: "/dashboard/" },
  { icon: <InboxBold size={20} />, label: "收件箱", href: "/inbox/", badge: 3 },
  { icon: <CalendarBold size={20} />, label: "日历", href: "/calendar/" },
  { icon: <ChartSquareBold size={20} />, label: "数据分析", href: "/analytics/" },
  { icon: <UsersGroupTwoRoundedBold size={20} />, label: "团队", href: "/team/" },
];

export const favoriteItems: AppLayoutMenuItem[] = [
  { icon: <FolderBold size={20} />, label: "项目", href: "/projects/" },
  { icon: <StarBold size={20} />, label: "收藏", href: "/starred/" },
];

export const profile: AppLayoutProfile = {
  avatar: "https://i.pravatar.cc/150?u=forge-starter",
  name: "陈晓",
  role: "产品经理",
};
