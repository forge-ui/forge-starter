"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Breadcrumbs } from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";

const titles: Record<string, string> = {
  "/settings/profile": "个人资料",
  "/settings/security": "修改密码",
  "/settings/apps": "应用管理",
  "/settings/notifications": "系统设置",
};

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const normalized = pathname.endsWith("/") && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;
  const pageTitle = titles[normalized] ?? "设置";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
          {pageTitle}
        </h1>
        <Breadcrumbs
          color={siteConfig.accent}
          items={[
            { label: "工作台", href: "/dashboard/" },
            { label: "设置", href: "/settings/profile/" },
            { label: pageTitle },
          ]}
        />
      </div>
      {children}
    </div>
  );
}
