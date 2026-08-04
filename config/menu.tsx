"use client";

import {
  HomeSmileBoldDuotone,
  ClipboardListBoldDuotone,
  DocumentAddBoldDuotone,
  SettingsBoldDuotone,
} from "solar-icon-set";
import type { AppLayoutMenuItem, AppLayoutProfile } from "@forge-ui-official/core";

export const menuItems: AppLayoutMenuItem[] = [
  { icon: <HomeSmileBoldDuotone size={20} />, label: "工作台", href: "/dashboard/" },
  { icon: <ClipboardListBoldDuotone size={20} />, label: "业务记录", href: "/examples/list/" },
  { icon: <DocumentAddBoldDuotone size={20} />, label: "新建记录", href: "/examples/form/" },
  { icon: <SettingsBoldDuotone size={20} />, label: "设置", href: "/settings/" },
];

export const defaultProfile: AppLayoutProfile = {
  avatar: "",
  name: "未登录",
  role: "访客",
};
