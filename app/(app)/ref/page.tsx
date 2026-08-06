"use client";

import Link from "next/link";
import { Breadcrumbs, StatusBadge } from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { REF_PAGES, refPath } from "@/lib/reference/catalog";
import { RefChrome } from "@/components/reference/ref-chrome";

/**
 * AI reference gallery index — not in product menu.
 * @see docs/reference-pages.md
 */
export default function RefIndexPage() {
  return (
    <RefChrome>
      <div className="flex flex-col gap-1">
        <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
          页面范式参考库
        </h1>
        <Breadcrumbs
          color={siteConfig.accent}
          items={[{ label: "参考索引" }]}
        />
        <p className="mt-2 max-w-2xl text-sm text-fg-grey-600">
          真实可渲染页面，专供 Agent / 开发对照。业务模块请抄这里的结构 + 可运行样板
          （accounts、approvals），不要当成产品功能。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {REF_PAGES.map((page) => (
          <Link
            key={page.slug}
            href={refPath(page.slug)}
            className="flex flex-col gap-3 rounded-2xl bg-white p-5 outline outline-1 outline-offset-[-1px] outline-fg-grey-200 transition hover:outline-fg-blue-200"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-base font-semibold text-fg-black">{page.title}</h2>
              <StatusBadge label={page.role} color="blue" />
            </div>
            <p className="text-sm leading-6 text-fg-grey-600">{page.summary}</p>
            <p className="text-xs text-fg-grey-500">
              {page.components.slice(0, 4).join(" · ")}
              {page.components.length > 4 ? " …" : ""}
            </p>
            <span className="text-sm font-medium text-fg-blue">打开 →</span>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-5 text-sm text-fg-grey-600 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
        <p className="font-semibold text-fg-black">可运行业务样板（在菜单里）</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            <Link href="/accounts/" className="text-fg-blue hover:underline">
              /accounts
            </Link>
            {" "}重详情 CRUD
          </li>
          <li>
            <Link href="/approvals/" className="text-fg-blue hover:underline">
              /approvals
            </Link>
            {" "}轻详情弹窗
          </li>
          <li>
            <Link href="/dashboard/" className="text-fg-blue hover:underline">
              /dashboard
            </Link>
            {" "}完整工作台
          </li>
        </ul>
      </div>
    </RefChrome>
  );
}
