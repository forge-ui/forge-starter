/* eslint-disable @next/next/no-img-element */

import { HeartBold } from "solar-icon-set";
import { asset } from "@/lib/asset";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-stretch p-6 bg-white">
      {/* 左侧 hero 图 + 装饰卡片，Figma 原版视觉 */}
      <div className="relative hidden h-auto w-[640px] shrink-0 overflow-hidden rounded-2xl lg:block">
        <img
          src={asset("/images/hero.jpg")}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* 右下装饰 — chart card */}
        <img
          src={asset("/images/chart-card.png")}
          alt=""
          className="absolute right-8 bottom-32 w-[228px] h-[246px] object-cover pointer-events-none"
        />
        {/* 左下装饰 — stat card */}
        <img
          src={asset("/images/stat-card.png")}
          alt=""
          className="absolute left-8 bottom-12 w-[240px] h-[156px] object-cover pointer-events-none"
        />
      </div>

      {/* 右侧表单 */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-10">
        {children}

        {/* Copyright footer 居中底部 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 text-sm text-fg-grey-700 whitespace-nowrap">
          <span>© 2026 Made With</span>
          <HeartBold size={14} color="#EF4444" />
          <span>By Forge</span>
        </div>
      </div>
    </div>
  );
}
