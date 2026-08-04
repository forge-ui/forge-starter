/* eslint-disable @next/next/no-img-element */

import { asset } from "@/lib/asset";
import { siteConfig } from "@/config/site";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen w-full items-stretch bg-white p-6">
      <div className="relative hidden h-auto w-[640px] shrink-0 overflow-hidden rounded-2xl lg:block">
        <img
          src={asset("/images/hero.png")}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <img
          src={asset("/images/chart-card.png")}
          alt=""
          className="pointer-events-none absolute bottom-32 right-8 h-[246px] w-[228px] object-cover"
        />
        <img
          src={asset("/images/stat-card.png")}
          alt=""
          className="pointer-events-none absolute bottom-12 left-8 h-[156px] w-[240px] object-cover"
        />
      </div>

      <div className="relative flex flex-1 items-center justify-center px-6 py-10">
        {children}

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-xs leading-5 tracking-fg text-fg-grey-500 whitespace-nowrap">
          © {year} {siteConfig.teamName}
        </div>
      </div>
    </div>
  );
}
