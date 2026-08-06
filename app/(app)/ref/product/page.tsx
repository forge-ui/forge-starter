"use client";

/**
 * Product multi-tab detail — ecommerce/products/[id]
 * https://www.forgeui.org/templates/.../products
 */

import { useMemo, useState } from "react";
import {
  Button,
  CellMuted,
  CellText,
  DataTable,
  StatusBadge,
  TabBar,
  type ColumnDef,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";

const meta = REF_PAGES.find((p) => p.slug === "product")!;

const tabs = ["详情", "订单", "评价", "留言"];

const orders = [
  { id: "#302012", customer: "John Bushmill", total: "¥ 890", status: "处理中", color: "yellow" as const },
  { id: "#302011", customer: "Ilham Budi", total: "¥ 1,290", status: "已发货", color: "green" as const },
  { id: "#302002", customer: "Linda Blair", total: "¥ 420", status: "已取消", color: "red" as const },
  { id: "#301901", customer: "Josh Adam", total: "¥ 2,100", status: "已完成", color: "green" as const },
];

const reviews = [
  { id: "1", customer: "John", rating: "5", comment: "续航和做工都不错。", date: "2 Jan 2026" },
  { id: "2", customer: "Ilham", rating: "4", comment: "通知及时，表带略硬。", date: "28 Dec 2025" },
  { id: "3", customer: "Karim", rating: "3", comment: "亮度一般，整体还行。", date: "20 Dec 2025" },
];

const messages = [
  { id: "1", customer: "John", message: "这款防水吗？", date: "5 分钟前" },
  { id: "2", customer: "Linda", message: "红色什么时候补货？", date: "1 小时前" },
  { id: "3", customer: "Josh", message: "批量 5 台有折扣吗？", date: "昨天" },
];

const images = [
  "https://placehold.co/120x120/e2e8f0/64748b?text=1",
  "https://placehold.co/120x120/e2e8f0/64748b?text=2",
  "https://placehold.co/120x120/e2e8f0/64748b?text=3",
  "https://placehold.co/120x120/e2e8f0/64748b?text=4",
];

type OrderRow = (typeof orders)[number];

export default function RefProductPage() {
  const [tab, setTab] = useState(0);
  const [mainImg, setMainImg] = useState(images[0]);

  const orderColumns: ColumnDef<OrderRow>[] = useMemo(
    () => [
      {
        key: "id",
        header: "订单号",
        width: "w-28",
        render: (row) => <CellText>{row.id}</CellText>,
      },
      {
        key: "customer",
        header: "客户",
        flex: true,
        render: (row) => <CellText>{row.customer}</CellText>,
      },
      {
        key: "total",
        header: "金额",
        width: "w-28",
        render: (row) => <CellMuted>{row.total}</CellMuted>,
      },
      {
        key: "status",
        header: "状态",
        width: "w-28",
        render: (row) => (
          <div className="flex h-10 items-center">
            <StatusBadge label={row.status} color={row.color} />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <RefChrome meta={meta}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-fg-black">Forge Watch Pro</h2>
            <StatusBadge label="在售" color="green" />
          </div>
          <p className="mt-1 text-sm text-fg-grey-500">SKU-WT-2041 · 智能穿戴</p>
        </div>
        <div className="flex gap-2">
          <Button color={siteConfig.accent} variant="tertiary">
            编辑
          </Button>
          <Button color={siteConfig.accent}>上架推广</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mainImg}
            alt=""
            className="aspect-square w-full rounded-2xl object-cover outline outline-1 outline-fg-grey-200"
          />
          <div className="grid grid-cols-4 gap-2">
            {images.map((src) => (
              <button key={src} type="button" onClick={() => setMainImg(src)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className={`aspect-square w-full rounded-lg object-cover outline outline-1 ${
                    mainImg === src ? "outline-fg-blue" : "outline-fg-grey-200"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["售价", "¥ 1,299"],
              ["库存", "128"],
              ["销量", "2,401"],
              ["评分", "4.6"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="rounded-2xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-fg-grey-200"
              >
                <p className="text-xs text-fg-grey-500">{k}</p>
                <p className="mt-1 text-lg font-semibold text-fg-black">{v}</p>
              </div>
            ))}
          </div>

          <div className="border-b border-fg-grey-200">
            <TabBar
              color={siteConfig.accent}
              surface="page"
              tabs={tabs.map((label, i) => ({ label, active: i === tab }))}
              onChange={setTab}
            />
          </div>

          {tab === 0 ? (
            <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
              <h3 className="text-base font-semibold text-fg-black">商品说明</h3>
              <p className="mt-3 text-sm leading-6 text-fg-grey-700">
                多 Tab 产品详情范式：左侧媒体，右侧指标 + Tab（详情 / 订单 / 评价 / 留言）。
                业务页按字段替换即可，结构对齐 ecommerce products/[id]。
              </p>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ["品牌", "Forge"],
                  ["品类", "智能手表"],
                  ["颜色", "石墨黑 / 银"],
                  ["保修", "12 个月"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-fg-grey-500">{k}</dt>
                    <dd className="text-sm font-medium text-fg-black">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          {tab === 1 ? (
            <DataTable<OrderRow>
              color={siteConfig.accent}
              columns={orderColumns}
              rows={orders}
              getRowKey={(row) => row.id}
            />
          ) : null}

          {tab === 2 ? (
            <div className="flex flex-col gap-3">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-fg-grey-200"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-fg-black">{r.customer}</p>
                    <span className="text-xs text-fg-grey-500">{r.date}</span>
                  </div>
                  <p className="mt-1 text-xs text-fg-yellow-600">评分 {r.rating}/5</p>
                  <p className="mt-2 text-sm text-fg-grey-700">{r.comment}</p>
                </div>
              ))}
            </div>
          ) : null}

          {tab === 3 ? (
            <div className="flex flex-col gap-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className="flex items-start justify-between gap-3 rounded-xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-fg-grey-200"
                >
                  <div>
                    <p className="text-sm font-semibold text-fg-black">{m.customer}</p>
                    <p className="mt-1 text-sm text-fg-grey-700">{m.message}</p>
                  </div>
                  <span className="shrink-0 text-xs text-fg-grey-500">{m.date}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </RefChrome>
  );
}
