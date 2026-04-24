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
  { icon: <HomeSmileBoldDuotone size={20} />, label: "Dashboard", href: "/dashboard" },
  { icon: <InboxBoldDuotone size={20} />, label: "Inbox", href: "#inbox", badge: 3 },
  { icon: <CalendarBoldDuotone size={20} />, label: "Calendar", href: "#calendar" },
  { icon: <ChartSquareBoldDuotone size={20} />, label: "Analytics", href: "#analytics" },
  { icon: <UsersGroupTwoRoundedBoldDuotone size={20} />, label: "Team", href: "#team" },
];

export const favoriteItems: AppLayoutMenuItem[] = [
  { icon: <FolderBoldDuotone size={20} />, label: "Projects", href: "#projects" },
  { icon: <StarBoldDuotone size={20} />, label: "Starred", href: "#starred" },
];

export const profile: AppLayoutProfile = {
  avatar: "https://i.pravatar.cc/150?u=forge-starter",
  name: "Alex Morgan",
  role: "Product Manager",
};
