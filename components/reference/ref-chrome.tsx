"use client";

import Link from "next/link";
import { Breadcrumbs } from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import type { RefPageMeta } from "@/lib/reference/catalog";

/** Banner + breadcrumbs for AI reference pages (not product UX). */
export function RefChrome({
  meta,
  children,
}: {
  meta?: RefPageMeta;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-dashed border-fg-blue-200 bg-fg-blue-50/60 px-4 py-3 text-sm text-fg-grey-700">
        <p className="font-semibold text-fg-black">AI、开发参考页 · 不进侧栏菜单</p>
        <p className="mt-1">
          路径前缀 <code className="text-fg-blue">/ref/*</code>
          。生产默认 404（设 <code className="text-fg-blue">SHOW_REF_PAGES=true</code> 可开）。
          索引：
          <Link href="/ref/" className="ml-1 font-medium text-fg-blue underline-offset-2 hover:underline">
            /ref/
          </Link>
        </p>
        {meta ? (
          <p className="mt-2 text-xs text-fg-grey-500">
            角色 <strong className="text-fg-black">{meta.role}</strong>
            {" · "}对照 {meta.forgeTemplate}
            {" · "}组件 {meta.components.join(", ")}
          </p>
        ) : null}
      </div>
      {meta ? (
        <div className="flex flex-col gap-1">
          <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
            {meta.title}
          </h1>
          <Breadcrumbs
            color={siteConfig.accent}
            items={[
              { label: "参考索引", href: "/ref/" },
              { label: meta.title },
            ]}
          />
          <p className="mt-1 text-sm text-fg-grey-500">{meta.summary}</p>
        </div>
      ) : null}
      {children}
    </div>
  );
}
